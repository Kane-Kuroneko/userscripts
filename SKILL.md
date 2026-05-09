# TamperMonkey Scripts 发布流程 - Agent 技能文档

## 📋 概述

本文档面向 AI Agent，描述 TamperMonkey Monorepo 项目的完整发布流程。Agent 可以根据此文档自动执行版本发布操作。

## 🎯 发布触发条件

当用户提出以下需求时，触发发布流程：
- "发布新版本"
- "release 项目"
- "发版"
- "更新版本号"
- 用户修改了代码并要求发布

## 📦 项目结构

```
tamperMonkey-scripts/
├── projects/                    # Monorepo 项目目录
│   ├── switch520-auto-secret/  # 项目 A
│   ├── github-enhancer/        # 项目 B
│   └── ...
├── scripts/
│   └── release.sh              # 发布脚本
├── .github/workflows/
│   └── release.yml             # CI/CD 工作流
└── package.json                # 根配置文件
```

## 🚀 发布流程

### 步骤 1: 确定发布项目与版本号

**必须确认的信息：**
1. **项目名称** (`project-name`): 必须是 `projects/` 目录下的子目录名
2. **版本号** (`version`): 遵循语义化版本 `major.minor.patch` (如 `1.5.0`)

**获取可用项目列表：**
```bash
ls -1 projects/
```

**版本号规则：**
- `major`: 不兼容的 API 变更
- `minor`: 向后兼容的功能新增
- `patch`: 向后兼容的问题修复

### 步骤 2: 更新 CHANGELOG.md 和 Readme.md

**操作位置:** 
- `projects/<project-name>/CHANGELOG.md` - 更新日志文件
- `projects/<project-name>/Readme.md` - 项目说明文件（必须同步更新）

**CHANGELOG.md 格式要求（HTML in Markdown）：**
```html
<h2>🎉 X.Y.Z 版本更新</h2>
<ul>
    <li>改动描述 1</li>
    <li>改动描述 2</li>
    <li>改动描述 3</li>
</ul>
```

**重要规则：**
- ✅ 必须使用 `<h2>` 标签包裹版本号
- ✅ 必须使用 `<ul>` + `<li>` 列表包裹改动内容
- ✅ 使用 HTML 语法（不是 Markdown 的 `##` 和 `-`）
- ✅ 版本号不带 `v` 前缀
- ✅ 添加 emoji 标识更新类型
- ❌ 不使用 Markdown 的 `##` 语法
- ❌ 不使用 `-` 或 `*` 列表语法

**Readme.md 更新规则：**
- ✅ 必须将最新版本更新内容放在 Readme.md 的**顶部**（`<h1>📝 更新日志</h1>` 之后）
- ✅ Readme.md 是 GitHub Release 描述的**唯一来源**
- ✅ 格式与 CHANGELOG.md 保持一致
- ✅ 每次发布前必须确保 Readme.md 已更新到最新版本

**Agent 行为：**
- 根据最近的 git commits 自动生成变更日志
- 如果用户提供了变更说明，使用用户提供的说明
- 使用 `git log` 或查看最近的提交来获取变更内容
- 将内容格式化为 HTML 格式 (h2 + ul)
- **同时更新 CHANGELOG.md 和 Readme.md 两个文件**

### 步骤 3: 提交更改并推送

**⚠️ 重要：在发布前必须先将所有更改提交并推送到远端！**

**Commit Message 格式：**
```
chore(<project-name>): release v<version>

- 更新 CHANGELOG.md 和 Readme.md
- 简要描述主要变更
```

**执行命令：**
```bash
git add projects/<project-name>/CHANGELOG.md projects/<project-name>/Readme.md
git commit -m "chore(<project-name>): release v<version>"
git push
```

**Agent 行为：**
- 必须先执行 `git push` 将更改推送到远端
- **确认推送成功后**才能继续执行发布脚本
- 如果未推送就执行发布，会导致 CI/CD 构建时使用的是旧版 Readme.md

### 步骤 4: 创建并推送 Tag（直接使用版本号）

