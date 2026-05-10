# CHANGELOG 格式规范化更新总结

## 🎯 更新目标

将 switch520-auto-secret 子工程的 CHANGELOG.md 统一为 HTML 格式，并在 SKILL.md 中明确发版工作流。

## ✅ 完成的修改

### 1. CHANGELOG.md 格式重构

**修改文件：** `projects/switch520-auto-secret/CHANGELOG.md`

**变更前：**
- 混用 h3、h4 标题
- 使用 hr 分隔线
- 包含 ol 有序列表
- 结构复杂，层级过多

**变更后：**
```html
<h2>🎉 X.Y.Z 版本更新</h2>
<ul>
    <li>改动描述 1</li>
    <li>改动描述 2</li>
    <li>改动描述 3</li>
</ul>
```

**优势：**
- ✅ 统一的 h2 + ul 结构
- ✅ 简洁明了，易于维护
- ✅ 适合 GreasyFork 等平台渲染
- ✅ 每个版本独立，无复杂层级

**版本记录：**
- 7.0.11 - 修复 switch618 点击事件
- 7.0.10 - 新增 fzgamer.com 支持
- 7.0.9 - 修复弹窗功能
- 6.0.0 - 二维码转直链等重大更新

### 2. SKILL.md 发版工作流更新

**修改文件：** `projects/switch520-auto-secret/SKILL.md`

**新增内容：**

#### 完整的发版流程（必须遵守）

```
步骤 1: 修改 CHANGELOG.md
  ↓
步骤 2: 更新 README.md
  ↓
步骤 3: 执行 release.sh 发版
```

#### 详细规范

**步骤 1 - CHANGELOG.md：**
- 使用 h2 + ul HTML 格式
- 版本号不带 v 前缀
- 添加 emoji 标识
- 插入在最新版本之前

**步骤 2 - README.md：**
- 同步 CHANGELOG 的最新版本
- 保持格式一致
- 让用户在 GreasyFork 等平台直接看到更新

**步骤 3 - release.sh：**
- 执行 `npm run release switch520-auto-secret <version>`
- 编辑 Release Notes（使用 Markdown 格式）
- 自动推送 Tag 并触发 CI/CD

#### Agent 执行模板更新

```
执行步骤:
1. ✅ 分析需求和影响范围
2. ✅ 创建/修改相关服务或组件
3. ✅ 在 index.tsx 中注册新服务
4. ✅ 本地测试功能
5. ✅ 更新 CHANGELOG.md (h2 + ul HTML 格式)
6. ✅ 更新 README.md (同步最新 CHANGELOG)
7. ✅ 提交更改并推送
8. ✅ 执行 release.sh 发版

注意事项:
- CHANGELOG.md 必须使用 HTML 格式 (h2 + ul)
- README.md 必须同步更新
```

### 3. RELEASE_TEMPLATE.md 优化

**修改文件：** `.github/RELEASE_TEMPLATE.md`

**更新内容：**
- 明确说明 CHANGELOG.md 使用 HTML 格式
- 明确说明 Release Notes 使用 Markdown 格式
- 提醒两者格式不同，不要混淆
- 添加格式转换提示

### 4. 根目录 SKILL.md 更新

**修改文件：** `SKILL.md`

**更新内容：**
- 步骤 2 的 CHANGELOG.md 格式要求改为 HTML 格式
- 添加重要规则说明
- 明确禁止使用 Markdown 的 ## 和 - 语法

## 📋 格式对比

### CHANGELOG.md（HTML 格式）

```html
<h2>🎉 7.0.12 版本更新</h2>
<ul>
    <li>新增游戏视频自动播放功能</li>
    <li>修复百度网盘链接拼接错误</li>
    <li>优化弹窗加载性能</li>
</ul>
```

### Release Notes（Markdown 格式）

```markdown
## 🎉 7.0.12 版本更新

### ✨ 新增
- 新增游戏视频自动播放功能

### 🐛 修复
- 修复百度网盘链接拼接错误

### 🔧 优化
- 优化弹窗加载性能
```

## 🎓 为什么使用不同格式？

### CHANGELOG.md - HTML 格式

**原因：**
1. **GreasyFork 兼容性** - GreasyFork 对 HTML 渲染更好
2. **README.md 展示** - 在油猴脚本描述中 HTML 更稳定
3. **简洁性** - h2 + ul 结构简单明了
4. **一致性** - 所有版本统一格式

### Release Notes - Markdown 格式

**原因：**
1. **GitHub Release** - 原生支持 Markdown
2. **可读性** - Markdown 更适合详细文档
3. **灵活性** - 支持代码块、链接等丰富格式
4. **编辑便利** - 本地编辑器体验更好

## 🔍 验证清单

发版前必须确认：

- [ ] CHANGELOG.md 使用 h2 + ul HTML 格式
- [ ] 版本号不带 v 前缀
- [ ] README.md 已同步最新版本
- [ ] Release Notes 使用 Markdown 格式
- [ ] 两者格式没有混淆

## 📝 示例工作流

```bash
# 场景：修复了 switch618 分页器问题

# 1. 修改 CHANGELOG.md
# 添加：
<h2>🐛 7.0.12 版本更新</h2>
<ul>
    <li>修复 switch618 页面分页器点击事件不生效问题</li>
</ul>

# 2. 更新 README.md
# 将上述内容复制到 README.md 的更新日志部分

# 3. 提交更改
git add CHANGELOG.md README.md
git commit -m "fix: 修复 switch618 分页器点击事件"
git push

# 4. 执行发布
npm run release 7.0.12

# 5. 编辑器打开，填写 Release Notes（Markdown 格式）
## 🐛 7.0.12 版本更新

### 修复
- 修复 switch618 页面分页器点击事件不生效问题
- 优化事件绑定逻辑，使用事件委托

# 6. 保存，等待 CI/CD 完成
```

## 🎯 关键要点

1. **CHANGELOG.md = HTML 格式** (h2 + ul)
2. **Release Notes = Markdown 格式** (## + -)
3. **README.md = 同步 CHANGELOG** (HTML 格式)
4. **发版顺序：CHANGELOG → README → release.sh**

---

**更新日期：** 2026-05-07  
**更新者：** AI Assistant  
**影响范围：** switch520-auto-secret 子工程  
**状态：** ✅ 已完成
