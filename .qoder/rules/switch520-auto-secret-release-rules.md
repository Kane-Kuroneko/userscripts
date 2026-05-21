---
trigger: model_decision
description: switch520-auto-secret 子工程发版强制规则（仅在该子工程发版时适用）
globs:
  - projects/switch520-auto-secret/**
---

# switch520-auto-secret 发版规则

> ⚠️ 本规则**仅适用于 `projects/switch520-auto-secret/` 子工程**的发版任务。
> 其他子工程发版请参考各自的规则文档。

## 1. Tag 格式（强制）

- ✅ 正确格式：纯语义化版本号，例如 `7.0.16`
- ❌ 禁止格式：`v7.0.16`（不得带 `v` 前缀）
- ❌ 禁止格式：`switch520-auto-secret/7.0.16`（不得带项目名前缀）

**原因：** GreasyFork 仅识别纯版本号格式。

## 2. 版本号语义化

遵循 `major.minor.patch`：

- `major`：不兼容变更 / 新增主要功能 / 新增网站适配
- `minor`：向后兼容的功能新增 / 功能优化
- `patch`：向后兼容的问题修复

## 3. CHANGELOG.md 格式（强制 HTML）

文件路径：`projects/switch520-auto-secret/CHANGELOG.md`

```html
<h2>🎉 X.Y.Z 版本更新</h2>
<ul>
   <li>改动描述 1</li>
   <li>改动描述 2</li>
</ul>
```

强制要求：

- ✅ 必须使用 `<h2>` 包裹版本号
- ✅ 必须使用 `<ul>` + `<li>` 列表
- ✅ 版本号不带 `v` 前缀
- ✅ 添加 emoji 标识更新类型（🎉 功能、🐛 修复、♻️ 重构…）
- ❌ 禁止使用 Markdown 的 `##` 和 `-` / `*` 列表语法

## 4. Readme.md 同步更新（强制）

文件路径：`projects/switch520-auto-secret/Readme.md`

- ✅ 每次发版**必须**同步更新 `Readme.md`，与 `CHANGELOG.md` 内容一致
- ✅ 最新版本条目**必须**置于 `<h1>📝 更新日志</h1>` 之后的**顶部**
- ✅ 格式与 CHANGELOG.md 保持一致（HTML）
- ✅ 仅保留最新的两个版本条目，更早的删除

**重要原因：** GreasyFork 同步使用 Readme.md 作为脚本描述。**仅更新 CHANGELOG.md 不更新 Readme.md = 发版失败**。

## 5. GitHub Release 描述来源（自动）

- Release body 由 CI/CD 从 `projects/switch520-auto-secret/Readme.md` **自动**读取完整内容。
- ❌ 不从 Tag message 取
- ❌ 不从 CHANGELOG.md 取
- ✅ 仅从 Readme.md 取

**结论：** 推送 tag 之前，必须确认 Readme.md 已经包含本次发版内容并已 push 到远端，否则 Release 描述会是旧版本。

## 6. Tag 推送即触发 CI/CD

推送 tag 后由 `.github/workflows/release.yml` 自动执行：解析 tag → 安装依赖 → 构建（不进入 watch 模式）→ 读取 Readme.md → 创建 GitHub Release → 上传 dist → 触发 GreasyFork webhook。

人工**不得**编辑 Release Notes，一切以 Readme.md 为准。

## 7. 工作区改动允许存在

发版流程**不强制**要求工作区干净。但与本次发版相关的改动（CHANGELOG.md、Readme.md、本次功能代码）**必须**已提交并推送，否则 CI/CD 拿到的是旧代码 / 旧文档。

## 8. 与全局 git 规则的协同

发版流程涉及 `git commit` / `git push` / `git tag` 等写操作时，必须遵守 [git-commit-policy](./git-commit-policy.md) 中的授权要求：

- "发版"、"发布"、"release" 是对调用 `npm run release` / `release.sh` 的授权
- 但发版前的 `git commit` / `git push`（同步 CHANGELOG.md、Readme.md、功能代码）**不**自动包含在"发版"授权内，需用户单独明确指示

## 9. 关联技能

执行步骤参见技能：[`switch520-auto-secret-release`](../skills/switch520-auto-secret-release/SKILL.md)
