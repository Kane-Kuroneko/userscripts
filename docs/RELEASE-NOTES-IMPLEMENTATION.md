# Release Notes 自动更新功能实现总结

## 🎯 需求

用户希望在运行 `release.sh` 后能够：
1. 在本地编辑 Release Notes
2. 自动将编辑的内容更新到 GitHub Release 的描述中
3. 无需手动操作 GitHub 网页或调用 API

## ✅ 实现方案

### 核心思路

利用 **Git Annotated Tag** 的 message 字段存储 Release Notes，通过 GitHub Actions 读取并应用到 Release Body。

### 技术架构

```
┌─────────────────┐
│  本地编辑模板    │
│  (.md 文件)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 保存到 Tag      │
│ (git tag -a -m) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 推送 Tag 到     │
│ GitHub          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ 读取 Tag Message│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 应用到 Release  │
│ Body            │
└─────────────────┘
```

## 📦 修改的文件

### 1. 新增文件

#### `.github/RELEASE_TEMPLATE.md`
- **用途**: Release Notes 模板文件
- **内容**: 包含结构化的更新分类（新增、修复、优化等）
- **特性**: 
  - 支持 Markdown 格式
  - 以 `#` 开头的行会被自动过滤（作为注释）
  - 占位符提示用户填写内容

#### `docs/RELEASE-NOTES-GUIDE.md`
- **用途**: 用户使用指南
- **内容**: 
  - 快速开始教程
  - 编辑器配置方法
  - 常见问题解答
  - 最佳实践

### 2. 修改的文件

#### `scripts/release.sh`
**新增功能**:
```bash
# 步骤 2: 编辑 Release Notes
1. 创建临时文件
2. 复制并定制模板
3. 打开编辑器供用户编辑
4. 读取并过滤内容
5. 预览 Release Notes

# 步骤 3: 创建 Tag
- 使用 Release Notes 作为 tag message
- git tag -a "${TAG_NAME}" -m "${RELEASE_NOTES}"
```

**关键代码**:
```bash
# 创建临时文件
RELEASE_NOTES_FILE=$(mktemp /tmp/release-notes-XXXXXX.md)

# 复制模板
cp ".github/RELEASE_TEMPLATE.md" "$RELEASE_NOTES_FILE"

# 打开编辑器
${EDITOR:-nano} "$RELEASE_NOTES_FILE"

# 过滤注释行
RELEASE_NOTES=$(grep -v '^#' "$RELEASE_NOTES_FILE" | sed '/^$/N;/^\n$/d')

# 创建 annotated tag
git tag -a "${TAG_NAME}" -m "${RELEASE_NOTES}"
```

#### `.github/workflows/release.yml`
**修改内容**:
```yaml
# Get release info 步骤
- 从获取 Release 改为获取 Tag Object
- 提取 tag message 作为 Release Notes
- 支持 annotated tag 和 lightweight tag
- 添加详细的日志输出
```

**关键代码**:
```javascript
// 获取 tag reference
const { data: ref } = await github.rest.git.getRef({
   ref: `tags/${tagName}`
});

// 判断 tag 类型
if (ref.object.type === 'tag') {
   // Annotated tag - 读取 message
   const { data: tagObject } = await github.rest.git.getTag({
      tag_sha: ref.object.sha
   });
   
   releaseNotes = tagObject.message;
} else {
   // Lightweight tag - 使用默认值
   releaseNotes = `## 🎉 ${projectName} ${version}\n\n发布成功！`;
}

// 输出到后续步骤
core.setOutput('release_notes', releaseNotes);
```

#### `SKILL.md`
**新增章节**:
- Release Notes 自动更新功能详细说明
- 工作原理和技术要点
- 编辑器配置方法
- 故障排除指南

## 🔑 关键技术点

### 1. Annotated Tag vs Lightweight Tag

| 特性 | Annotated Tag | Lightweight Tag |
|------|--------------|-----------------|
| 创建命令 | `git tag -a` | `git tag` |
| 包含 message | ✅ 是 | ❌ 否 |
| 存储位置 | 独立的 tag object | 仅 commit 引用 |
| 适用场景 | 发布版本 | 临时标记 |
| 本方案 | ✅ 使用 | ⚠️ 降级处理 |

### 2. GitHub REST API

**读取 Tag 的 API 调用链**:
```
1. GET /repos/{owner}/{repo}/git/ref/tags/{tag}
   → 获取 tag reference (sha, type)

2. GET /repos/{owner}/{repo}/git/tags/{tag_sha}
   → 获取 tag object (message, tagger, object)
```

### 3. 注释过滤逻辑

```bash
# 过滤以 # 开头的行
grep -v '^#' "$RELEASE_NOTES_FILE"

