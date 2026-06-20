# 发布流程检查清单

## 教训记录（2026-06-21 v7.2.0 发布事故）

### 事故描述
发布 7.2.0 时，有三处错误：

1. **CHANGELOG.md 删除了已发布的 `7.1.0 补丁` 条目** — 将 ResizeObserver 修复错误地合并到 7.2.0 条目中，而它是 7.1.0 的补丁，应保持独立
2. **CHANGELOG.md 中 7.2.0 内容过载** — 7.2.0 只应包含 acgxj su-download 适配（新 feature），ResizeObserver 修复属于 7.1.0 补丁
3. **Readme.md 中 7.2.0 放在错误位置** — 插入到了 `<hr>` 分隔线和 `<h3>🚀 7.x 主要功能更新</h3>` 之间，而非「更新日志」区域最前面（与 7.1.0 排在一起）

### 根因
- 没有逐条核对 CHANGELOG.md 已有条目，直接覆盖了整块内容
- 没有理解 Readme.md 的文档结构层次（「更新日志」vs「7.x 主要功能更新」）
- 没有在最终检查中对比两个文件的版本条目一致性

---

## 发布前检查清单

每次准备发布新版本时，逐项确认：

### 1. 版本号确认
- [ ] 检查现有 git tag 列表：`git tag -l`
- [ ] 确认新版本号未被使用
- [ ] 确认语义：新功能（minor） vs 修复（patch）

### 2. CHANGELOG.md 检查
- [ ] **保留所有已有条目不动**，仅在最前面新增当前版本条目
- [ ] 当前版本条目**只包含本次新增的改动**，不合并已有条目
- [ ] 条目格式与历史一致（`<h2>` 表情符号 + 版本号 + 版本更新）

### 3. Readme.md 检查
- [ ] 新版本条目插入到**更新日志区域最前面**（`<h1>📝 更新日志</h1>` 之后，现有最旧版本之前）
- [ ] 不要插入到 `<hr>` 分隔线之后的「7.x 主要功能更新」区域
- [ ] 新版本条目内容**与 CHANGELOG.md 保持一致**

### 4. webpack.partial.ts 版本号
- [ ] `version: process.env.SCRIPT_VERSION || 'X.Y.Z'` 中的默认版本号已更新

### 5. 最终检查（发布前）
- [ ] `git diff --stat` 确认只改了预期文件
- [ ] CHANGELOG.md 所有已有条目完整无缺
- [ ] Readme.md 新版本在正确位置
- [ ] 两个文件的新版本条目内容一致

### 6. 发布
- [ ] `git add + git commit -m "chore: bump version to X.Y.Z for release"`
- [ ] 运行 `bash ./scripts/release.sh <project-name> X.Y.Z`
- [ ] 确认 tag 已推送到远程：`git ls-remote --tags origin X.Y.Z`
