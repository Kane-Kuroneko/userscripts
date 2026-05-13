# Gamer520 iframe 内 Cookie 隔离问题技术复盘

> 记录 switch520-auto-secret 项目中 gamer520 密码保护页在 iframe 内陷入死循环的根因分析，以及为何从 TamperMonkey 脚本层面无法彻底解决。

---

## 1. 用户场景

```
用户浏览 switch520/fzgamer 等站点
  └── 打开弹窗(iframe)
       ├── 加载 www.gamer520.com/12211.html  (内容页，含"立即下载"按钮)
       │    └── 用户点击 → 脚本拦截 → location.href = /go?post_id=12211
       │         └── 302 重定向
       └── 加载 gamers520.com/24809.html  (WordPress 密码保护页)
            └── 脚本提取密码 → 自动填写 → 点击提交
                 └── POST wp-login.php?action=postpass
                      └── Set-Cookie: wp-postpass_xxx=...
                           └── 302 → 原地重载
                                ├─ ✅ 新标签页: Cookie 生效 → 显示下载内容
                                └─ ❌ iframe 内: Cookie 被丢弃 → 密码表单再次出现 → 死循环
```

---

## 2. WordPress 密码保护机制

WordPress 密码保护文章的标准流程：

```
GET /protected-post/
  → 检测无 wp-postpass_xxx Cookie
  → 返回密码输入表单 (the_content 被替换为 get_the_password_form())

POST /wp-login.php?action=postpass
  body: post_password=123456
  → 验证密码
  → Set-Cookie: wp-postpass_<hash>=<expiry>; path=/
  → 302 Location: /protected-post/

GET /protected-post/  (携带 wp-postpass_xxx Cookie)
  → Cookie 验证通过
  → 返回真实文章内容
```

**关键依赖**：第二步 Set-Cookie 和第三步的请求必须是同一 Cookie 存储作用域。Cookie 的 `path=/` 意味着它对整个域生效。

---

## 3. 浏览器第三方 Cookie 阻止策略

### 3.1 SameSite 属性

| SameSite 值 | 顶层导航 | iframe 内导航 | iframe 内表单 POST |
|---|---|---|---|
| `Strict` | ✅ 发送 | ❌ 不发送 | ❌ 不发送 |
| `Lax` (默认) | ✅ 发送 | ❌ 不发送 | ❌ 不发送 |
| `None; Secure` | ✅ 发送 | ✅ 发送 | ✅ 发送 |

WordPress 默认设置 `wp-postpass_xxx` Cookie **不指定 SameSite 属性**，浏览器按 `SameSite=Lax` 处理。

### 3.2 iframe 内的"第三方"判定

```
top:    switch520.com          ← 第一方(top-level)
  └── iframe: gamers520.com    ← 第三方(相对 top)
       └── 任何导航/表单提交   ← 第三方上下文
```

**结论**：`gamers520.com` 的 iframe 相对 `switch520.com` 是第三方。在第三方上下文中：

- **Set-Cookie 响应头**：Chrome/Safari/Firefox 在第三方上下文中**直接丢弃** `SameSite=Lax` 的 Set-Cookie。`wp-postpass_xxx` 从服务端返回了 Set-Cookie 头，但浏览器根本不会存储它。
- **Cookie 发送**：即使之前已有 Cookie，`SameSite=Lax` 的 Cookie 也不会在第三方请求中发送。

### 3.3 DevTools 验证

正常标签页 (顶层)：
```
Cookie: PHPSESSID=xxx; wp-postpass_8e15e...=xxx; wordpress_test_cookie=xxx; cao_notice_cookie=xxx
```

iframe 死循环中：
```
Cookie: PHPSESSID=xxx
```
仅 `PHPSESSID`（服务端通过 PHP 设置的 Session Cookie，`SameSite` 通常不限制）存在，`wp-postpass_xxx` 完全缺失。

---

## 4. 尝试过的方案及失败原因

### 方案 1：GM_xmlhttpRequest 提交密码后 location.href 跳转

```
GM_xmlhttpRequest → POST wp-login.php → 获取 Set-Cookie → 存储
location.href = /protected-post/
```

**失败原因**：`GM_xmlhttpRequest` 运行在 TamperMonkey 扩展的独立上下文中，它能接收 Set-Cookie 并存入扩展的 Cookie 存储。但 `location.href` 是页面导航请求，它使用浏览器标签页的 Cookie 存储——两者**不是同一 Cookie Jar**。

### 方案 2：fetch/ajax 提交密码

```js
fetch('/wp-login.php?action=postpass', {
    method: 'POST',
    body: 'post_password=123456',
    credentials: 'include'
}).then(() => location.href = '/protected-post/');
```

**失败原因**：与方案 1 类似，但更糟——`fetch` 本身就受第三方 Cookie 阻止策略约束：
- Set-Cookie 响应头在第三方上下文中被浏览器丢弃
- 即使使用了 `credentials: 'include'`，`SameSite=Lax` 的 Cookie 也不会被存储

### 方案 3：隐藏 iframe 中 form.submit()

