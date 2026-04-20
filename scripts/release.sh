#!/bin/bash

# ============================================
# Monorepo 项目发布脚本
# 用法: ./scripts/release.sh <project-name> <version>
# 示例: ./scripts/release.sh switch520-auto-secret 1.5.0
# ============================================

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查参数
if [ -z "$1" ] || [ -z "$2" ]; then
    print_error "参数不足!"
    echo ""
    echo "用法: $0 <project-name> <version>"
    echo ""
    echo "示例:"
    echo "  $0 switch520-auto-secret 1.5.0"
    echo "  $0 github-enhancer 0.2.0"
    echo ""
    echo "可用项目列表:"
    if [ -d "projects" ]; then
        ls -1 projects/
    else
        print_error "projects 目录不存在"
    fi
    exit 1
fi

PROJECT_NAME=$1
VERSION=$2
TAG_NAME="${PROJECT_NAME}/v${VERSION}"

# 检查项目是否存在
if [ ! -d "projects/${PROJECT_NAME}" ]; then
    print_error "项目 '${PROJECT_NAME}' 不存在!"
    echo ""
    print_info "可用项目列表:"
    ls -1 projects/
    exit 1
fi

# 检查 Tag 是否已存在
if git rev-parse "${TAG_NAME}" >/dev/null 2>&1; then
    print_error "Tag '${TAG_NAME}' 已存在!"
    print_info "请先删除现有 Tag 或使用新版本号"
    exit 1
fi

echo ""
print_info "==========================================="
print_info "📦 准备发布项目"
print_info "==========================================="
echo ""
print_info "项目名称: ${PROJECT_NAME}"
print_info "版本号:   v${VERSION}"
print_info "Tag:      ${TAG_NAME}"
echo ""

# 确认发布
read -p "是否继续发布? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "发布已取消"
    exit 0
fi

echo ""
print_info "==========================================="
print_info "🔨 步骤 1: 本地构建测试"
print_info "==========================================="
echo ""

# 检查根依赖
if [ ! -d "node_modules" ]; then
    print_info "安装根依赖..."
    npm install
fi

# 构建项目
print_info "构建项目 ${PROJECT_NAME}..."
print_info "使用版本号: v${VERSION}"

# 设置环境变量，让构建使用指定版本号
export SCRIPT_VERSION="${VERSION}"

if npm run build:${PROJECT_NAME}; then
    print_success "构建成功"
else
    print_error "构建失败! 请修复错误后重试"
    exit 1
fi

# 验证构建产物
if [ ! -d "projects/${PROJECT_NAME}/dist" ]; then
    print_error "构建产物目录不存在!"
    exit 1
fi

print_success "构建产物已生成: projects/${PROJECT_NAME}/dist/"
echo ""

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    print_warning "检测到未提交的更改"
    echo ""
    read -p "是否继续发布? 这些更改不会被包含在本次发布中 (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "发布已取消"
        exit 0
    fi
fi

print_info "==========================================="
print_info "🏷️  步骤 2: 创建并推送 Tag"
print_info "==========================================="
echo ""

# 创建 Tag
print_info "创建 Tag: ${TAG_NAME}"
git tag -a "${TAG_NAME}" -m "Release ${PROJECT_NAME} v${VERSION}"

# 推送 Tag
print_info "推送 Tag 到远程仓库..."
if git push origin "${TAG_NAME}"; then
    print_success "Tag 推送成功!"
else
    print_error "Tag 推送失败!"
    git tag -d "${TAG_NAME}" 2>/dev/null
    exit 1
fi

echo ""
print_success "==========================================="
print_success "🎉 发布流程已启动!"
print_success "==========================================="
echo ""
print_info "CI/CD 正在自动执行:"
echo "  1. 解析项目名和版本号"
echo "  2. 安装依赖"
echo "  3. 构建项目"
echo "  4. 创建 GitHub Release"
echo "  5. 上传构建产物"
echo "  6. 触发 GreasyFork 同步"
echo ""
print_info "查看进度:"
echo "  https://github.com/${GITHUB_REPOSITORY:-YOUR_USERNAME/tamperMonkey-scripts}/actions"
echo ""
print_info "发布完成后，Release 将在这里:"
echo "  https://github.com/${GITHUB_REPOSITORY:-YOUR_USERNAME/tamperMonkey-scripts}/releases/tag/${TAG_NAME}"
echo ""
print_warning "提示: 发布后记得补充 Release Notes!"
echo ""
