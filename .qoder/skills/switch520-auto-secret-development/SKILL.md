---
name: switch520-auto-secret-development
description: 在 projects/switch520-auto-secret 子工程上添加新功能、修复 bug、调试与测试的标准流程。仅适用于该子工程，不含发版（发版见 switch520-auto-secret-release）。
---

# switch520-auto-secret 开发技能

> ⚠️ 本技能**仅适用于 `projects/switch520-auto-secret/` 子工程**。
>
> 必须配合规则使用：
> - [`switch520-auto-secret-coding-rules`](../../rules/switch520-auto-secret-coding-rules.md)
> - [`code-standard`](../../rules/code-standard.md)
> - [`git-commit-policy`](../../rules/git-commit-policy.md)（任何 git 写操作前必读）
>
> 发版相关请用：[`switch520-auto-secret-release`](../switch520-auto-secret-release/SKILL.md)

## 项目速览

- **类型：** TamperMonkey 用户脚本
- **技术栈：** TypeScript + React 18 + Webpack 5 + Ant Design 5 + Reaxes + jsqr
- **目标站点：** switch520.com / switch618.com / fzgamer.com / steamzg.com / acgxj.com 等
- **核心能力：** 二维码转直链、密码自动填充、下载流程简化、百度网盘提取码自动拼接、划词搜索、模态弹窗浏览、Steam 搜索按钮

## 目录结构

```
projects/switch520-auto-secret/
├── index.tsx                # 入口，注册并初始化所有服务
├── services/                # 业务服务层（initXxxService）
├── features/                # React 特性（UI + 业务）
├── Components/              # 纯 React 组件
├── DOM-finder/<domain>/     # 站点特定 DOM 操作
├── core/                    # 纯函数核心逻辑
├── utils/                   # 通用工具
├── types/                   # 类型定义
├── ProxyDetector.ts         # 仅开发环境
├── webpack.partial.ts       # Webpack 配置
├── style.less               # 样式
├── CHANGELOG.md / Readme.md # 发版相关文档
```

## 启动与构建

```bash
# 子工程目录中
npm run start         # 开发监听
npm run build         # 一次性生产构建

# 仓库根目录中
npm run start:switch520-auto-secret
npm run build:switch520-auto-secret
```

构建产物输出到 `projects/switch520-auto-secret/dist/`。

## 添加新功能的标准步骤

### 1. 分析需求范围

明确：影响哪些站点？属于哪个模块层（service / feature / component / DOM-finder / core / utils）？

### 2. 创建对应模块

**新建服务（最常见）：**

```typescript
// services/my-new.service.ts
export function initMyNewService(): void {
	console.log('[switch520-auto-secret] MyNewService 已初始化');
	// 业务逻辑...
}
```

**新建站点适配：**

```typescript
// DOM-finder/my-site.com/index.ts
export function adaptMySite(): void {
	const domain = 'my-site.com';
	// 站点适配逻辑
}
```

> 同时必须更新 TamperMonkey 脚本头的 `@match` —— 见 [coding-rules §3](../../rules/switch520-auto-secret-coding-rules.md)。

### 3. 在 index.tsx 注册

```typescript
import { initMyNewService } from './services/my-new.service';

initMyNewService();
```

`index.tsx` 仅做服务注册调度，**不**承载业务逻辑。

### 4. 本地启动验证

```bash
npm run start
```

把产物 `dist/` 下生成的脚本装入 TamperMonkey 测试。

### 5. 通过手动测试清单（按需选取相关项）

**基础功能：**
- [ ] 密码自动填充
- [ ] 百度网盘提取码拼接
- [ ] 下载按钮直跳
- [ ] 二维码转直链
- [ ] 划词搜索按钮
- [ ] Steam 搜索（中文优先）

**站点专项：**
- [ ] switch520.com 全功能
- [ ] switch618.com 分页器点击事件
- [ ] fzgamer.com 弹窗浏览
- [ ] steamzg.com 链接处理

**边界场景：**
- [ ] 古早页面
- [ ] iframe 中的链接
- [ ] 网络异常
- [ ] 多个网盘链接共存

### 6. 等待用户授权后提交