```html
<!-- 在隐藏 iframe 中创建 form 并提交 -->
<iframe hidden>
  <form method="POST" action="/wp-login.php?action=postpass">
    <input name="post_password" value="123456">
  </form>
</iframe>
```

**失败原因**：Cookie 设置在**隐藏 iframe 的 Cookie Jar** 中，与当前可见 iframe 的 Cookie Jar **不共享**（不同的浏览上下文）。可见 iframe 的页面加载请求读不到隐藏 iframe 中设置的 Cookie。

### 方案 4：parent.location.href

```js
window.parent.location.href = 'https://gamers520.com/protected-post/';
```

**失败原因**：用户明确拒绝——"你这是把 parent 跳转了，不行，要在 iframe 中跳转"。这会破坏弹窗体验，把整个宿主页面导航走。

### 方案 5：URL 参数 ?pwd=xxx

```js
location.href = '/protected-post/?pwd=123456';
```

**失败原因**：WordPress 密码保护机制**不识别 URL 参数**。验证完全依赖 `wp-postpass_xxx` Cookie。`?pwd=` 参数对 WordPress Core 无意义（除非安装第三方插件支持）。

### 方案 6：document.write() 替换内容

```js
fetch('/wp-login.php?action=postpass', { method: 'POST', body: '...' })
  .then(r => r.text())
  .then(html => { document.open(); document.write(html); document.close(); });
```

**失败原因**：302 重定向后的内容是密码保护页本身（因为 Cookie 没生效），不是下载内容。而且页面的 JS/CSS 相对路径会断裂。

### 方案 7：iframe 内 window.open

```js
window.open('https://gamers520.com/protected-post/', '_blank');
```

**结果**：✅ 新标签页是顶层上下文，`SameSite=Lax` Cookie 正常生效。
**局限性**：用户必须离开弹窗，无法在弹窗内完成下载。

---

## 5. 根本原因总结

```
┌──────────────────────────────────────────────────────┐
│  浏览器安全沙箱                                        │
│                                                      │
│  iframe(gamers520.com) 是 top(switch520.com) 的第三方  │
│                                                      │
│  SameSite=Lax 策略:                                   │
│  ┌─────────────────────────────────────────┐         │
│  │ Set-Cookie → 第三方上下文 → 丢弃 ✗       │         │
│  │ Cookie发送 → 第三方上下文 → 阻止 ✗       │         │
│  └─────────────────────────────────────────┘         │
│                                                      │
│  TamperMonkey 无法绕过:                                │
│  ┌─────────────────────────────────────────┐         │
│  │ GM_xmlhttpRequest → 独立 Cookie Jar     │         │
│  │ fetch/ajax       → 同样受限             │         │
│  │ 隐藏iframe       → 独立上下文            │         │
│  │ document.write   → 无 Cookie 状态        │         │
│  └─────────────────────────────────────────┘         │
│                                                      │
│  这是 W3C 标准定义的浏览器安全模型，                     │
│  无法从用户脚本层面绕过。                               │
└──────────────────────────────────────────────────────┘
```

---

## 6. 最终方案：防死循环保护

既然无法在 iframe 内让 Cookie 生效，转为 **检测并规避死循环**。

### 6.1 三层防护

| 层级 | 机制 | GM_storage 键 | 持久化 |
|---|---|---|---|
| 1 | 10s 滑动窗口计数 | `g520_visit_ts` | ❌ (弹窗生命周期内) |
| 2 | 持久化域名黑名单 | `g520_blacklist` | ✅ (永久) |
| 3 | postMessage + window.open 双保险 | — | — |

### 6.2 时序

```
首次访问（正常）:
  click → location.href → 密码页 → 自动提交(1次)
  → Cookie 生效或失败

Cookie 失败 ×3（10s 内）:
  密码页 → 提交 → 302 → 密码页 → 提交 → 302 → 密码页
  → detect: 10s 内 3 次访问
  → blacklist "gamers520.com"
  → postMessage(parent) + window.open → 新标签页 ✅

下次弹窗:
  click → 预检查黑名单 → gamers520.com 已列入
  → window.open → 新标签页 ✅
```

### 6.3 涉及文件

- `services/auto-secret.service.ts` — 滑动窗口计数、黑名单维护、postMessage 发送
- `services/download-bypass.service.ts` — 跳转前黑名单预检查
- `index.tsx` — 顶层 postMessage 监听器

---

## 7. 结论

**该问题在 TamperMonkey 脚本层面不可彻底解决**，因为：

1. 浏览器第三方 Cookie 阻止策略是操作系统/浏览器级别的安全机制
2. TamperMonkey 的 `GM_xmlhttpRequest` 虽有独立 Cookie 存储，但无法与页面导航请求共享
3. 服务端（WordPress）的密码保护强制依赖 Cookie，不提供 URL 参数等回退机制
4. 从 iframe 发起顶层导航(`parent.location.href`)会破坏弹窗用户体验

**防死循环保护是当前约束下的最优解**：用滑动窗口检测异常循环，用持久化黑名单避免重复踩坑，用 postMessage/新标签页提供功能回退路径。

---

> 📅 2026-05-13 — switch520-auto-secret v7.1.0
