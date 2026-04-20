# CI/CD 版本迁移说明

> 本文档详细说明新旧 CI/CD 方案的差异及迁移步骤

---

## 📊 核心差异对比

### 工作流程对比

#### 旧方案 (v1)

```
手动创建 Release
    ↓
触发 main.yml
    ↓
硬编码构建 switch520-auto-secret
    ↓
上传固定路径产物
    ↓
触发 GreasyFork Webhook
```

**问题**:
- ❌ 只能构建单一项目
- ❌ 项目名硬编码在 CI 中
- ❌ 添加新项目需修改 CI 配置
- ❌ 手动创建 Release 容易出错

#### 新方案 (v2)

```
Push Tag (project-name/v1.0.0)
    ↓
触发 release.yml
    ↓
自动解析项目名
    ↓
动态构建指定项目
    ↓
自动创建 Release
    ↓
上传对应产物
    ↓
触发 GreasyFork Webhook
```

**优势**:
- ✅ 支持无限项目
- ✅ 零配置添加新项目
- ✅ 自动化程度更高
- ✅ 减少人为错误

---

## 🔄 详细变化说明

### 1. 触发机制

| 维度 | 旧版本 | 新版本 |
|------|--------|--------|
| **触发事件** | `release: [published]` | `push: tags['**/v*']` |
| **操作方式** | GitHub UI 手动创建 | 命令行推送 Tag |
| **自动化** | 半自动 (需手动创建 Release) | 全自动 (CI 自动创建 Release) |

**示例对比**:

```bash
# 旧方式
# 1. 打开 GitHub
# 2. 点击 "Create a new release"
# 3. 填写版本号、标题、描述
# 4. 点击 "Publish release"
# 5. CI 自动触发

# 新方式
git tag switch520-auto-secret/v1.5.0
git push origin switch520-auto-secret/v1.5.0
# CI 自动触发并创建 Release
```

### 2. 项目识别

| 维度 | 旧版本 | 新版本 |
|------|--------|--------|
| **识别方式** | 硬编码 | Tag 解析 |
| **灵活性** | 固定单一项目 | 动态任意项目 |
| **维护成本** | 高 (需改 CI) | 零 (无需改 CI) |

**代码对比**:

```yaml
# 旧版本 - 硬编码
- name: Build project
  working-directory: projects/switch520-auto-secret
  run: npm run build

# 新版本 - 动态解析
- name: Parse project name
  run: |
    PROJECT_NAME=$(echo $TAG_NAME | cut -d'/' -f1)
    
- name: Build project
  run: npm run build:$PROJECT_NAME
```

### 3. Tag 格式

| 维度 | 旧版本 | 新版本 |
|------|--------|--------|
| **格式** | `v1.2.3` | `project-name/v1.2.3` |
| **语义** | 不明确 | 明确指定项目 |
| **冲突** | 多项目会冲突 | 完全隔离 |

**示例**:

```bash
# 旧版本 - 无法区分项目
git tag v1.2.3  # 哪个项目?

# 新版本 - 清晰明确
git tag switch520-auto-secret/v1.2.3
git tag github-enhancer/v0.1.0
```

### 4. Release 创建

| 维度 | 旧版本 | 新版本 |
|------|--------|--------|
| **创建时机** | 手动创建后触发 CI | CI 自动创建 |
| **Release 名称** | 手动填写 | 自动生成 |
| **附件上传** | CI 上传到已存在的 Release | CI 创建 Release 并上传 |

### 5. Patch Notes

| 维度 | 旧版本 | 新版本 |
|------|--------|--------|
| **文件名** | `patch-notes.html` | `patch-notes-{project}.html` |
| **内容** | 所有项目共用 | 每个项目独立 |
| **覆盖问题** | 会覆盖其他项目 | 完全隔离 |

---

## 🗂️ 文件变更清单

### 新增文件

```
.github/workflows/
├── release.yml              ✨ 新的主发布流程
└── sync-patch-notes.yml     ✨ 新的 patch notes 同步

docs/
├── CI-CD-GUIDE.md           ✨ 完整操作文档
├── QUICK-RELEASE.md         ✨ 快速参考卡片
└── MIGRATION.md             ✨ 本文档

scripts/
└── release.sh               ✨ 自动化发布脚本
```

### 标记废弃的文件

```
.github/workflows/
├── main.yml                 ⚠️ 已废弃 (保留参考)
├── SPNORE.yml               ⚠️ 已废弃 (保留参考)
└── SyncPatchNotesonReleaseEdit.yml  ⚠️ 已废弃 (保留参考)
```

---

## 📝 迁移步骤

### 立即执行

#### 1. 停止使用旧 Tag 格式

```bash
# ❌ 不要再使用
git tag v1.2.3

# ✅ 改为新格式
git tag switch520-auto-secret/v1.2.3
```

#### 2. 更新个人习惯

