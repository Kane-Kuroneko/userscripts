# 快速发布指南

> 📌 3 步完成项目发布

---

## 🚀 快速发布 (推荐)

### 方式 1: 使用发布脚本

```bash
# 语法
./scripts/release.sh <项目名> <版本号>

# 示例
./scripts/release.sh switch520-auto-secret 1.5.0
```

脚本会自动:
- ✅ 检查项目是否存在
- ✅ 本地构建测试
- ✅ 验证构建产物
- ✅ 创建并推送 Tag
- ✅ 显示 CI/CD 进度链接

### 方式 2: 手动发布

```bash
# 1. 本地构建测试
npm run build:switch520-auto-secret

# 2. 创建 Tag
git tag switch520-auto-secret/v1.5.0

# 3. 推送触发 CI/CD
git push origin switch520-auto-secret/v1.5.0
```

---

## 📋 发布前检查清单

- [ ] 代码已提交并推送到主分支
- [ ] 本地构建成功 (`npm run build:项目名`)
- [ ] 测试过构建的脚本文件
- [ ] 准备好 Release Notes 内容
- [ ] 版本号符合语义化版本规范

---

## 🏷️ Tag 格式

```
{项目名}/v{版本号}
```

**示例**:
```
switch520-auto-secret/v1.5.0
github-enhancer/v0.2.0
test-tampermonkey-jsx/v1.0.0-beta.1
```

---

## 📦 可用项目

```bash
# 查看所有项目
ls -1 projects/

# 当前项目:
# - switch520-auto-secret
# - github-enhancer
# - test-tampermonkey-jsx
```

---

## 🔍 发布后

### 查看 CI 进度

```
https://github.com/YOUR_USERNAME/tamperMonkey-scripts/actions
```

### 查看 Release

```
https://github.com/YOUR_USERNAME/tamperMonkey-scripts/releases/tag/项目名/v版本号
```

### 编辑 Release Notes

1. 打开 Release 页面
2. 点击编辑按钮 (铅笔图标)
3. 补充详细更新日志
4. 保存 (会触发 patch notes 同步)

---

## ⚠️ 常见问题

### 构建失败?

```bash
# 1. 检查本地是否能构建
npm run build:项目名

# 2. 查看 CI 日志
Actions → 失败的 Workflow → 查看详细错误
```

### 发错了版本?

```bash
# 删除 Tag
git push --delete origin 项目名/v版本号
git tag -d 项目名/v版本号

# 在 GitHub 删除 Release
```

### 如何测试 CI 流程?

```bash
# 使用 beta 版本测试
git tag 项目名/v1.0.0-beta.1
git push origin 项目名/v1.0.0-beta.1
```

---

## 📚 详细文档

完整文档请查看: [CI-CD-GUIDE.md](./CI-CD-GUIDE.md)

---

## 💡 提示

- 🎯 发布前务必本地测试
- 📝 发布后及时补充 Release Notes
- 🔔 关注 CI/CD 通知
- 🧪 使用 beta/rc 版本测试新流程
