---
name: switch520-auto-secret-release
description: 在 projects/switch520-auto-secret 子工程上执行版本发布的完整流程（含构建、CHANGELOG/Readme 同步、tag 推送、CI/CD 触发与异常恢复）。仅适用于该子工程。
---

# switch520-auto-secret 发版技能

> ⚠️ 本技能**仅适用于 `projects/switch520-auto-secret/` 子工程**。
>
> 必须配合规则文件使用：
> - 全局：[`.qoder/rules/git-commit-policy.md`](../../rules/git-commit-policy.md)
> - 子工程：[`.qoder/rules/switch520-auto-secret-release-rules.md`](../../rules/switch520-auto-secret-release-rules.md)

## 触发条件

当用户在该子工程上下文中提出以下意图之一时触发：

- "发布新版本" / "发版" / "发新版"
- "release 7.x.x"
- 用户改了代码并明确要求发布

## 执行前置检查清单

在动手之前必须确认：

- [ ] 已确定项目名（固定 `switch520-auto-secret`）
- [ ] 已确定语义化版本号（如 `7.0.16`）
- [ ] 已收集本次更新的功能/修复点（来自最近 git commits 或用户描述）
- [ ] 已阅读两条规则文件并理解约束

## 标准发版步骤

### 步骤 1：同步 CHANGELOG.md

文件：`projects/switch520-auto-secret/CHANGELOG.md`

在文件**顶部**新增 HTML 格式条目：

```html
<h2>🎉 X.Y.Z 版本更新</h2>
<ul>
   <li>变更描述 1</li>
   <li>变更描述 2</li>
</ul>
```

emoji 选择：🎉 新功能 / 🐛 修复 / ♻️ 重构 / ✨ 优化 / ⚡️ 性能 / 🔧 配置。

### 步骤 2：同步 Readme.md（关键，不可遗漏）

文件：`projects/switch520-auto-secret/Readme.md`

- 在 `<h1>📝 更新日志</h1>` 之后**置顶**添加同样内容
- 仅保留最新两个版本条目，更早版本删除
- 格式与 CHANGELOG.md 完全一致

> 这一步是 GreasyFork 描述的来源，**漏掉这一步 = 发版失败**。

### 步骤 3：（视情况）提交并推送同步与功能代码

⚠️ 受 [`git-commit-policy`](../../rules/git-commit-policy.md) 约束：
**该步骤不能自作主张**，必须看用户是否明确说"提交"、"推送"。

如果用户明确授权：

```bash
git add projects/switch520-auto-secret/CHANGELOG.md \
        projects/switch520-auto-secret/Readme.md \
        <本次功能改动文件>
git commit -m "<conventional commit>: <描述> (X.Y.Z)"
git push origin master
```

如果用户**未**明确授权：
- 只更新文件，告知用户："已更新 CHANGELOG.md 和 Readme.md，请确认后告知我是否提交并推送。"
- 等待用户回复后再继续。

### 步骤 4：执行发版脚本

「发版」语义授权了 `npm run release` 的调用：

```bash
# 在子工程目录中
npm run release X.Y.Z

# 或在仓库根目录
npm run release switch520-auto-secret X.Y.Z
# 等价于
bash ./scripts/release.sh switch520-auto-secret X.Y.Z
```

脚本内部行为（已被授权）：
1. 本地构建测试（`npm run build:switch520-auto-secret`）
2. 创建 annotated tag：`git tag -a "X.Y.Z" -m "Release switch520-auto-secret X.Y.Z"`
3. 推送 tag：`git push origin X.Y.Z`

### 步骤 5：CI/CD 自动执行（无需人工）

`.github/workflows/release.yml` 在 tag 推送后自动：

1. 解析 tag → 提取版本
2. 验证 `projects/switch520-auto-secret` 存在
3. 安装依赖（根目录 + 子工程）
4. 以 `NODE_ENV=production` + `SCRIPT_VERSION=X.Y.Z` 构建（不进 watch 模式）
5. 验证 `dist/` 产物
6. 读取 `projects/switch520-auto-secret/Readme.md` 完整内容作为 Release body
7. 用 `softprops/action-gh-release@v2` 创建 Release
8. 上传 `projects/switch520-auto-secret/dist/**` 资产
9. 触发 GreasyFork webhook

### 步骤 6：发版后验证

向用户提供两个查看链接：

- Actions：`https://github.com/Kane-Kuroneko/tamperMonkey-scripts/actions`
- Release：`https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases/tag/X.Y.Z`

并提示用户检查：
- Release 描述是否与 Readme.md 顶部内容一致
- 构建产物是否上传
- GreasyFork 是否同步成功

## Agent 输出模板

发版开始时给用户的回执：

```
📦 准备发版 switch520-auto-secret
├─ 版本：X.Y.Z
├─ Tag：X.Y.Z（纯版本号）
└─ 变更摘要：<一两句>

待执行：
1. 更新 CHANGELOG.md 和 Readme.md（顶部）
2. 等待你确认是否 commit + push
3. 执行 npm run release X.Y.Z（含构建、打 tag、推送 tag）
4. CI/CD 自动构建 Release 并同步 GreasyFork

🔗 完成后查看：
https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases/tag/X.Y.Z
```

## 异常恢复手册

### Q1：构建失败

- 查 TS 编译错误 / 依赖缺失
- 修复后让用户决定是否重新发版

### Q2：tag 推送失败（已存在）

询问用户后再决定。如确认覆盖：

```bash
git tag -d X.Y.Z
git push origin :refs/tags/X.Y.Z
# 重新执行 npm run release X.Y.Z
```

### Q3：CI/CD 未触发

- 检查 tag 格式是否纯版本号（不带 `v`、不带项目名）
- 检查 `.github/workflows/release.yml` 是否存在
- 查 Actions 页面错误

### Q4：Release 描述不对（最常见错误）

通常是因为 tag 推送时 Readme.md 的更新还没 push 到远端 / master。

- 不要试图用 tag message 修复
- 修复方法：
  1. 让用户授权后，更新 Readme.md 并 push
  2. 询问用户是否要重新发版（删除旧 tag + 用相同/递增版本号重发）
  3. 已发布的 GitHub Release 由用户去后台编辑或用 GitHub MCP 删除

### Q5：构建进入 watch 模式

`.github/workflows/release.yml` 必须设置 `NODE_ENV=production`，否则会卡住。

## 与全局规则的边界

- 步骤 3（commit + push 同步文件）：**需用户明确授权**
- 步骤 4（npm run release）：**"发版"语义已授权**
- 步骤 5（CI/CD）：自动执行，无需授权
- 异常恢复中的 reset / force push / 删 tag：**每一步都需用户单独授权**
