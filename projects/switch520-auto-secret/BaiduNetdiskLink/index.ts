/**
 * 百度网盘链接处理工具集 - 兼容层
 * 提供向后兼容的 re-export，实际实现已迁移至对应模块
 */

import { extractBaiduPwd } from '../core/password-extractor';
import { recursiveFindContainer, findDirectTextNode } from '../utils/dom-helper';

// Re-export 核心函数（保持向后兼容）
export { extractBaiduPwd as getPwd };
export { recursiveFindContainer as recursiveFindDirectContainer };
export { findDirectTextNode as findTextNode };

// 兼容旧版 API 的对象导出
export const BaiduNetdiskLink = {
	getPwd: extractBaiduPwd,
	recursiveFindDirectContainer: recursiveFindContainer,
	findTextNode: findDirectTextNode,
};