**⚠️ Tag 格式重要规则：**
- ✅ **正确格式**: `7.0.12`（仅版本号，不带项目名前缀）
- ❌ **错误格式**: `switch520-auto-secret/7.0.12`（带项目名）
- ❌ **错误格式**: `v7.0.12`（带 v 前缀）

**原因：** GreasyFork 无法识别带项目名前缀的版本号格式，必须使用纯版本号

**执行命令：**
```bash
# 创建 annotated tag（仅使用版本号）
git tag -a "<version>" -m "Release Notes 内容"

# 推送 tag 触发 CI/CD
git push origin <version>
```

**示例：**
```bash
git tag -a "7.0.12" -m "## 🎉 7.0.12 版本更新\n\n### 📝 更新\n- 更新了userscript description描述"
git push origin 7.0.12
```

**⚠️ 重要：**
- GitHub Release 的 body 内容会**自动从 Readme.md 文件中解析**
- Tag 的 message 仅作为 Release 的临时描述，最终会被 Readme.md 内容覆盖

### 步骤 5: CI/CD 自动执行

推送 Tag 后，GitHub Actions 自动执行以下流程：

```
Push Tag → Parse Tag → Build → Create Release → Upload Assets → Trigger Webhook
```

**工作流文件:** `.github/workflows/release.yml`

**CI/CD 执行步骤：**
1. **解析 Tag**: 从版本号（如 `7.0.12`）提取版本信息
2. **验证项目**: 检查 `projects/<project-name>` 是否存在
3. **安装依赖**: 根目录和项目目录的 `npm install`
4. **构建项目**: `npm run build:<project-name>` (带 `SCRIPT_VERSION` 环境变量)
   - ⚠️ **CI环境中构建不进入 watch 模式**，一次性构建完成后立即退出
5. **验证产物**: 检查 `dist/` 目录
6. **读取 Release Notes**: 从项目的 `Readme.md` 文件中读取完整内容
7. **创建 Release**: 使用 `softprops/action-gh-release@v2`，应用 Readme.md 内容作为 Release body
8. **上传资产**: `projects/<project-name>/dist/**`
9. **触发 Webhook**: 通知 GreasyFork 同步 (如果配置了 secret)

## ⚠️ 注意事项

### 1. Tag 格式要求（重要）
- ✅ 正确: `7.0.12`（仅版本号，纯数字格式）
- ❌ 错误: `switch520-auto-secret/7.0.12`（带项目名前缀，GreasyFork 无法识别）
- ❌ 错误: `v7.0.12`（带 v 前缀）
- 💡 **原因**: GreasyFork 只能识别纯语义化版本号格式（如 `7.0.12`）

### 2. Readme.md 同步更新（关键）
- ✅ **必须同步更新**: CHANGELOG.md 和 Readme.md 两个文件
- ✅ **置顶规则**: 最新版本更新必须放在 Readme.md 的顶部（`<h1>📝 更新日志</h1>` 之后）
- ✅ **Release 描述来源**: GitHub Release 的 body 内容直接从 Readme.md 文件解析
- ❌ **禁止**: 仅更新 CHANGELOG.md 而忘记更新 Readme.md
- 💡 **检查方法**: 发布前确认 Readme.md 中已包含最新版本更新

### 3. 发布前必须提交并推送
- ✅ **先提交**: 将 CHANGELOG.md 和 Readme.md 的更改 commit
- ✅ **先推送**: 执行 `git push` 将更改推送到远端
- ✅ **后发布**: 确认推送成功后再创建和推送 Tag
- ❌ **禁止**: 未推送就执行发布（会导致 CI/CD 使用旧版 Readme.md）
- 💡 **流程**: `git add` → `git commit` → `git push` → `git tag` → `git push origin <tag>`

### 4. CI/CD 构建不进入 watch 模式
- ✅ **CI环境**: 构建脚本应一次性完成，不进入 watch 模式
- ✅ **本地开发**: 可以 watch 模式监听文件变化
- ❌ **问题表现**: Actions 日志中出现"正在监听变动以重打包"说明进入了 watch 模式
- 💡 **解决方案**: 在 release.yml 中设置环境变量或使用不同的构建配置
- 💡 **检查方法**: 查看 Actions 日志，确认构建完成后立即退出

