# Switch520 Auto Secret - Agent 技能文档

## 📋 项目概述

**Switch520 Auto Secret** 是一个 TamperMonkey 油猴脚本，用于优化多个游戏下载站的用户体验。

**支持的站点：**
- switch520.com
- switch618.com  
- fzgamer.com
- steamzg.com
- acgxj.com
- 其他相关站点

**核心功能：**
1. 📱 **二维码自动转直链** - 自动识别页面二维码并转换为可点击直链
2. 🔑 **下载资源自动填充密码** - 自动填充常用密码，零操作直达资源
3. ⚡ **简化下载流程** - 点击下载按钮直接进入下载地址页面
4. ☁️ **百度网盘免输入提取码** - 自动拼接提取码到 URL
5. 🎯 **划词搜索优化** - 选中游戏名称后，一键直达 Steam 中文搜索
6. 🕰️ **古早页面兼容** - 自动将老版本页面的网盘地址转为超链接
7. 🎮 **模态弹窗浏览** - 点击文章列表项弹出模态窗口浏览内容 (fzgamer.com)
8. 🔍 **搜索按钮集成** - 在站点添加"去Steam搜索"按钮

## 🏗️ 项目架构

```
switch520-auto-secret/
├── index.tsx                    # 入口文件，初始化所有服务
├── services/                    # 业务服务层
│   ├── auto-secret.service.ts          # 自动填充密码服务
│   ├── baidu-link.service.ts           # 百度网盘链接处理
│   ├── baidupan-auto-submit.service.ts # 百度网盘自动提交
│   ├── context-menu.service.ts         # 右键菜单服务
│   ├── download-bypass.service.ts      # 下载流程简化
│   ├── modal-mode.service.tsx          # 模态弹窗服务
│   └── qrcode-converter.service.ts     # 二维码转直链
├── features/                    # React 特性层
│   ├── search-in-steam/         # Steam 搜索功能
│   └── search-on-select/        # 划词搜索功能
├── Components/                  # React 组件
│   ├── OpenInModal/             # 弹窗组件
│   └── SearchInSteamButton/     # Steam 搜索按钮
├── DOM-finder/                  # 站点特定的 DOM 操作
│   ├── fzgamer.com/             # fzgamer 站点适配
│   ├── switch520.com/           # switch520 站点适配
│   ├── switch618.com/           # switch618 站点适配
│   └── steamzg.com/             # steamzg 站点适配
├── core/                        # 核心纯函数逻辑
│   ├── domain-matcher.ts        # 域名匹配工具
│   └── password-extractor.ts    # 密码提取器
├── utils/                       # 通用工具函数
│   ├── dom-helper.ts            # DOM 操作辅助
│   └── url-helper.ts            # URL 处理辅助
├── types/                       # TypeScript 类型定义
├── BaiduNetdiskLink/            # 百度网盘链接处理
├── QrcodeToLink/                # 二维码转链接
├── SearchOnSelect/              # 划词搜索
├── ProxyDetector.ts             # 代理检测器（仅开发环境）
├── style.less                   # 样式文件
├── webpack.partial.ts           # Webpack 配置
└── CHANGELOG.md                 # 更新日志
```

## 🚀 开发指南

### 本地开发

**启动开发服务器：**
```bash
# 在项目目录中
npm run start

# 或在根目录
npm run start:switch520-auto-secret
```

**构建项目：**
```bash
# 在项目目录中
npm run build

# 或在根目录
npm run build:switch520-auto-secret
```

**构建产物：**
- 输出目录：`dist/`
- 包含编译后的用户脚本文件

### 添加新功能

**1. 创建新服务：**
```typescript
// services/my-new.service.ts
export function initMyNewService(): void {
	// 服务初始化逻辑
	console.log('[switch520-auto-secret] MyNewService 已初始化');
	
	// 业务逻辑...
}
```

**2. 在入口文件中注册：**
```typescript
// index.tsx
import { initMyNewService } from './services/my-new.service';

// 在初始化部分调用
initMyNewService();
```

**3. 添加站点特定的 DOM 操作：**
```typescript
// DOM-finder/my-site.com/index.ts
export function adaptMySite(): void {
	const domain = 'my-site.com';
	// 站点适配逻辑
}
```

### 代码规范

**Import 顺序（必须遵守）：**
1. 相对路径的业务 ESM Import
2. 绝对路径的业务 ESM Import
3. node_modules 包
4. CSS/Less 模块
5. Types/Interfaces 声明

