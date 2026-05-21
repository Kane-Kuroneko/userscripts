---
trigger: always_on
description: Git 提交与推送授权规则（全局）
---

# Git 写操作授权规则（全局）

## 核心原则

**未经用户明确授权，禁止执行任何 git 写操作。**

调试、阅读、修改本地文件，均**不**视为对 git 写操作的授权。
即使用户表达了"修复 bug"、"加个功能"、"改一下代码"等编码意图，也只允许修改文件，**不得**自动 commit / push。

## 受约束的命令

下列命令必须经用户明确授权后才能执行：

- `git add`（仅当紧接着用户授权的 commit 时允许）
- `git commit` / `git commit --amend`
- `git push`（含 `--force`、`--force-with-lease`）
- `git tag` / `git push origin <tag>` / `git push --tags`
- `git reset --hard` / `git reset --soft` / `git reset --mixed`（涉及 HEAD 移动）
- `git rebase` / `git merge`（含 `--squash`、`--no-ff`）
- `git checkout -- <file>` / `git restore`（覆盖工作区改动时）
- `git stash drop` / `git stash clear`
- `git revert`
- `git push origin :refs/tags/<tag>`（删除远端 tag）
- 任何会改变历史或远端状态的 git 操作

## 授权语义识别

仅当用户**明确**使用以下表达时，才视为对相应操作的授权：

| 用户表达 | 授权范围 |
| --- | --- |
| "提交"、"commit"、"git commit"、"提交一下" | `git add` + `git commit` |
| "推送"、"push"、"推到远端"、"推上去" | `git push` |
| "发版"、"发布新版本"、"release"、"打 tag 发版" | 调用既定发版脚本（如 `release.sh`），含其内置的 commit/tag/push |
| "撤销提交"、"回滚"、"reset 到 X"、"强推" | 对应的 reset / force push |
| "删除 tag X" | `git tag -d` + `git push origin :refs/tags/X` |

含糊的表达（"搞一下"、"处理这个文件"、"修复这个 bug"、"整理代码"）**不**构成授权。

## 当不确定时的行为

- 修改完文件后停在工作区（unstaged / untracked）状态。
- 用一句话告知用户哪些文件已变动、待用户确认是否提交/推送。
- 不要主动建议提交，让用户自己决定。

## 例外

调用项目内既定的发版脚本（`scripts/release.sh`、`npm run release ...`）属于"发版"语义授权范围，脚本内部的 tag、push 行为视为已授权。但在调用脚本前的 `git commit` / `git push`（如同步 CHANGELOG.md / Readme.md）仍需用户明确指示。

## 反面示例（禁止）

❌ 用户："修一下 fzgamer 的 bug"
   → 自作主张 `git add` + `git commit` + `git push`

❌ 用户："把 SKILL.md 移到 .qoder 下"
   → 自作主张 `git add` + `git commit` + `git push`

❌ 用户："更新 Readme"
   → 自作主张 `git add` + `git commit` + `git push`

## 正面示例（允许）

✅ 用户："修一下 fzgamer 的 bug 然后提交推送"
   → 修改 + `git add` + `git commit` + `git push`

✅ 用户："发布新版 7.0.16"
   → 修改 + 调用 `npm run release 7.0.16`（脚本内部含 tag、push）

✅ 用户："这个改动提交一下"
   → `git add` + `git commit`（不 push，除非用户也说推送）