### 5. GitHub Release 描述来源
- ✅ **来源文件**: `projects/<project-name>/Readme.md`（完整文件内容）
- ✅ **解析方式**: CI/CD 自动读取 Readme.md 并作为 Release body
- ❌ **不是**: Tag message（tag message 仅作为临时描述）
- ❌ **不是**: CHANGELOG.md（仅用于项目内部的更新日志）
- 💡 **确保**: Readme.md 格式正确且包含完整的版本信息

## 🔧 Release Notes 自动更新功能

### 工作原理

**本地 → GitHub 的数据流：**
```
用户编辑模板 → 保存为 Annotated Tag Message → 推送 Tag → 
GitHub Actions 读取 Tag Message → 应用到 Release Body
```

### 关键技术点

**1. Annotated Tag vs Lightweight Tag**
- ✅ **Annotated Tag** (`git tag -a`): 包含 message，可存储 Release Notes
- ❌ **Lightweight Tag** (`git tag`): 只是 commit 的引用，无额外信息

**2. GitHub API 读取 Tag Message**
```javascript
// 获取 tag reference
const { data: ref } = await github.rest.git.getRef({
   ref: `tags/${tagName}`
});

// 如果是 annotated tag，获取 tag object
if (ref.object.type === 'tag') {
   const { data: tagObject } = await github.rest.git.getTag({
      tag_sha: ref.object.sha
   });
   
   // tagObject.message 就是 Release Notes
   const releaseNotes = tagObject.message;
}
```

**3. 注释过滤**
- 模板中以 `#` 开头的行会被自动过滤
- 空行会被压缩
- 保留 Markdown 格式

### 自定义编辑器

**设置默认编辑器：**
```bash
# 使用 VS Code
export EDITOR="code -w"

# 使用 Vim
export EDITOR=vim

# 使用 Nano
export EDITOR=nano

# 永久设置（添加到 ~/.bashrc 或 ~/.zshrc）
echo 'export EDITOR="code -w"' >> ~/.bashrc
source ~/.bashrc
```

### 编辑已有 Release Notes

**方法 1: GitHub Web 界面**
1. 打开 Release 页面
2. 点击编辑按钮
3. 修改描述
4. 保存

**方法 2: GitHub API**
```bash
# 使用 gh CLI
gh release edit <tag> --notes "<new notes>"

# 或使用 curl
curl -X PATCH \
  -H "Authorization: token <TOKEN>" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/<owner>/<repo>/releases/<release_id> \
  -d '{"body": "New release notes"}'
```

**方法 3: GitHub Actions**
- 手动触发 workflow
- 使用 `softprops/action-gh-release@v2` 更新

### 模板定制

**修改模板文件：** `.github/RELEASE_TEMPLATE.md`

**示例模板：**
```markdown
# 这是注释，不会出现在 Release Notes 中

## 🎉 新版本亮点

- 主要更新内容

## 📋 详细更新内容

### ✨ 新增
- 功能 1

### 🐛 修复
- Bug 1

### 🔧 优化
- 优化 1
```

### 故障排除

**问题 1: Release Notes 未显示**
- 检查是否使用了 `git tag -a`（annotated tag）
- 查看 Actions 日志，确认是否正确读取 tag message
- 验证 tag 类型：`git show <tag>`

**问题 2: 编辑器未打开**
- 检查 `$EDITOR` 环境变量：`echo $EDITOR`
- 设置默认编辑器：`export EDITOR=nano`

**问题 3: 注释未过滤**
- 确保注释行以 `#` 开头
- 检查 `grep -v '^#'` 命令是否正常执行

---

## 🔧 常见问题处理

### Q1: 构建失败
**症状:** `npm run build:<project-name>` 报错

**处理：**
1. 检查 TypeScript 编译错误
2. 检查依赖是否完整安装
3. 查看错误日志并修复代码问题
4. 重新执行发布流程

### Q2: Tag 推送失败
**症状:** `git push origin <tag>` 失败