**示例：**
```typescript
// ✅ 正确
import { initAutoSecret } from './services/auto-secret.service';
import { initBaiduLinkService } from './services/baidu-link.service';
import jsqr from 'jsqr';
import "./style.less";

type ServiceConfig = {
	enabled: boolean;
	domain: string;
}

// ❌ 错误 - import 位置不对
import { initAutoSecret } from './services/auto-secret.service';
type ServiceConfig = { enabled: boolean };
import "./style.less";  // 应该在 types 之前
```

**缩进：** 使用 Tab 缩进

## 🔧 核心服务说明

### 1. auto-secret.service.ts
**功能：** 自动填充下载密码
**触发条件：** 访问下载资源页面
**实现：** 检测密码输入框并自动填写

### 2. baidu-link.service.ts
**功能：** 处理百度网盘链接
**特性：**
- 自动拼接提取码到 URL
- 识别多种网盘链接格式
- 处理古早页面链接

### 3. download-bypass.service.ts
**功能：** 简化下载流程
**实现：** 
- 拦截下载按钮点击事件
- 直接跳转到下载地址页面
- 跳过中间确认页面

### 4. modal-mode.service.tsx
**功能：** 模态弹窗浏览
**适用站点：** fzgamer.com
**特性：**
- 点击文章卡片弹出模态窗口
- 支持 `.widget-ajaxpager` 和 `.ajaxpager` 容器
- 事件委托优化性能

### 5. qrcode-converter.service.ts
**功能：** 二维码自动识别和转换
**实现：**
- 使用 `jsqr` 库识别二维码
- 将二维码图片替换为可点击链接
- 支持多种二维码展示形式

### 6. search-on-select / search-in-steam
**功能：** 划词搜索优化
**特性：**
- 选中文字后显示搜索按钮
- 优先使用中文名称搜索
- 一键跳转 Steam 商店

## 🧪 测试指南

### 手动测试清单

**基础功能测试：**
- [ ] 密码自动填充是否正常工作
- [ ] 百度网盘链接是否正确拼接提取码
- [ ] 下载按钮是否直接跳转到下载地址
- [ ] 二维码是否正确转换为直链
- [ ] 划词搜索按钮是否正常显示
- [ ] Steam 搜索是否使用中文名称

**站点特定测试：**
- [ ] switch520.com - 所有功能正常
- [ ] switch618.com - 分页器点击事件正常
- [ ] fzgamer.com - 弹窗浏览功能正常
- [ ] steamzg.com - 链接处理正常

**边界情况测试：**
- [ ] 古早页面兼容性
- [ ] iframe 中的链接行为
- [ ] 网络异常时的错误处理
- [ ] 多个网盘链接的处理

### 开发环境测试

**使用 ProxyDetector：**
- 仅在开发环境加载
- 检测代理设置
- 调试网络请求

**调试技巧：**
```typescript
if (process.env.NODE_ENV === 'development') {
	console.log('[DEBUG] 我的调试信息', data);
}
```

## 📦 发版工作流

### Agent 发版流程（必须遵守）

**每次发版前必须按顺序执行以下步骤：**

```
┌─────────────────────────────────────────┐
│  步骤 1: 修改 CHANGELOG.md              │
│  - 添加新版本记录 (h2 + ul 格式)        │
│  - 使用 HTML 语法 (h2版本号, ul>li改动) │
│  - 版本号格式: X.Y.Z (不带 v 前缀)      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  步骤 2: 更新 README.md                 │
│  - 将 CHANGELOG.md 的最新版本内容       │
│    同步到 README.md 的更新日志部分      │
│  - 保持格式一致 (HTML in Markdown)      │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  步骤 3: 执行 release.sh 发版           │
│  - npm run release switch520-auto-      │
│    secret <version>                     │
│  - 编辑 Release Notes (使用模板)        │
│  - 自动推送 Tag 并触发 CI/CD            │
└─────────────────────────────────────────┘
```

### 步骤 1: 修改 CHANGELOG.md

**格式要求：**
```html
<h2>🎉 X.Y.Z 版本更新</h2>
<ul>
    <li>改动描述 1</li>
    <li>改动描述 2</li>
    <li>改动描述 3</li>
</ul>
```

