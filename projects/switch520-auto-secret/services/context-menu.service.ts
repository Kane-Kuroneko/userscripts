/**
 * 右键菜单服务
 * 解除特定站点的右键菜单限制
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';

/**
 * 初始化右键菜单服务
 */
export function initContextMenuService(): void {
	initSwitch618ContextMenu();
}

/**
 * switch618.com 站点允许右键菜单
 * 移除 document.oncontextmenu 的限制
 */
function initSwitch618ContextMenu(): void {
	useMatchDomain({
		includes: ['switch618']
	}, () => {
		document.oncontextmenu = null;
	});
}