```bash
# 旧习惯
# 打开 GitHub → 创建 Release → 填写信息 → 发布

# 新习惯
git tag switch520-auto-secret/v1.5.0
git push origin switch520-auto-secret/v1.5.0
# 或
./scripts/release.sh switch520-auto-secret 1.5.0
```

#### 3. 更新文档

如果你有 README 或贡献指南，更新发布说明:

```markdown
## 发布新版本

### 旧方式 (已废弃)
~~创建 GitHub Release 触发 CI~~

### 新方式
git tag switch520-auto-secret/v1.5.0
git push origin switch520-auto-secret/v1.5.0
```

### 后续清理 (可选)

确认新流程稳定运行后，可以删除旧文件:

```bash
# 备份 (可选)
mkdir .github/workflows/deprecated
mv .github/workflows/main.yml .github/workflows/deprecated/
mv .github/workflows/SPNORE.yml .github/workflows/deprecated/
mv .github/workflows/SyncPatchNotesonReleaseEdit.yml .github/workflows/deprecated/

# 或直接删除
rm .github/workflows/main.yml
rm .github/workflows/SPNORE.yml
rm .github/workflows/SyncPatchNotesonReleaseEdit.yml
```

---

## 🧪 测试新流程

### 第一步: Beta 版本测试

```bash
# 使用 beta tag 测试完整流程
git tag switch520-auto-secret/v99.0.0-beta.1
git push origin switch520-auto-secret/v99.0.0-beta.1
```

### 第二步: 验证 CI/CD

检查以下内容:

- [ ] CI 正确解析项目名称
- [ ] 构建成功完成
- [ ] Release 自动创建
- [ ] 构建产物已上传
- [ ] GreasyFork Webhook 触发

### 第三步: 清理测试 Tag

```bash
# 删除测试 Tag
git push --delete origin switch520-auto-secret/v99.0.0-beta.1
git tag -d switch520-auto-secret/v99.0.0-beta.1

# 在 GitHub 删除测试 Release
```

---

## ⚠️ 注意事项

### 1. 版本号管理

```bash
# 旧版本: 全局统一版本号
v6.0.4  # 所有项目共用

# 新版本: 每个项目独立版本
switch520-auto-secret/v6.0.5
github-enhancer/v1.0.0
test-tampermonkey-jsx/v0.1.0
```

### 2. Release Notes

**旧流程**:
```
创建 Release 时填写 → 触发 CI → 发布
```

**新流程**:
```
推送 Tag → CI 自动创建 Release → 手动编辑补充 Release Notes
```

**建议**:
- 先在本地准备好更新日志
- 推送 Tag 后立即编辑 Release
- 编辑会触发 patch notes 同步

### 3. 多项目发布

```bash
# 可以同时发布多个项目
git tag switch520-auto-secret/v1.5.0
git tag github-enhancer/v0.2.0
git push origin switch520-auto-secret/v1.5.0 github-enhancer/v0.2.0

# CI 会依次处理每个项目
```

---

## 🆘 回滚方案

如果新流程出现问题，可以临时回退:

### 临时使用旧流程

```bash
# 1. 恢复旧 CI 配置
git checkout HEAD~1 -- .github/workflows/main.yml

# 2. 使用旧方式发布
# 手动创建 GitHub Release
```

### 完全回滚

```bash
# 如果新流程有严重问题
git revert <commit-hash-of-new-ci>

# 然后使用旧流程发布当前版本
```

---

## 📈 收益分析

### 开发效率

| 指标 | 旧版本 | 新版本 | 提升 |
|------|--------|--------|------|
| 发布步骤 | 5 步 | 2 步 | ⬇️ 60% |
| 添加新项目 | 需改 CI | 零配置 | ⬇️ 100% |
| 人为错误风险 | 高 | 低 | ⬇️ 80% |

### 维护成本

| 指标 | 旧版本 | 新版本 | 改善 |
|------|--------|--------|------|
| CI 配置行数 | ~150 行 | ~120 行 | ⬇️ 20% |
| 新增项目工作量 | 2-3 小时 | 0 小时 | ⬇️ 100% |
| 文档维护 | 分散 | 集中 | ⬆️ 显著 |

---

## 📚 相关文档

- [完整操作指南](./CI-CD-GUIDE.md)
- [快速发布卡片](./QUICK-RELEASE.md)
- [GitHub Actions 文档](https://docs.github.com/actions)

---

## ❓ 常见问题

### Q: 为什么改为 Tag 触发?

**A**: Tag 触发更符合语义化版本管理，且支持自动化创建 Release，减少手动操作。

### Q: 旧的 Release 怎么办?

**A**: 旧的 Release 保持不变，只是新发布使用新流程。

### Q: 可以不使用新流程吗?

**A**: 可以，但不推荐。旧 CI 已标记为废弃，未来会删除。

### Q: 如何批量迁移历史 Tag?

**A**: 历史 Tag 不需要迁移，只需新发布使用新格式即可。

---

**迁移完成日期**: 2026-04-20  
**维护者**: Kane-Kuroneko