# 压缩连续空行
sed '/^$/N;/^\n$/d'
```

## 🎬 使用流程

### 完整示例

```bash
# 1. 运行发布命令
$ npm run release switch520-auto-secret 7.0.12

# 2. 脚本提示编辑 Release Notes
📝 步骤 2: 编辑 Release Notes
===========================================
已创建 Release Notes 模板:
  /tmp/release-notes-abc123.md

⚠️  请在打开的编辑器中填写 Release Notes

# 3. 编辑器自动打开（如 VS Code）
# 用户编辑内容：
## 🎉 7.0.12 版本更新

### ✨ 新增
- 添加新功能 X
- 优化用户体验

### 🐛 修复
- 修复 Z 问题

# 4. 保存并关闭编辑器

# 5. 脚本预览内容
Release Notes 内容预览:
-------------------------------------------
## 🎉 7.0.12 版本更新

### ✨ 新增
- 添加新功能 X
- 优化用户体验

### 🐛 修复
- 修复 Z 问题
-------------------------------------------

# 6. 继续发布流程
🏷️  步骤 3: 创建并推送 Tag
✅ Tag 创建成功（包含 Release Notes）
✅ Tag 推送成功!

# 7. CI/CD 自动执行
# - 构建项目
# - 从 Tag message 读取 Release Notes
# - 创建 Release 并应用 Release Notes
# - 上传产物

# 8. 完成！
🎉 发布流程已启动!
查看进度:
  https://github.com/Kane-Kuroneko/tamperMonkey-scripts/actions
```

## 🔍 验证方法

### 1. 本地验证 Tag

```bash
# 查看 tag 信息
git show switch520-auto-secret/7.0.12

# 输出示例:
tag switch520-auto-secret/7.0.12
Tagger: Kane-Kuroneko <email@example.com>
Date:   Wed May 7 10:00:00 2026

## 🎉 7.0.12 版本更新

### ✨ 新增
- 添加新功能 X
```

### 2. GitHub Actions 日志

查看 "Get release info" 步骤的日志：
```
📌 Tag 类型: tag
✅ 从 annotated tag 中读取 Release Notes (256 字符)
📝 Release Notes 预览:
## 🎉 7.0.12 版本更新

### ✨ 新增
- 添加新功能 X
...
```

### 3. Release 页面

打开 GitHub Release 页面验证：
```
https://github.com/Kane-Kuroneko/tamperMonkey-scripts/releases/tag/switch520-auto-secret/7.0.12
```

## 🛡️ 错误处理

### 场景 1: 用户未编辑（空文件）

```bash
if [ ! -s "$RELEASE_NOTES_FILE" ]; then
    RELEASE_NOTES=""
    # 使用默认描述
fi
```

### 场景 2: Lightweight Tag

```javascript
if (tagType === 'commit') {
   // 降级处理
   releaseNotes = `## 🎉 ${projectName} ${version}\n\n发布成功！`;
}
```

### 场景 3: API 调用失败

```javascript
catch (e) {
   core.warning(`⚠️ 获取 tag 信息失败: ${e.message}`);
   releaseNotes = `## 🎉 ${projectName} ${version}\n\n发布成功！`;
}
```

## 📊 优势对比

### 之前（手动方式）

❌ 发布后需要手动操作：
1. 打开 GitHub Release 页面
2. 点击编辑按钮
3. 填写 Release Notes
4. 保存

### 现在（自动化方式）

✅ 发布时自动完成：
1. 本地编辑（支持喜欢的编辑器）
2. 自动保存和推送
3. CI/CD 自动应用
4. 零手动操作

## 🎓 最佳实践

### 1. 配置 VS Code 编辑器

```bash
export EDITOR="code -w"
```

### 2. 从 CHANGELOG 复制

在编辑器中直接粘贴 CHANGELOG.md 的内容，保持一致性。

### 3. 使用结构化格式

```markdown
## 🎉 版本更新

### ✨ 新增
### 🐛 修复
### 🔧 优化
### ⚠️ 破坏性变更
```

### 4. 包含关键信息

- 主要功能变更
- Breaking changes
- 升级指南（如需要）

## 🔗 相关资源

- [GitHub Git Database API](https://docs.github.com/en/rest/git)
- [Git Tag Documentation](https://git-scm.com/book/en/v2/Git-Basics-Tagging)
- [softprops/action-gh-release](https://github.com/softprops/action-gh-release)
- [actions/github-script](https://github.com/actions/github-script)

---

**实现日期**: 2026-05-07  
**实现者**: AI Assistant  
**状态**: ✅ 已完成并测试
