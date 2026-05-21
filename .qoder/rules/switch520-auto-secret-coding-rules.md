---
trigger: model_decision
description: switch520-auto-secret 子工程编码与运行时硬约束（仅在该子工程下编写/修改代码时适用）
globs:
  - projects/switch520-auto-secret/**
---

# switch520-auto-secret 编码与运行时规则

> ⚠️ 本规则**仅适用于 `projects/switch520-auto-secret/` 子工程**的代码编写与修改任务。
> 全局编码规范见 [`.qoder/rules/code-standard.md`](./code-standard.md)，本规则是其在该子工程下的项目特定补充。

## 1. ESM Import 顺序（强制）

按以下顺序排列，且**必须置于文件底部**：

1. 相对路径的业务 ESM Import
2. 绝对路径的业务 ESM Import（如 `#src/...`）
3. `node_modules` 包
4. CSS / Less 模块
5. Types / Interfaces 声明

✅ 正确示例：

```typescript
//文件开头
//...业务逻辑...
//业务逻辑结束
import { initAutoSecret } from './services/auto-secret.service';
import { initBaiduLinkService } from './services/baidu-link.service';
import jsqr from 'jsqr';
import "./style.less";

type ServiceConfig = {
	enabled: boolean;
	domain: string;
}
//文件结尾
```

❌ 错误示例：types 出现在 import 之间、CSS 出现在 types 之后等。

## 2. 缩进（强制）

代码使用 **Tab** 缩进。Markdown 等文档示例使用 3 空格缩进（与全局规范一致）。

## 3. 域名匹配双处同步（强制）

域名判断必须在**两处同时维护**，否则脚本不生效或行为不一致：

- **服务代码：** `window.location.hostname.includes('xxx.com')`
- **TamperMonkey 脚本头：** `// @match  *://*.xxx.com/*`

每次新增/修改域名匹配，必须确认上述两处都已更新。

## 4. Userscript 环境限制（强制）

**禁止：**

- ❌ 动态 `import()` —— 必须使用静态 ESM import（最终打包为单文件）
- ❌ 多文件输出 —— 最终产物必须是单一脚本文件
- ❌ Node.js API —— 浏览器环境不可用

**允许：**

- ✅ 静态 ESM import
- ✅ Webpack 打包
- ✅ 浏览器 API、TamperMonkey GM_* API

## 5. DOM 操作安全（强制）

任何 DOM 查询/操作前必须做存在性检查：

```typescript
// ✅ 正确
if (document.body) {
	document.body.appendChild(container);
}

const el = document.querySelector('.selector');
if (el) {
	el.classList.add('active');
}

// ❌ 错误：链式访问可能不存在的元素
document.querySelector('.selector').classList.add('active');
```

`composedPath()` 返回的元素必须**类型校验**后再用于 `contains()` 等 Element 方法。

## 6. 事件处理：优先使用事件委托（强制）

针对动态/列表元素，必须使用事件委托而不是为每个元素绑定监听：

```typescript
// ✅ 正确：事件委托
document.addEventListener('click', (e) => {
	const target = (e.target as HTMLElement).closest('.post-item');
	if (target) { /* 处理 */ }
});

// ❌ 错误：为每个元素单独绑定
document.querySelectorAll('.post-item').forEach(item => {
	item.addEventListener('click', handler);
});
```

## 7. React 组件挂载

在 TamperMonkey 中使用 React 时：

- 使用 `ReactDOM.render` / `createRoot`
- 容器 DOM 必须**先确认存在**再挂载
- 组件销毁时清理监听与定时器

## 8. 调试日志规范

仅在开发环境输出调试日志：

```typescript
if (process.env.NODE_ENV === 'development') {
	console.log('[DEBUG] ...', data);
}
```

业务日志统一加项目前缀 `[switch520-auto-secret]` 便于排查。

## 9. 模块组织约定

- `services/`：业务服务（每个服务一个文件，导出 `initXxxService()`）
- `features/`：React 特性（含 UI 组件 + 业务逻辑）
- `Components/`：纯 React 组件
- `DOM-finder/<domain>/`：站点特定的 DOM 操作
- `core/`：纯函数核心逻辑
- `utils/`：通用工具函数
- `types/`：TypeScript 类型定义

新增功能时按上述目录归类，**禁止**在 `index.tsx` 中堆积业务逻辑（入口仅做服务注册与初始化调度）。

## 10. 关联技能与规则

- 开发流程：[`.qoder/skills/switch520-auto-secret-development/SKILL.md`](../skills/switch520-auto-secret-development/SKILL.md)
- 发版规则：[`.qoder/rules/switch520-auto-secret-release-rules.md`](./switch520-auto-secret-release-rules.md)
- 发版技能：[`.qoder/skills/switch520-auto-secret-release/SKILL.md`](../skills/switch520-auto-secret-release/SKILL.md)
- 全局 git 授权：[`.qoder/rules/git-commit-policy.md`](./git-commit-policy.md)