**规则：**
- ✅ 必须使用 `<h2>` 标签包裹版本号
- ✅ 必须使用 `<ul>` + `<li>` 列表包裹改动内容
- ✅ 使用 HTML 语法（HTML in Markdown）
- ✅ 版本号不带 `v` 前缀
- ✅ 添加 emoji 标识更新类型（🎉 ✨ 🐛 🔧 等）
- ❌ 不使用 Markdown 的 `##` 语法
- ❌ 不使用 `-` 或 `*` 列表语法

**示例：**
```html
<h2>✨ 7.0.12 版本更新</h2>
<ul>
    <li>新增游戏视频自动播放功能</li>
    <li>修复百度网盘链接拼接错误</li>
    <li>优化弹窗加载性能</li>
</ul>
```

**插入位置：**
- 在 `<h1>📝 更新日志</h1>` 之后
- 在之前的版本记录之前（最新版本在最上面）

### 步骤 2: 更新 README.md

**操作：**
1. 打开项目的 `README.md` 文件
2. 找到「更新日志」或「CHANGELOG」部分
3. 将 CHANGELOG.md 中最新版本的内容复制过去
4. 保持格式一致（HTML in Markdown）

**目的：**
- 让用户在 GreasyFork 等平台直接看到更新内容
- 保持文档一致性

**示例：**
```markdown
## 📝 更新日志

<h2>✨ 7.0.12 版本更新</h2>
<ul>
    <li>新增游戏视频自动播放功能</li>
    <li>修复百度网盘链接拼接错误</li>
    <li>优化弹窗加载性能</li>
</ul>
```

### 步骤 3: 执行 release.sh 发版

**命令：**
```bash
# 在项目目录中
npm run release 7.0.12

# 或在根目录
npm run release switch520-auto-secret 7.0.12
```

**完整流程：**
```bash
# 1. 提交 CHANGELOG.md 和 README.md 的更改
git add CHANGELOG.md README.md
git commit -m "docs: 更新 CHANGELOG 和 README for v7.0.12"
git push

# 2. 执行发布
npm run release 7.0.12

# 3. 编辑器自动打开，填写 Release Notes
# 4. 保存并关闭编辑器
# 5. 脚本自动创建 Tag 并推送
# 6. CI/CD 自动构建并发布
```

**Release Notes 模板内容：**
- 参考 CHANGELOG.md 的最新版本内容
- 可以添加更多详细说明
- 支持 Markdown 格式
- 以 `#` 开头的行会被自动过滤

### 版本号规则

**语义化版本：** `major.minor.patch`

- **major** (7.x.x): 不兼容的 API 变更
- **minor** (x.0.x): 向后兼容的功能新增
- **patch** (x.x.0): 向后兼容的问题修复

**当前版本：** 7.0.11

### 完整发版示例

**场景：** 修复了 switch618 分页器点击事件问题

```bash
# 步骤 1: 修改 CHANGELOG.md
# 在文件中添加:
<h2>🐛 7.0.12 版本更新</h2>
<ul>
    <li>修复 switch618 页面分页器点击事件不生效问题</li>
</ul>

# 步骤 2: 更新 README.md
# 将上述内容复制到 README.md 的更新日志部分

# 步骤 3: 提交并推送
git add CHANGELOG.md README.md
git commit -m "fix: 修复 switch618 分页器点击事件

- 更新 CHANGELOG.md 和 README.md"
git push

# 步骤 4: 执行发布
npm run release 7.0.12

# 步骤 5: 在编辑器中填写 Release Notes
## 🐛 7.0.12 版本更新

### 修复
- 修复 switch618 页面分页器点击事件不生效问题
- 优化事件绑定逻辑

# 步骤 6: 保存并等待 CI/CD 完成
```

### 发版检查清单

发版前必须确认：
- [ ] CHANGELOG.md 已更新（h2 + ul HTML 格式）
- [ ] README.md 已同步更新
- [ ] 更改已提交并推送到 GitHub
- [ ] 本地构建测试通过
- [ ] 版本号符合语义化版本规范
- [ ] Release Notes 已准备好

### 注意事项

**CHANGELOG.md 格式：**
- 始终使用 HTML 语法（h2 + ul）
- 不要混用 Markdown 和 HTML 列表
- 保持简洁明了的改动描述
- 每个版本之间用空行分隔

**README.md 同步：**
- 必须包含最新版本的更新内容
- 格式与 CHANGELOG.md 保持一致
- 可以只包含最近 3-5 个版本（避免过长）

