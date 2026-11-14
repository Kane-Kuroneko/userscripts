---
trigger: model_decision
description: switch520-auto-secret 子工程发版唯一事实源。发版、改 CHANGELOG/Readme、打 tag 时必须读本文件。
globs:
  - projects/switch520-auto-secret/**
---

# switch520-auto-secret 发版规则（唯一事实源）

> 本文件是该子工程发版约束的**唯一权威**。
> 操作步骤见技能：[`switch520-auto-secret-release`](../skills/switch520-auto-secret-release/SKILL.md)
> 措辞（怎么写句子）见 [`docs/changelog-writing-guide.md`](../../projects/switch520-auto-secret/docs/changelog-writing-guide.md)
>
> **禁止**把 `docs/release-checklist.md`、历史总结、或其它副本当发版规则。那些文件若与本文冲突，以本文为准。

仅适用于 `projects/switch520-auto-secret/`。

## 0. 两条文档职责（禁止混用）

| 文件 | 版本 `<h2>` 数量 | 允许的操作 |
| --- | --- | --- |
| `CHANGELOG.md` | **完整历史**，不裁剪 | 只在顶部**追加**当前版本。禁止删除、改写、合并旧版本条目 |
| `Readme.md` 的「更新日志」区块 | **恰好 2 个** | 置顶当前版本 + 保留上一版本；**第三条及更早必须删掉** |
| `Readme.md` 其余区块（效果展示、7.x 主要功能更新、6.x…） | 不按版本条数裁剪 | **禁止**把版本更新条目插进这些区块 |

「与 CHANGELOG 一致」**只表示**：当前版本那一条的 HTML 措辞两边相同。  
**不表示**：两个文件要有同样多的版本条目。

```
Readme.md 结构（发版时只动「更新日志」区块里的版本 h2）：

  自动更新提示
  <h1>📝 更新日志</h1>
    <h2>当前版本</h2>     ← 必须有
    <h2>上一版本</h2>     ← 必须有
    （此处不得再有更早的 <h2>…版本更新</h2>）
  <h3>📸 效果展示</h3>    ← 更新日志区块到此结束，以下不要插入版本条目
  <h3>🚀 7.x 主要功能更新</h3>
  …
```

发版后自检：`Readme.md` 里 `<h1>📝 更新日志</h1>` 到下一个 `<h3>` 之间，`<h2>` 必须刚好 2 个。不是 1 个，不是 3 个。

## 1. Tag 格式（强制）

- ✅ 纯语义化版本号，例如 `7.0.16`
- ❌ `v7.0.16`（不得带 `v`）
- ❌ `switch520-auto-secret/7.0.16`（不得带项目名）

GreasyFork 只认纯版本号。

## 2. 版本号语义化

`major.minor.patch`：

- `major`：不兼容变更 / 新增主要功能 / 新增网站适配
- `minor`：向后兼容的功能新增 / 功能优化
- `patch`：向后兼容的问题修复

发版时同步改 `webpack.partial.ts` 里 `version: process.env.SCRIPT_VERSION || 'X.Y.Z'`。

## 3. CHANGELOG.md（完整历史）

路径：`projects/switch520-auto-secret/CHANGELOG.md`

```html
<h2>🎉 X.Y.Z 版本更新</h2>
<ul>
   <li>改动描述 1</li>
</ul>
```

- 必须用 `<h2>` + `<ul>` + `<li>`，禁止 Markdown 的 `##` / `-`
- 版本号不带 `v`
- emoji：🎉 功能、🐛 修复、♻️ 重构、✨ 优化、⚡️ 性能、🔧 配置
- **只追加当前版本**；当前条目只写本次改动，禁止把其它版本的改动写进来
- **禁止删除或改写已发布的旧版本条目**（7.2.0 事故：把 7.1.0 补丁合并进 7.2.0 并删掉旧条）

## 4. Readme.md（更新日志恰好两版）

路径：`projects/switch520-auto-secret/Readme.md`

- 每次发版必须改 Readme；当前版本条目的 HTML 与 CHANGELOG **同一条**措辞一致
- 最新版本必须紧挨 `<h1>📝 更新日志</h1>` 之后
- **「更新日志」区块只留最新两个 `<h2>…版本更新</h2>`，更早的删掉**
- 不要插入到 `<hr>` 之后，也不要插入到「7.x 主要功能更新」

GreasyFork 和 GitHub Release body 都读 **整份 Readme.md**。更新日志超过两版会把过旧说明带进脚本描述。只改 CHANGELOG 不改 Readme = 发版失败。

## 5. GitHub Release 描述来源

CI 从 `projects/switch520-auto-secret/Readme.md` **整文件**读取。不从 tag message、不从 CHANGELOG。

推 tag 前，Readme 必须已含本次版本且已 push 到远端。

## 6. Tag 推送即触发 CI/CD

`.github/workflows/release.yml`：解析 tag → 安装依赖 → 生产构建 → 读 Readme → 建 GitHub Release → 上传 dist → GreasyFork webhook。

不得手改 Release Notes，以 Readme 为准。

## 7. 工作区

不强制工作区干净。但本次发版相关改动（CHANGELOG、Readme、功能代码、`webpack.partial.ts` 版本号）**必须已提交并 push**，否则 CI 拿到旧内容。

## 8. Git 授权

遵守 [git-commit-policy](./git-commit-policy.md)：

- 「发版 / 发布 / release」授权调用 `npm run release` / `release.sh`（脚本内的 tag、push）
- 发版前的 `git commit` / `git push` 仍需用户明确说「提交」「推送」

## 9. 已废止、禁止再当权威的文件

| 文件 | 状态 |
| --- | --- |
| `projects/switch520-auto-secret/docs/release-checklist.md` | **废止**。其中「保留所有已有条目不动」只适用于 CHANGELOG，曾被误用到 Readme |
| `docs/CHANGELOG-FORMAT-UPDATE.md` 等历史总结 | 存档。与本文冲突时忽略 |

## 10. 关联

步骤：[`switch520-auto-secret-release`](../skills/switch520-auto-secret-release/SKILL.md)  
措辞：[`changelog-writing-guide.md`](../../projects/switch520-auto-secret/docs/changelog-writing-guide.md)（不规定条目数量）
