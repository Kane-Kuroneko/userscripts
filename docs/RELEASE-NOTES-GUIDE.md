# Release Notes 自动更新功能使用说明

## 📖 功能概述

现在 `release.sh` 脚本支持在发布时自动编辑 Release Notes，并通过 GitHub Actions 自动应用到 GitHub Release 页面。

## 🚀 快速开始

### 1. 运行发布脚本

```bash
npm run release <project-name> <version>

# 示例
npm run release switch520-auto-secret 7.0.12
```

### 2. 编辑 Release Notes

脚本会自动打开编辑器，显示 Release Notes 模板：

```
📝 步骤 2: 编辑 Release Notes
===========================================
已创建 Release Notes 模板:
  /tmp/release-notes-XXXXXX.md

⚠️  请在打开的编辑器中填写 Release Notes，保存后关闭编辑器继续发布流程

按回车键打开编辑器...
```

### 3. 填写内容

在编辑器中填写更新内容：

```markdown
## 🎉 7.0.12 版本更新

### ✨ 新增
- 支持新功能 X
- 添加 Y 特性

### 🐛 修复
- 修复 Z 问题

### 🔧 优化
- 优化性能
```

### 4. 保存并继续

- 保存文件
- 关闭编辑器
- 脚本自动继续发布流程

### 5. 完成发布

CI/CD 会自动：
1. 构建项目
2. 创建 GitHub Release
3. **应用你编辑的 Release Notes**
4. 上传构建产物

## ⚙️ 配置编辑器

### 设置默认编辑器

```bash
# 使用 VS Code（推荐）
export EDITOR="code -w"

# 使用 Vim
export EDITOR=vim

# 使用 Nano
export EDITOR=nano
```

### 永久设置

```bash
# 添加到 shell 配置文件
echo 'export EDITOR="code -w"' >> ~/.bashrc
source ~/.bashrc
```

## 📝 模板说明

### 模板位置

`.github/RELEASE_TEMPLATE.md`

### 模板规则

1. **注释行**：以 `#` 开头的行会被自动过滤
2. **Markdown 支持**：完整支持 Markdown 语法
3. **空行处理**：连续空行会被压缩

### 示例模板

```markdown
# 这是注释，不会显示在 Release 中
# 使用说明：填写更新内容后保存

## 🎉 新版本亮点

<!-- 在这里写主要更新 -->
- 重大功能更新

## 📋 详细更新内容

### ✨ 新增
- 功能 1
- 功能 2

### 🐛 修复
- Bug 1
- Bug 2

### 🔧 优化
- 优化 1
```

## 🔍 技术原理

### 数据流

```
本地编辑
   ↓
保存到 Annotated Tag Message
   ↓
推送 Tag 到 GitHub
   ↓
GitHub Actions 读取 Tag Message
   ↓
应用到 Release Body
```

### 关键技术

**1. Annotated Tag**
```bash
# 脚本使用 -a 参数创建 annotated tag
git tag -a "project/1.0.0" -m "Release Notes 内容"
```

**2. GitHub Actions 读取**
```javascript
// 从 tag object 中获取 message
const { data: tagObject } = await github.rest.git.getTag({
   tag_sha: tagSha
});

const releaseNotes = tagObject.message;
```

## ❓ 常见问题

### Q1: 可以跳过编辑 Release Notes 吗？

**可以**，直接保存空文件或关闭编辑器，会使用默认描述。

### Q2: 发布后如何修改 Release Notes？

**方法 1: GitHub 网页**
- 打开 Release 页面
- 点击编辑图标
- 修改描述
- 保存

**方法 2: GitHub CLI**
```bash
gh release edit <tag> --notes "新的 Release Notes"
```

**方法 3: API**
```bash
curl -X PATCH \
  -H "Authorization: token <TOKEN>" \
  https://api.github.com/repos/<owner>/<repo>/releases/<id> \
  -d '{"body": "新内容"}'
```

### Q3: 编辑器没有打开？

检查 `$EDITOR` 环境变量：
```bash
echo $EDITOR

# 如果为空，设置一个
export EDITOR=nano
```

### Q4: Release Notes 没有显示在 GitHub？

检查事项：
1. 确认使用了 `git tag -a`（annotated tag）
2. 查看 Actions 日志中的 "Get release info" 步骤
3. 验证 tag 类型：`git show <tag-name>`

## 💡 最佳实践

### 1. 使用 VS Code 编辑器

```bash
export EDITOR="code -w"
```

`-w` 参数让 shell 等待编辑器关闭后继续。

### 2. 从 CHANGELOG.md 复制内容

```bash
# 在编辑器中直接粘贴 CHANGELOG 的内容
# 保持格式一致性
```

### 3. 包含关键信息

- ✨ 新增功能
- 🐛 Bug 修复
- 🔧 性能优化
- ⚠️ Breaking Changes（如果有）

### 4. 使用 Emoji 提升可读性

```markdown
### ✨ 新增
### 🐛 修复
### 🔧 优化
### 📝 文档
### ⚠️ 破坏性变更
```

## 🎯 示例工作流

```bash
# 1. 完成代码修改
git add .
git commit -m "feat: 添加新功能 X"

# 2. 更新 CHANGELOG.md
# 编辑 projects/<project>/CHANGELOG.md

# 3. 运行发布脚本
npm run release switch520-auto-secret 7.0.12

# 4. 在编辑器中填写 Release Notes
## 🎉 7.0.12 版本更新

### ✨ 新增
- 添加新功能 X
- 支持 Y 特性

### 🐛 修复
- 修复 Z 问题

# 5. 保存并关闭编辑器

# 6. 脚本自动完成发布
# - 构建项目
# - 推送 Tag
# - CI/CD 自动应用 Release Notes
# - 上传产物

# 7. 验证 Release 页面
# 打开: https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases
```

## 📚 相关文档

- [SKILL.md](../../SKILL.md) - 完整发布流程文档
- [RELEASE_TEMPLATE.md](../RELEASE_TEMPLATE.md) - Release Notes 模板
- [release.yml](../workflows/release.yml) - GitHub Actions 工作流

---

**最后更新**: 2026-05-07  
**维护者**: Kane-Kuroneko