**Release Notes：**
- 可以比 CHANGELOG 更详细
- 支持完整的 Markdown 语法
- 建议包含 breaking changes 说明（如果有）

## ⚠️ 注意事项

### 1. 域名匹配维护
**重要：** 域名匹配需要在两处同步维护：
1. 服务代码中的域名判断逻辑
2. TamperMonkey 脚本头的 `@match` 或 `@include` 规则

**示例：**
```typescript
// 服务代码
if (window.location.hostname.includes('fzgamer.com')) {
	// fzgamer 特定逻辑
}
```

```javascript
// ==UserScript==
// @match  *://*.fzgamer.com/*
// ==/UserScript==
```

### 2. Userscript 环境限制

**禁止使用：**
- ❌ 动态 `import()` - 必须使用静态 import
- ❌ 多文件分割 - 最终打包为单文件
- ❌ Node.js API - 浏览器环境不可用

**必须使用：**
- ✅ 静态 ESM import
- ✅ Webpack 打包
- ✅ 浏览器 API

### 3. React 组件注意事项

**在 TamperMonkey 中使用 React：**
- 使用 `ReactDOM.render` 或 `ReactDOM.createRoot`
- 确保 DOM 容器已存在
- 处理组件卸载和清理

**示例：**
```typescript
import React from 'react';
import ReactDOM from 'react-dom';

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(<MyComponent />, container);
```

### 4. DOM 操作安全

**最佳实践：**
```typescript
// ✅ 安全检查
if (document.body) {
	// 安全的 DOM 操作
}

// ✅ 元素存在性检查
const element = document.querySelector('.selector');
if (element) {
	// 操作 element
}

// ❌ 避免直接操作可能不存在的元素
document.querySelector('.selector').classList.add('active');  // 可能报错
```

### 5. 事件处理优化

**使用事件委托：**
```typescript
// ✅ 推荐 - 事件委托
document.addEventListener('click', (e) => {
	const target = (e.target as HTMLElement).closest('.post-item');
	if (target) {
		// 处理点击
	}
});

// ❌ 不推荐 - 为每个元素绑定事件
document.querySelectorAll('.post-item').forEach(item => {
	item.addEventListener('click', handler);
});
```

## 🐛 常见问题

### Q1: 某个站点功能不生效
**排查步骤：**
1. 检查域名是否正确匹配
2. 查看浏览器控制台是否有错误
3. 确认 `@match` 规则包含该站点
4. 检查 DOM 选择器是否匹配当前页面结构

### Q2: 弹窗无法打开
**可能原因：**
- DOM 选择器不匹配
- 事件监听未正确绑定
- React 组件渲染失败

**解决方法：**
1. 检查 `modal-mode.service.tsx` 初始化
2. 验证容器选择器（`.widget-ajaxpager`, `.ajaxpager`）
3. 查看控制台错误信息


## 📚 技术栈

- **语言：** TypeScript
- **打包工具：** Webpack 5
- **前端框架：** React 18
- **UI 组件库：** Ant Design 5
- **状态管理：** Reaxes
- **二维码识别：** jsqr
- **脚本管理器：** TamperMonkey
- **浏览器：** Chrome (主要测试环境)

## 🔗 相关资源

- **项目仓库：** https://github.com/Kane-Kuroneko/tamperMonkey-scripts
- **发布流程文档：** [../../SKILL.md](../../SKILL.md)
- **CHANGELOG：** [CHANGELOG.md](CHANGELOG.md)
- **GreasyFork：** https://greasyfork.org/zh-CN/scripts/475199-switch520-auto-secret
## 📝 Agent 执行模板

当用户要求为 switch520-auto-secret 添加功能或修复 bug 时：

```
📦 Switch520 Auto Secret 开发任务
├─ 任务类型: <新功能/Bug修复/优化>
├─ 影响站点: <站点列表>
└─ 涉及模块: <services/features/Components>

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
- 遵循 Import 顺序规范
- 使用 Tab 缩进
- 添加必要的安全检查
- 确保域名匹配同步更新
- CHANGELOG.md 必须使用 HTML 格式 (h2 + ul)
- README.md 必须同步更新
```

---

**文档版本:** 1.0.0  
**最后更新:** 2026-05-07  
**维护者:** Kane-Kuroneko  
**当前脚本版本:** 7.0.11
