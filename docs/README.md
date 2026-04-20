# CI/CD 文档中心

> 📚 Monorepo 多项目构建与发布文档索引

---

## 🎯 快速导航

### 🚀 我要发布新版本

**推荐路线**:
1. 📋 [查看快速发布指南](./QUICK-RELEASE.md) - 3 步完成发布
2. 🛠️ 或使用发布脚本: `./scripts/release.sh <项目名> <版本号>`

### 📖 我要学习完整流程

**推荐路线**:
1. 📘 [完整操作指南](./CI-CD-GUIDE.md) - 562 行详细文档
2. 🔄 [迁移说明](./MIGRATION.md) - 新旧方案对比
3. 📊 [流程图示](./FLOW-DIAGRAMS.md) - 可视化流程

### ❓ 我遇到了问题

**推荐路线**:
1. 🔍 [常见问题 - 快速参考](./QUICK-RELEASE.md#⚠️-常见问题)
2. 📖 [常见问题 - 详细版](./CI-CD-GUIDE.md#常见问题)
3. 📊 [错误处理流程](./FLOW-DIAGRAMS.md#🎯-错误处理流程)

### 🏗️ 我要了解架构变更

**推荐路线**:
1. 📝 [重构总结](./REFACTOR-SUMMARY.md) - 完整变更记录
2. 🔄 [迁移说明](./MIGRATION.md) - 详细差异对比
3. 📊 [流程图示](./FLOW-DIAGRAMS.md) - 新旧流程对比

---

## 📚 文档清单

| 文档 | 页数 | 用途 | 适合人群 | 阅读时间 |
|------|------|------|----------|----------|
| [QUICK-RELEASE.md](./QUICK-RELEASE.md) | 147 行 | 快速参考卡片 | 日常发布 | 2 分钟 |
| [CI-CD-GUIDE.md](./CI-CD-GUIDE.md) | 562 行 | 完整操作手册 | 所有人 | 15 分钟 |
| [MIGRATION.md](./MIGRATION.md) | 386 行 | 迁移指南 | 从旧版迁移 | 10 分钟 |
| [REFACTOR-SUMMARY.md](./REFACTOR-SUMMARY.md) | 386 行 | 重构总结 | 了解变更 | 8 分钟 |
| [FLOW-DIAGRAMS.md](./FLOW-DIAGRAMS.md) | 389 行 | 流程图示 | 理解流程 | 5 分钟 |
| **本文档** | - | 导航索引 | 首次访问 | 1 分钟 |

**总计**: 1,870+ 行文档

---

## 🎓 学习路径

### 路径 1: 新手入门 (15 分钟)

```
1. 本文档 (1 分钟)
   ↓
2. 快速发布指南 (2 分钟)
   - 了解基本发布流程
   ↓
3. 完整操作指南 - 快速开始部分 (5 分钟)
   - 详细操作步骤
   ↓
4. 流程图示 (5 分钟)
   - 可视化理解流程
   ↓
5. 开始第一次发布! 🚀
```

### 路径 2: 从旧版迁移 (20 分钟)

```
1. 本文档 (1 分钟)
   ↓
2. 重构总结 (8 分钟)
   - 了解变更内容
   ↓
3. 迁移说明 (10 分钟)
   - 详细差异对比
   - 迁移步骤
   ↓
4. 使用 beta 版本测试发布
```

### 路径 3: 深度理解 (30 分钟)

```
1. 本文档 (1 分钟)
   ↓
2. 完整操作指南 (15 分钟)
   - 所有细节
   ↓
3. 流程图示 (5 分钟)
   - 流程可视化
   ↓
4. 迁移说明 (10 分钟)
   - 设计思路
   ↓
5. 查看 CI 配置文件
   - .github/workflows/release.yml
   - .github/workflows/sync-patch-notes.yml
```

---

## 📂 文档结构

```
docs/
├── README.md                      ← 本文档 (导航索引)
├── QUICK-RELEASE.md               ← 快速发布指南
├── CI-CD-GUIDE.md                 ← 完整操作指南
├── MIGRATION.md                   ← 迁移说明
├── REFACTOR-SUMMARY.md            ← 重构总结
└── FLOW-DIAGRAMS.md               ← 流程图示

.github/workflows/
├── release.yml                    ← 主发布流程
├── sync-patch-notes.yml           ← Patch notes 同步
├── main.yml                       ← ⚠️ 已废弃
├── SPNORE.yml                     ← ⚠️ 已废弃
└── SyncPatchNotesonReleaseEdit.yml ← ⚠️ 已废弃

scripts/
└── release.sh                     ← 自动化发布脚本
```

---

## 🔖 常用链接

### GitHub 相关
- [Actions 页面](https://github.com/YOUR_USERNAME/tamperMonkey-scripts/actions)
- [Releases 页面](https://github.com/YOUR_USERNAME/tamperMonkey-scripts/releases)
- [Settings → Secrets](https://github.com/YOUR_USERNAME/tamperMonkey-scripts/settings/secrets/actions)

### 外部资源
- [GitHub Actions 文档](https://docs.github.com/actions)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [Git Tag 使用指南](https://git-scm.com/book/zh/v2/Git-基础-打标签)

---

## 📌 核心概念速查

### Tag 格式

```
{项目名}/v{版本号}
```

**示例**:
```bash
switch520-auto-secret/v1.5.0
github-enhancer/v0.2.0
test-tampermonkey-jsx/v1.0.0-beta.1
```

### 发布命令

```bash
# 方式 1: 使用脚本 (推荐)
./scripts/release.sh <项目名> <版本号>

# 方式 2: 手动
git tag <项目名>/v<版本号>
git push origin <项目名>/v<版本号>
```

### 构建命令

```bash
# 查看所有项目
ls -1 projects/

# 构建指定项目
npm run build:<项目名>

# 开发模式
npm run start:<项目名>
```

---

## ⚡ 快速命令参考

### 发布相关

```bash
# 发布新版本
./scripts/release.sh switch520-auto-secret 1.5.0

# 手动发布
git tag switch520-auto-secret/v1.5.0
git push origin switch520-auto-secret/v1.5.0

# 查看已有 Tag
git tag -l 'switch520-auto-secret/*'

# 删除 Tag (谨慎!)
git push --delete origin switch520-auto-secret/v1.5.0
git tag -d switch520-auto-secret/v1.5.0
```

### 构建相关

```bash
# 本地构建
npm run build:switch520-auto-secret

# 开发模式
npm run start:switch520-auto-secret

# 安装依赖
npm install
cd projects/switch520-auto-secret && npm install
```

### Git 相关

```bash
# 查看可用项目
ls -1 projects/

# 查看历史 Tag
git tag -l '*/v*'

# 查看 CI 状态
# 打开 GitHub Actions 页面
```

---

## 🎯 决策树

### 我该看哪个文档?

```
你需要做什么?
    │
    ├─ 发布新版本
    │   └─> [QUICK-RELEASE.md](./QUICK-RELEASE.md)
    │
    ├─ 学习完整流程
    │   └─> [CI-CD-GUIDE.md](./CI-CD-GUIDE.md)
    │
    ├─ 从旧版迁移
    │   └─> [MIGRATION.md](./MIGRATION.md)
    │
    ├─ 了解变更内容
    │   └─> [REFACTOR-SUMMARY.md](./REFACTOR-SUMMARY.md)
    │
    ├─ 理解流程 (可视化)
    │   └─> [FLOW-DIAGRAMS.md](./FLOW-DIAGRAMS.md)
    │
    └─ 遇到问题
        ├─ 快速排查
        │   └─> [QUICK-RELEASE.md#⚠️-常见问题](./QUICK-RELEASE.md)
        │
        └─ 详细排查
            └─> [CI-CD-GUIDE.md#常见问题](./CI-CD-GUIDE.md)
```

---

## 💡 使用建议

### 日常开发
- 📌 收藏 [QUICK-RELEASE.md](./QUICK-RELEASE.md)
- 🛠️ 使用 `release.sh` 脚本
- 🔍 遇到问题先看 FAQ

### 首次使用
- 📖 完整阅读 [CI-CD-GUIDE.md](./CI-CD-GUIDE.md)
- 🧪 使用 beta 版本测试
- 📊 查看流程图理解流程

### 从旧版迁移
- 🔄 仔细阅读 [MIGRATION.md](./MIGRATION.md)
- ⚠️ 注意 Tag 格式变化
- 🧪 先用 beta 版本验证

---

## 📝 文档维护

### 更新规则

1. **修改 CI/CD 配置** → 同步更新相关文档
2. **添加新功能** → 更新操作指南
3. **发现问题** → 更新 FAQ
4. **流程变更** → 更新流程图

### 文档负责人

- **维护者**: Kane-Kuroneko
- **最后更新**: 2026-04-20
- **版本**: v2.0

---

## 🆘 获取帮助

### 遇到问题?

1. 📚 查看相关文档
2. 🔍 搜索 Issue
3. 💬 提交新 Issue
4. 📧 联系维护者

### 文档问题?

- 发现错误 → 提交 Issue 或 PR
- 需要补充 → 提交 Issue
- 翻译问题 → 联系维护者

---

## 📈 文档统计

- **总文档数**: 6 个
- **总行数**: 1,870+ 行
- **总字数**: ~15,000 字
- **图表数**: 10+ 个
- **示例数**: 50+ 个

---

## 🎉 开始使用

选择你的学习路径，开始吧!

- 🚀 [快速发布指南](./QUICK-RELEASE.md) - 我要发布
- 📖 [完整操作指南](./CI-CD-GUIDE.md) - 我要学习
- 🔄 [迁移说明](./MIGRATION.md) - 我要迁移
- 📊 [流程图示](./FLOW-DIAGRAMS.md) - 我要理解

---

**祝使用愉快!** 🎊
