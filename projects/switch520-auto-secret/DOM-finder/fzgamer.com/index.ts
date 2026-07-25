/**
 * fzgamer.com 内容页 DOM 操作
 * 1. 将"温馨提示框"和"游戏视频框"移动到"版本介绍"上方
 * 2. 移除侧栏中"近期游戏热榜"以上的所有内容
 */

/**
 * 移动温馨提示框和游戏视频框到版本介绍上方
 * 最终顺序：游戏视频标题+视频框 → 温馨提示框 → 版本介绍
 */
export const moveElementsToVersionIntro = () => {
	// 只在内容页执行（URL 以 .html 结尾）
	if (!location.href.endsWith('.html')) {
		return;
	}

	// 等待 DOM 加载完成
	const observer = new MutationObserver((mutations, obs) => {
		const articleContent = document.querySelector('.article-content');
		if (!articleContent) return;

		// 查找温馨提示框（在 .article-content 直接子级，通过特征样式匹配）
		const warmTipBox = Array.from(articleContent.children).find(
			(el) => el.outerHTML.includes('温馨提示') && el.getAttribute('style')?.includes('linear-gradient')
		) as HTMLElement;

		// 查找游戏视频标题
		const videoHeading = Array.from(articleContent.querySelectorAll('h3.wp-block-heading')).find(
			(el) => el.textContent.includes('游戏视频')
		) as HTMLElement;

		// 查找游戏视频框（dplayer 播放器）
		const videoBox = articleContent.querySelector('.wp-block-zibllblock-dplayer') as HTMLElement;

		// 查找版本介绍标题
		const versionIntroHeading = Array.from(articleContent.querySelectorAll('h4.wp-block-heading')).find(
			(el) => el.textContent.includes('版本介绍')
		) as HTMLElement;

		// 如果找到了版本介绍标题，执行移动操作
		if (versionIntroHeading) {
			obs.disconnect(); // 停止观察

			const parent = versionIntroHeading.parentElement;

			// 1. 先移动游戏视频标题到版本介绍上方
			if (videoHeading && videoHeading.parentElement) {
				parent.insertBefore(videoHeading, versionIntroHeading);
				console.log('[fzgamer] 游戏视频标题已移动到版本介绍上方');
			}

			// 2. 再移动游戏视频框到版本介绍上方（在标题之后）
			if (videoBox && videoBox.parentElement) {
				parent.insertBefore(videoBox, versionIntroHeading);
				console.log('[fzgamer] 游戏视频框已移动到版本介绍上方');
			}

			// 3. 最后移动温馨提示框到版本介绍上方（在游戏视频之后）
			if (warmTipBox && warmTipBox.parentElement) {
				parent.insertBefore(warmTipBox, versionIntroHeading);
				console.log('[fzgamer] 温馨提示框已移动到版本介绍上方');
			}
		}
	});

	// 开始观察 DOM 变化
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// 如果 DOM 已经加载完成，立即尝试执行
	setTimeout(() => {
		const articleContent = document.querySelector('.article-content');
		if (articleContent) {
			observer.takeRecords(); // 触发一次检查
		}
	}, 1000);
};

/**
 * 移除侧栏中"近期游戏热榜"以上的所有内容
 * 仅在 .sidebar 容器内部操作，不影响 .content-wrap 主内容区
 */
export const removeSidebarContentAboveHotRank = () => {
	// 使用 MutationObserver 等待 DOM 加载完成
	const observer = new MutationObserver((mutations, obs) => {
		// 查找侧栏容器
		const sidebar = document.querySelector('.sidebar');
		if (!sidebar) return;

		// 在侧栏内查找"近期游戏热榜"标题
		const titleThemeElements = sidebar.querySelectorAll('.title-theme');
		const hotRankTitle = Array.from(titleThemeElements).find(
			(el) => el.textContent.includes('近期游戏热榜')
		) as HTMLElement;

		if (!hotRankTitle) return;

		obs.disconnect(); // 停止观察

		// 找到热榜标题所在的容器（data-affix="true" 的那个 div）
		const hotRankContainer = hotRankTitle.closest('[data-affix="true"]') as HTMLElement;
		if (!hotRankContainer) return;

		// 收集热榜容器之前的所有 .sidebar 直接子元素
		const elementsToRemove: HTMLElement[] = [];
		let elem = hotRankContainer.previousElementSibling as HTMLElement | null;
		
		while (elem) {
			elementsToRemove.push(elem);
			elem = elem.previousElementSibling as HTMLElement | null;
		}

		// 移除所有收集到的元素
		elementsToRemove.forEach((el) => {
			el.remove();
		});

		console.log(`[fzgamer] ✅ 成功移除侧栏中"近期游戏热榜"以上的 ${elementsToRemove.length} 个元素`);
	});

	// 开始观察 DOM 变化
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// 如果 DOM 已经加载完成，立即尝试执行
	setTimeout(() => {
		const sidebar = document.querySelector('.sidebar');
		if (sidebar) {
			const hotRankTitle = Array.from(sidebar.querySelectorAll('.title-theme')).find(
				(el) => el.textContent.includes('近期游戏热榜')
			);
			if (hotRankTitle) {
				observer.takeRecords(); // 触发一次检查
			}
		}
	}, 1500);
};

