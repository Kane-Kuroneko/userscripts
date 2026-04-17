/**
 * Steam 搜索按钮特性
 * 在游戏详情页插入“去Steam搜索”按钮组件
 */

import { SearchInSteam } from '../../Components/SearchInSteamButton';
import { createRoot } from 'react-dom/client';
import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
// 静态导入 DOM 查找器（避免代码分割）
import { articleContainer as getGamer520ArticleContainer } from '../../DOM-finder/switch520.com';

/**
 * 初始化 Steam 搜索按钮
 */
export function initSearchInSteam(): void {
	if (location.href.includes('wp-content/plugins/erphpdown/download.php')) {
		return;
	}

	const div = document.createElement('div');
	const reactRoot = createRoot(div);

	initGamer520SearchButton();
	initSwitch618SearchButton();
	initSteamzgSearchButton();

	/**
	 * gamer520.com 站点插入搜索按钮
	 */
	function initGamer520SearchButton(): void {
		useMatchDomain({
			includes: ['gamer520.com']
		}, () => {
			const container = getGamer520ArticleContainer();
			
			if (!document.body.innerText.includes('牛夫人') && location.pathname !== '/' && container) {
				container.prepend(div);
				reactRoot.render(<SearchInSteam />);
			}
		});
	}

	/**
	 * switch618.com 站点插入搜索按钮
	 */
	function initSwitch618SearchButton(): void {
		useMatchDomain({
			regExp: /switch618\.com\/[\d+]+.html/g,
		}, () => {
			const container = document.querySelector(`.erphpdown-box`)!;
			if (!container) return;
			
			container.insertAdjacentElement('afterend', div);
			reactRoot.render(<SearchInSteam />);
		});
	}

	/**
	 * steamzg.com 站点插入搜索按钮
	 */
	function initSteamzgSearchButton(): void {
		useMatchDomain({
			includes: ['steamzg']
		}, () => {
			if (!/\d{5,8}\/?$/.test(location.pathname)) return;
			if (location.host === 'xj.steamzg.com') return;
			
			const siblingEl = document.querySelector('.su-row');
			if (!siblingEl) {
				throw new Error('无法找到挂载<SearchInSteam />的节点');
			}
			
			const parent = siblingEl.parentElement;
			parent?.insertBefore(div, siblingEl);
			reactRoot.render(<SearchInSteam />);
		});
	}
}