**可能原因：**
- 网络问题
- 权限不足
- Tag 已存在

**处理：**
1. 检查网络连接
2. 验证 GitHub Token 权限
3. 删除本地 Tag 并重新创建：
   ```bash
   git tag -d <project-name>/<version>
   ```

### Q3: CI/CD 未触发
**症状:** 推送 Tag 后 GitHub Actions 未运行

**检查清单：**
- [ ] Tag 格式是否正确 (`project/version`)
- [ ] `.github/workflows/release.yml` 是否存在
- [ ] 仓库是否启用了 GitHub Actions
- [ ] 查看 Actions 页面是否有错误

**查看地址：**
```
https://github.com/Kane-Kuroneko/tamperMonkey-scripts/actions
```

### Q4: Release 未创建
**症状:** CI/CD 运行成功但 Release 未出现

**检查：**
1. 查看工作流日志中的 "Create GitHub Release" 步骤
2. 检查 `softprops/action-gh-release@v2` 是否成功
3. 验证 `dist/` 目录是否有文件

**查看地址：**
```
https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases
```

## 📝 Agent 执行模板

当用户要求发布时，Agent 应按以下模板执行：

```
📦 准备发布项目
├─ 项目: <project-name>
├─ 版本: <version>
└─ Tag: <version> (纯版本号，不带项目名前缀)

步骤执行:
1. ✅ 更新 CHANGELOG.md 和 Readme.md（最新版本放在Readme顶部）
2. ✅ 提交更改: git add + git commit
3. ✅ 推送更改: git push （必须等待推送完成）
4. ✅ 本地构建测试: npm run build:<project-name>
5. ✅ 创建 Tag: git tag -a "<version>" -m "Release Notes"
6. ✅ 推送 Tag: git push origin <version> （触发 CI/CD）
7. ⏳ 等待 CI/CD 完成...
8. ✅ 发布完成！

🔗 Release 地址:
https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases/tag/<version>

⚠️ 重要提醒:
- 必须先推送代码更改，再推送 Tag
- Tag 格式仅使用版本号（如 7.0.12），不带项目名前缀
- GitHub Release 描述自动从 Readme.md 解析
```

## 🎓 最佳实践

1. **发布前检查清单：**
   - [ ] CHANGELOG.md 已更新
   - [ ] Readme.md 已更新（最新版本在顶部）
   - [ ] 代码已提交并推送到远端
   - [ ] 版本号符合语义化版本规范（纯数字，不带 v 前缀）
   - [ ] 本地构建测试通过
   - [ ] 没有未提交的重要更改

2. **版本号策略：**
   - 小修复 → `patch` 版本 (`1.5.0` → `1.5.1`)
   - 新功能 → `minor` 版本 (`1.5.0` → `1.6.0`)
   - 破坏性变更 → `major` 版本 (`1.5.0` → `2.0.0`)
   - ⚠️ **格式**: 仅使用 `a.b.c` 格式，不带项目名前缀，不带 v 前缀

3. **发布后验证：**
   - 检查 Release 页面是否正确
   - 验证 Release 描述是否与 Readme.md 一致
   - 验证构建产物是否已上传
   - 确认 GreasyFork 同步是否成功 (如适用)

4. **错误恢复：**
   - 如果发布失败，删除失败的 Tag: `git push origin :refs/tags/<tag-name>`
   - 修复问题后重新发布

5. **双文件同步更新：**
   - 每次发布必须同时更新 CHANGELOG.md 和 Readme.md
   - 两个文件的内容和格式必须保持一致
   - Readme.md 的最新版本必须放在顶部

## 🔗 相关资源

- **仓库地址:** https://github.com/Kane-Kuroneko/tamperMonkey-scripts
- **Actions 页面:** https://github.com/Kane-Kuroneko/tamperMonkey-scripts/actions
- **Releases 页面:** https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases
- **发布脚本:** `scripts/release.sh`
- **工作流文件:** `.github/workflows/release.yml`

---

**文档版本:** 1.0.0  
**最后更新:** 2026-05-07  
**维护者:** Kane-Kuroneko
