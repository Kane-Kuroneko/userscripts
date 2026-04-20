# CI/CD 构建与发布指南

> 📌 **更新时间**: 2026-04-20  
> 📌 **版本**: v2.0 (Monorepo 多项目支持)

---

## 📋 目录

- [概述](#概述)
- [与旧版本的区别](#与旧版本的区别)
- [快速开始](#快速开始)
- [详细操作流程](#详细操作流程)
- [Tag 命名规范](#tag-命名规范)
- [CI/CD 工作流说明](#cicd-工作流说明)
- [常见问题](#常见问题)
- [迁移指南](#迁移指南)

---

## 概述

本项目采用 **Monorepo 架构**，在单一仓库中管理多个 TamperMonkey 脚本项目。  
新的 CI/CD 系统支持**按项目独立构建和发布**，无需为每个项目维护单独的工作流。

### 项目结构

```
tamperMonkey-scripts/
├── projects/
│   ├── switch520-auto-secret/    # 项目 A
│   ├── github-enhancer/          # 项目 B
│   └── test-tampermonkey-jsx/    # 项目 C
├── .github/workflows/
│   ├── release.yml               # ✨ 新: 主要发布流程
│   ├── sync-patch-notes.yml      # ✨ 新: Patch notes 同步
│   ├── main.yml                  # ⚠️ 旧: 已废弃
│   └── SPNORE.yml                # ⚠️ 旧: 已废弃
└── docs/
    └── CI-CD-GUIDE.md            # 本文档
```

---

## 与旧版本的区别

### 🔄 核心变化对比

| 维度 | 旧版本 (v1) | 新版本 (v2) |
|------|-------------|-------------|
| **触发方式** | 创建 Release 时触发 | Push Tag 时触发 |
| **项目识别** | 硬编码 `switch520-auto-secret` | 从 Tag 自动解析 |
| **Tag 格式** | `v1.2.3` | `project-name/v1.2.3` |
| **多项目支持** | ❌ 仅支持单一项目 | ✅ 支持无限项目 |
| **构建产物** | 固定路径 | 动态路径 |
| **Release 创建** | 手动创建后触发 CI | CI 自动创建 Release |
| **Patch Notes** | 单一文件 | 按项目分离 |

### 📝 详细差异说明

#### 1. **触发机制改变**

**旧版本**:
```bash
# 1. 手动在 GitHub 创建 Release
# 2. Release 触发 CI
# 3. CI 构建并上传产物
```

**新版本**:
```bash
# 1. Push Tag 到仓库
# 2. CI 自动解析项目名称并构建
# 3. CI 自动创建 Release 并上传产物
```

**优势**: 
- ✅ 流程更自动化
- ✅ 支持多项目独立发布
- ✅ 减少手动操作错误

#### 2. **Tag 命名规范**

**旧版本**:
```bash
git tag v1.2.3
git push origin v1.2.3
# 始终构建 switch520-auto-secret
```

**新版本**:
```bash
git tag switch520-auto-secret/v1.2.3
git push origin switch520-auto-secret/v1.2.3
# 只构建 switch520-auto-secret

git tag github-enhancer/v0.1.0
git push origin github-enhancer/v0.1.0
# 只构建 github-enhancer
```

**优势**:
- ✅ 明确指定要发布的项目
- ✅ 不同项目独立版本号
- ✅ 避免误发布

#### 3. **构建流程优化**

**旧版本**:
```yaml
# 硬编码项目路径
working-directory: projects/switch520-auto-secret
run: npm run build
```

**新版本**:
```yaml
# 动态解析项目名
PROJECT_NAME=$(echo $TAG_NAME | cut -d'/' -f1)
run: npm run build:$PROJECT_NAME
```

**优势**:
- ✅ 无需修改 CI 配置即可添加新项目
- ✅ 自动验证项目是否存在
- ✅ 构建产物路径自动匹配

#### 4. **Patch Notes 管理**

**旧版本**:
```
patch-notes.html  # 所有项目共用一个文件
```

**新版本**:
```
patch-notes-switch520-auto-secret.html  # 项目 A
patch-notes-github-enhancer.html        # 项目 B
```

**优势**:
- ✅ 各项目更新日志独立
- ✅ 避免内容覆盖
- ✅ 便于追溯

---

## 快速开始

### 🚀 发布新项目 (3 步完成)

```bash
# 步骤 1: 确保项目已构建测试通过
npm run build:your-project-name

# 步骤 2: 创建并推送 Tag
git tag your-project-name/v1.0.0
git push origin your-project-name/v1.0.0

# 步骤 3: 在 GitHub 编辑 Release Notes (可选)
# CI 会自动创建 Release，你可以后续补充更新日志
```

### 📦 实际示例

```bash
# 发布 switch520-auto-secret v1.5.0
git tag switch520-auto-secret/v1.5.0
git push origin switch520-auto-secret/v1.5.0

# 发布 github-enhancer v0.2.0
git tag github-enhancer/v0.2.0
git push origin github-enhancer/v0.2.0
```

---

## 详细操作流程

### 1️⃣ 开发阶段

```bash
# 进入项目目录
cd projects/switch520-auto-secret

# 安装依赖
npm install

# 开发模式 (热重载)
npm start
# 或从根目录
cd ../..
npm run start:switch520-auto-secret
```

### 2️⃣ 测试阶段

```bash
# 构建生产版本
npm run build:switch520-auto-secret

# 检查构建产物
ls -lh projects/switch520-auto-secret/dist/

# 本地测试安装
# 使用 TamperMonkey 安装 dist/ 目录下的 .user.js 文件
```

### 3️⃣ 发布阶段

```bash
# 确保所有更改已提交
git add .
git commit -m "feat: 新功能描述"

# 创建语义化版本 Tag
git tag switch520-auto-secret/v1.5.0

# 推送 Tag 触发 CI/CD
git push origin switch520-auto-secret/v1.5.0
```

### 4️⃣ CI/CD 自动化流程

Push Tag 后，GitHub Actions 自动执行:

```
✅ 解析 Tag → switch520-auto-secret/v1.5.0
   ├─ 项目名称: switch520-auto-secret
   └─ 版本号: v1.5.0

✅ 验证项目存在性
   └─ 检查 projects/switch520-auto-secret 目录

✅ 安装依赖
   ├─ 根依赖: npm install
   └─ 项目依赖: projects/switch520-auto-secret/npm install

✅ 构建项目
   └─ npm run build:switch520-auto-secret

✅ 验证构建产物
   └─ 检查 dist/ 目录是否存在

✅ 创建 GitHub Release
   ├─ Tag: switch520-auto-secret/v1.5.0
   ├─ 名称: switch520-auto-secret v1.5.0
   └─ 附件: dist/** 所有文件

✅ 触发 GreasyFork Webhook
   └─ 通知外部服务同步更新
```

### 5️⃣ 发布后操作

```bash
# 查看 Release 状态
# https://github.com/your-username/tamperMonkey-scripts/releases

# 查看 CI 日志
# https://github.com/your-username/tamperMonkey-scripts/actions

# 编辑 Release Notes (可选)
# GitHub 会自动创建 Release，你可以补充详细更新日志
# 编辑后会触发 sync-patch-notes.yml 更新 patch notes
```

---

## Tag 命名规范

### ✅ 正确格式

```
{project-name}/{version}
```

**示例**:
```bash
switch520-auto-secret/v1.0.0
switch520-auto-secret/v1.2.3-beta.1
github-enhancer/v0.1.0
test-tampermonkey-jsx/v2.0.0-rc.1
```

### ❌ 错误格式

```bash
# 错误 1: 缺少项目名
v1.0.0

# 错误 2: 使用下划线分隔
switch520_auto_secret/v1.0.0

# 错误 3: 版本号缺少 v 前缀
switch520-auto-secret/1.0.0

# 错误 4: 项目名不存在
unknown-project/v1.0.0
```

### 📋 可用项目列表

运行以下命令查看当前所有可用项目:

```bash
ls -1 projects/
```

当前项目:
- `switch520-auto-secret`
- `github-enhancer`
- `test-tampermonkey-jsx`

---

## CI/CD 工作流说明

### 📄 release.yml (主工作流)

**触发条件**: Push Tag 匹配 `**/v*`

**主要步骤**:
1. 解析 Tag 获取项目名和版本号
2. 验证项目目录存在
3. 安装依赖 (根 + 项目)
4. 构建指定项目
5. 验证构建产物
6. 自动创建 GitHub Release
7. 上传构建产物到 Release
8. 触发 GreasyFork Webhook

**输出**:
- GitHub Release (带附件)
- GreasyFork 同步通知

### 📄 sync-patch-notes.yml (补丁说明同步)

**触发条件**: Release 被编辑

**主要步骤**:
1. 从 Release Tag 解析项目名
2. 检出 `patch-notes` 分支
3. 生成项目特定的 patch notes 文件
4. 提交并推送

**输出**:
- `patch-notes-{project-name}.html` 文件

---

## 常见问题

### Q1: 如何添加新项目?

**A**: 非常简单，无需修改 CI 配置!

```bash
# 1. 在 projects/ 下创建新项目
mkdir projects/my-new-script
cd projects/my-new-script

# 2. 创建必要文件
# - index.tsx (入口)
# - webpack.partial.ts (Webpack 配置)
# - package.json (项目依赖)

# 3. 在根目录 package.json 添加脚本
# "start:my-new-script": "tsx ./scripts/start.ts my-new-script"
# "build:my-new-script": "tsx ./scripts/build.ts my-new-script"

# 4. 开发测试...

# 5. 发布!
git tag my-new-script/v1.0.0
git push origin my-new-script/v1.0.0
```

### Q2: 可以同时发布多个项目吗?

**A**: 可以，分别推送 Tag 即可。

```bash
git tag switch520-auto-secret/v1.5.0
git tag github-enhancer/v0.2.0
git push origin switch520-auto-secret/v1.5.0 github-enhancer/v0.2.0
```

CI 会依次触发两个独立的构建流程。

### Q3: 如何回滚错误的发布?

**A**: 删除 Tag 和 Release。

```bash
# 删除远程 Tag
git push --delete origin switch520-auto-secret/v1.5.0

# 删除本地 Tag
git tag -d switch520-auto-secret/v1.5.0

# 在 GitHub 删除 Release
# https://github.com/.../releases → 点击 Delete
```

### Q4: CI 构建失败怎么办?

**A**: 检查以下步骤:

1. **查看 CI 日志**
   ```
   Actions → 失败的 Workflow → 查看具体错误
   ```

2. **常见错误**:
   - ❌ 项目名拼写错误 → 检查 Tag 格式
   - ❌ 缺少 package.json → 确保项目配置完整
   - ❌ 构建脚本错误 → 本地先测试 `npm run build:项目名`

3. **修复后重新发布**
   ```bash
   # 删除失败 Tag
   git push --delete origin project-name/v1.0.0
   git tag -d project-name/v1.0.0
   
   # 修复问题后重新 Tag
   git tag project-name/v1.0.1  # 建议升级版本号
   git push origin project-name/v1.0.1
   ```

### Q5: GreasyFork Webhook 失败?

**A**: 检查 Secret 配置。

```
Settings → Secrets and variables → Actions
确保 GREASYFORK_WEBHOOK_URL 已正确配置
```

### Q6: 如何测试 CI 流程?

**A**: 使用预发布版本测试。

```bash
# 使用 beta 版本测试
git tag switch520-auto-secret/v1.0.0-beta.1
git push origin switch520-auto-secret/v1.0.0-beta.1

# 测试成功后发布正式版
git tag switch520-auto-secret/v1.0.0
git push origin switch520-auto-secret/v1.0.0
```

---

## 迁移指南

### 从旧版本迁移

如果你之前使用旧版 CI/CD，请按以下步骤迁移:

#### 1. 停止使用旧 Tag 格式

```bash
# ❌ 不再使用
git tag v1.2.3

# ✅ 改为
git tag switch520-auto-secret/v1.2.3
```

#### 2. 更新发布脚本

**旧脚本**:
```bash
# release.sh
git tag v$VERSION
git push origin v$VERSION
```

**新脚本**:
```bash
# release.sh
PROJECT=$1
VERSION=$2

if [ -z "$PROJECT" ] || [ -z "$VERSION" ]; then
  echo "用法: ./release.sh <project-name> <version>"
  echo "示例: ./release.sh switch520-auto-secret 1.5.0"
  exit 1
fi

git tag ${PROJECT}/v${VERSION}
git push origin ${PROJECT}/v${VERSION}
```

#### 3. 更新文档

更新你的 README 和贡献指南，说明新的 Tag 格式。

#### 4. 删除旧工作流 (可选)

确认新流程运行正常后，可以删除旧文件:

```bash
rm .github/workflows/main.yml
rm .github/workflows/SPNORE.yml
rm .github/workflows/SyncPatchNotesonReleaseEdit.yml
```

---

## 最佳实践

### ✅ DO

- ✅ 使用语义化版本号 (SemVer)
- ✅ 发布前本地测试构建
- ✅ 使用 beta/rc 版本测试 CI 流程
- ✅ 编写详细的 Release Notes
- ✅ 定期检查 CI/CD 日志

### ❌ DON'T

- ❌ 跳过本地测试直接发布
- ❌ 使用不规范的 Tag 格式
- ❌ 在 Release Notes 中留空或写无意义内容
- ❌ 频繁删除和重建 Tag
- ❌ 忽略 CI 失败警告

---

## 技术支持

如遇到问题:

1. 查看 CI/CD 日志
2. 检查本文档的常见问题部分
3. 查看 GitHub Actions 文档: https://docs.github.com/actions
4. 提交 Issue 讨论

---

## 更新日志

### v2.0 (2026-04-20)
- ✨ 支持 Monorepo 多项目独立发布
- ✨ 自动从 Tag 解析项目名称
- ✨ 动态构建指定项目
- ✨ 按项目分离 Patch Notes
- 🔄 改为 Tag 触发而非 Release 触发
- 🗑️ 废弃旧的硬编码工作流

### v1.0 (历史版本)
- 仅支持 switch520-auto-secret 项目
- 手动创建 Release 触发构建
- 单一 Patch Notes 文件

---

**文档维护**: 请在每次更新 CI/CD 配置时同步更新此文档。
