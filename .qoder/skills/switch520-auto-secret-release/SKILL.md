---
name: switch520-auto-secret-release
description: 在 projects/switch520-auto-secret 子工程上执行版本发布（构建、按唯一事实源改 CHANGELOG/Readme、tag、CI）。不含规则条文本身。
---

# switch520-auto-secret 发版技能

> 仅适用于 `projects/switch520-auto-secret/`。
>
> **约束唯一事实源（先读再动手，不要凭记忆或其它 md 发版）：**
> [`.qoder/rules/switch520-auto-secret-release-rules.md`](../../rules/switch520-auto-secret-release-rules.md)
>
> Git 写操作：[`.qoder/rules/git-commit-policy.md`](../../rules/git-commit-policy.md)
>
> 禁止打开 `docs/release-checklist.md` 当发版清单。

## 触发条件

- 「发布新版本」/「发版」/「发新版」
- `release 7.x.x`
- 用户改了代码并明确要求发布

## 动手前

- [ ] 已读唯一事实源，尤其是第 0 节（CHANGELOG 完整历史 vs Readme 更新日志恰好两版）
- [ ] 项目名固定 `switch520-auto-secret`
- [ ] 已定语义化版本号
- [ ] 已收集本次改动（只写进当前版本条目）

## 标准步骤

### 1. 追加 CHANGELOG.md

`projects/switch520-auto-secret/CHANGELOG.md`：**只在顶部追加**当前版本 HTML 条目。不删旧条。条目格式与措辞见唯一事实源第 3 节 + `docs/changelog-writing-guide.md`。

### 2. 裁剪 Readme.md 更新日志

`projects/switch520-auto-secret/Readme.md`：

1. 在 `<h1>📝 更新日志</h1>` 后置顶与 CHANGELOG **同一条**当前版本 HTML
2. 保留上一版本那一条
3. **删掉更早的所有** `<h2>…版本更新</h2>`
4. 不要动「效果展示」「7.x 主要功能更新」等后面的区块

自检：更新日志标题到下一个 `<h3>` 之间，`<h2>` 数量 === 2。

漏改 Readme = GreasyFork / GitHub Release 描述错误。

### 3. 提交并推送（需用户说「提交」「推送」）

未授权则只改文件，停下来等。

已授权：

```bash
git add projects/switch520-auto-secret/CHANGELOG.md \
        projects/switch520-auto-secret/Readme.md \
        projects/switch520-auto-secret/webpack.partial.ts \
        <本次功能改动文件>
git commit -m "<conventional commit>: <描述> (X.Y.Z)"
git push origin master
```

### 4. 发版脚本

「发版」已授权调用：

```bash
npm run release switch520-auto-secret X.Y.Z
# 即 bash ./scripts/release.sh switch520-auto-secret X.Y.Z
```

脚本会：本地构建、打 annotated tag `X.Y.Z`、push tag。

### 5. CI（自动）

tag 推送后 `.github/workflows/release.yml` 生产构建、用 **整份 Readme.md** 建 Release、传 dist、触发 GreasyFork webhook。

### 6. 回执

- Actions：仓库 Actions 页（远端是 `Kane-Kuroneko/userscripts`）
- Release：`https://github.com/Kane-Kuroneko/userscripts/releases/tag/X.Y.Z`

核对：Readme 更新日志恰好两版、产物已上传、GreasyFork 是否同步。

## 异常

- 构建失败：修完由用户决定是否重发
- tag 已存在：须用户授权后再删 tag 重发
- Release 描述不对：通常是 Readme 没先 push。不要用 tag message 补；授权后改 Readme 再问是否重发
- watch 模式卡住：workflow 必须 `NODE_ENV=production`

reset / force push / 删 tag：每一步单独授权。