/**
 * 移除 id 为 snakeCanvas 的 canvas 画布元素
 */
export const removeSnakeCanvas = () => {
	// 使用 MutationObserver 等待 DOM 加载完成
	const observer = new MutationObserver((mutations, obs) => {
		// 查找 snakeCanvas 元素
		const snakeCanvas = document.getElementById('snakeCanvas');
		if (!snakeCanvas) return;

		obs.disconnect(); // 停止观察

		// 移除 canvas 元素
		snakeCanvas.remove();
		console.log('[fzgamer] ✅ 成功移除 id 为 snakeCanvas 的 canvas 元素');
	});

	// 开始观察 DOM 变化
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// 如果 DOM 已经加载完成，立即尝试执行
	setTimeout(() => {
		const snakeCanvas = document.getElementById('snakeCanvas');
		if (snakeCanvas) {
			observer.takeRecords(); // 触发一次检查
		}
	}, 500);
};

/**
 * 解析「正版购买」对应的 Steam 直链
 * 站长改为扫码弹窗后，按钮 href 变为 pay-download，真实链接在 window.__fzg_d
 */
export function resolveSteamBuyUrl(): string | null {
	const list = (window as Window & {
		__fzg_d?: Array<{ d?: string; name?: string; type?: string; is_buy?: boolean }>;
	}).__fzg_d;

	const decodeItemUrl = (item?: { d?: string }): string | null => {
		if (!item?.d) return null;
		try {
			const url = atob(item.d).trim();
			return isSteamStoreUrl(url) ? url : null;
		} catch {
			return null;
		}
	};

	if (Array.isArray(list)) {
		for (const item of list) {
			const isBuy = item.is_buy || item.type === 'buy' || /正版/.test(item.name || '');
			if (!isBuy) continue;
			const url = decodeItemUrl(item);
			if (url) return url;
		}

		// 按「正版购买」按钮 down_id 对齐 __fzg_d 下标
		const buyBtn = findBuyButton();
		if (buyBtn?.href) {
			try {
				const downId = new URL(buyBtn.href, location.origin).searchParams.get('down_id');
				if (downId != null) {
					const url = decodeItemUrl(list[Number(downId)]);
					if (url) return url;
				}
			} catch {
				// ignore
			}
		}
	}

	// 下载区若仍残留直链
	const downloadRow = document.querySelector('.but-download')?.parentElement;
	const direct = downloadRow?.querySelector('a[href*="store.steampowered.com"]') as HTMLAnchorElement | null;
	if (direct?.href && isSteamStoreUrl(direct.href)) {
		return direct.href;
	}

	// 旧版：带 steam-square 图标的按钮
	const legacy = document.querySelector('a.but.b-theme.b-black i.fa-steam-square')?.parentElement as HTMLAnchorElement | null;
	if (legacy?.href && isSteamStoreUrl(legacy.href)) {
		return legacy.href;
	}

	return null;
}

/**
 * 从文章标题提取游戏名（优先英文）
 * 结构示例：埃尔巴布/ELbab + .fzg-title-new「最新」
 */
export function getGameName(): string {
	const h1 = document.querySelector('h1.article-title') as HTMLElement | null;
	if (h1) {
		const clone = h1.cloneNode(true) as HTMLElement;
		clone.querySelectorAll('.fzg-title-new').forEach((el) => el.remove());
		const fromH1 = pickGameNameFromTitle((clone.textContent || '').trim());
		if (fromH1) return fromH1;
	}

	const fromDocTitle = pickGameNameFromTitle(document.title.split(/[-–|]/)[0].trim());
	return fromDocTitle;
}

function findBuyButton(): HTMLAnchorElement | null {
	const buttons = Array.from(
		document.querySelectorAll('.but-download a, a.but.b-theme')
	) as HTMLAnchorElement[];
	return (
		buttons.find(
			(a) =>
				/正版购买|Genuine\s*purchase/i.test(a.textContent || '') ||
				!!a.querySelector('.fzg-buy-icon')
		) || null
	);
}

function pickGameNameFromTitle(raw: string): string {
	if (!raw) return '';
	let text = raw.replace(/\s*(最新|热门|推荐|Latest)\s*$/i, '').trim();
	if (text.includes('/')) {
		const parts = text.split('/').map((s) => s.trim()).filter(Boolean);
		const english = [...parts].reverse().find((p) => /[A-Za-z]/.test(p));
		if (english) return english;
	}
	return text;
}

if (process.env.NODE_ENV === 'development') {
	import(/* webpackMode: "eager" */ './tester');
}

import { isSteamStoreUrl } from '../../utils/steam-search';