⚠️ **不得擅自 commit / push**。受 [git-commit-policy](../../rules/git-commit-policy.md) 约束。

修改完文件后：

```
已修改：
- <文件1>
- <文件2>
请确认是否提交并推送？
```

得到明确"提交/推送/发版"语义后再执行。

### 7. （可选）发版

如果用户要求发版，进入 [`switch520-auto-secret-release`](../switch520-auto-secret-release/SKILL.md) 流程。

## 核心服务速查

| 服务 / 模块 | 文件 | 功能 |
| --- | --- | --- |
| 自动填充密码 | `services/auto-secret.service.ts` | 检测密码框并填写常用密码 |
| 百度网盘链接 | `services/baidu-link.service.ts` | 提取码自动拼接到 URL |
| 百度网盘自动提交 | `services/baidupan-auto-submit.service.ts` | 自动提交提取码表单 |
| 右键菜单 | `services/context-menu.service.ts` | TamperMonkey 注册命令 |
| 下载流程简化 | `services/download-bypass.service.ts` | 拦截下载按钮直跳目标页 |
| 下载跳转 | `services/download-jump.service.ts` | 跳转下载地址 |
| gamer520 弹窗拦截 | `services/gamer520-popup-blocker.service.ts` | 阻止下载页弹窗 |
| 模态弹窗浏览 | `services/modal-mode.service.tsx` | fzgamer.com 卡片模态查看 |
| 二维码转直链 | `services/qrcode-converter.service.ts` | jsqr 识别 + 替换为链接 |
| 划词搜索 | `features/search-on-select/` | 选词后展示搜索按钮 |
| Steam 搜索 | `features/search-in-steam/` | 中文优先 Steam 搜索 |

## 调试技巧

### 开发环境日志

```typescript
if (process.env.NODE_ENV === 'development') {
	console.log('[DEBUG] my context', payload);
}
```

### ProxyDetector

仅开发环境加载，用于检测代理与调试网络请求。

### DOM 结构核验

页面结构变化时优先用浏览器 DevTools 实时核对选择器。`fzgamer.com` 等动态站点要确认容器（如 `.widget-ajaxpager` / `.ajaxpager` / `.hot-posts`）是否如约出现。

## 常见问题（开发期）

### Q1：某站点功能不生效

1. `@match` 是否覆盖该站点
2. 服务代码中的域名判断是否更新（双处同步）
3. 浏览器控制台是否有报错
4. DOM 选择器是否还匹配现页面结构

### Q2：弹窗 / 模态打不开

1. 检查 `modal-mode.service.tsx` 是否被 `index.tsx` 注册
2. 验证容器选择器（`.widget-ajaxpager`、`.ajaxpager`）
3. 控制台错误信息

### Q3：百度网盘提取码未拼接

1. 检查 `baidu-link.service.ts` 的链接识别正则
2. 是否因为站点 DOM 变更导致 `composedPath()` 类型不再是 Element
3. 必要时加类型校验：`target instanceof Element`

### Q4：动态列表点击事件失效

绝大多数情况下是因为没用事件委托——见 [coding-rules §6](../../rules/switch520-auto-secret-coding-rules.md)。

### Q5：构建失败

1. TS 报错 → 修类型
2. 依赖缺失 → 在子工程目录 `npm install`
3. webpack 配置改动 → 检查 `webpack.partial.ts`

## Agent 输出模板

接到该子工程的开发任务时给用户的回执：

```
📦 Switch520 Auto Secret 开发任务
├─ 类型：<新功能 / Bug 修复 / 优化>
├─ 影响站点：<站点列表>
└─ 涉及模块：<services / features / Components / DOM-finder>

执行计划：
1. 分析需求与影响范围
2. 修改 / 新建对应模块
3. 在 index.tsx 中注册（如需要）
4. 同步 @match 与域名判断（如涉及域名）
5. 本地构建并自测
6. 报告改动文件，等待你授权提交 / 推送
```

## 与发版流程的边界

- 本技能**不**触发 `npm run release`
- 本技能**不**修改 CHANGELOG.md / Readme.md（那是发版的工作）
- 修复 bug 完成 ≠ 发版，必须由用户明确说"发版"才进入 release 流程
