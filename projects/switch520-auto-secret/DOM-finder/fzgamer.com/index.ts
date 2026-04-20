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
	console.log('[fzgamer-debug] removeSidebarContentAboveHotRank 函数被调用');
	console.log('[fzgamer-debug] 当前 URL:', location.href);

	// 使用 MutationObserver 等待 DOM 加载完成
	const observer = new MutationObserver((mutations, obs) => {
		console.log('[fzgamer-debug] MutationObserver 触发');
		
		// 查找侧栏容器
		const sidebar = document.querySelector('.sidebar');
		console.log('[fzgamer-debug] 查找 .sidebar:', sidebar ? '找到' : '未找到');
		if (!sidebar) {
			console.log('[fzgamer-debug] 侧栏未找到，等待下一次触发');
			return;
		}
		
		console.log('[fzgamer-debug] 侧栏 HTML 片段:', sidebar.innerHTML.substring(0, 200));

		// 在侧栏内查找"近期游戏热榜"标题
		const titleThemeElements = sidebar.querySelectorAll('.title-theme');
		console.log('[fzgamer-debug] 找到 .title-theme 元素数量:', titleThemeElements.length);
		
		const hotRankTitle = Array.from(titleThemeElements).find(
			(el) => {
				const text = el.textContent;
				console.log('[fzgamer-debug] 检查 .title-theme 文本:', text);
				return text.includes('近期游戏热榜');
			}
		) as HTMLElement;

		console.log('[fzgamer-debug] 查找 "近期游戏热榜":', hotRankTitle ? '找到' : '未找到');
		if (!hotRankTitle) {
			console.log('[fzgamer-debug] 热榜标题未找到，等待下一次触发');
			return;
		}

		console.log('[fzgamer-debug] 停止观察 DOM');
		obs.disconnect(); // 停止观察

		// 找到热榜标题所在的容器（data-affix="true" 的那个 div）
		const hotRankContainer = hotRankTitle.closest('[data-affix="true"]') as HTMLElement;
		if (!hotRankContainer) {
			console.log('[fzgamer-debug] 未找到 data-affix="true" 容器');
			return;
		}
		console.log('[fzgamer-debug] 找到热榜容器:', hotRankContainer.className);

		// 收集热榜容器之前的所有 .sidebar 直接子元素
		const elementsToRemove: HTMLElement[] = [];
		let elem = hotRankContainer.previousElementSibling as HTMLElement | null;
		
		console.log('[fzgamer-debug] 开始收集要移除的元素');
		while (elem) {
			elementsToRemove.push(elem);
			console.log('[fzgamer-debug] 收集到元素:', elem.className || elem.tagName, elem.id ? `#${elem.id}` : '');
			elem = elem.previousElementSibling as HTMLElement | null;
		}

		console.log('[fzgamer-debug] 共收集到', elementsToRemove.length, '个元素需要移除');

		// 移除所有收集到的元素
		elementsToRemove.forEach((el, index) => {
			el.remove();
			console.log(`[fzgamer-debug] 已移除元素 [${index + 1}/${elementsToRemove.length}]:`, el.className || el.tagName);
		});

		console.log(`[fzgamer] ✅ 成功移除侧栏中"近期游戏热榜"以上的 ${elementsToRemove.length} 个元素`);
	});

	// 开始观察 DOM 变化
	console.log('[fzgamer-debug] 开始观察 DOM 变化');
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});

	// 如果 DOM 已经加载完成，立即尝试执行
	setTimeout(() => {
		console.log('[fzgamer-debug] setTimeout 1500ms 触发，尝试手动检查');
		const sidebar = document.querySelector('.sidebar');
		console.log('[fzgamer-debug] setTimeout 中查找 .sidebar:', sidebar ? '找到' : '未找到');
		if (sidebar) {
			const hotRankTitle = Array.from(sidebar.querySelectorAll('.title-theme')).find(
				(el) => el.textContent.includes('近期游戏热榜')
			);
			console.log('[fzgamer-debug] setTimeout 中查找 "近期游戏热榜":', hotRankTitle ? '找到' : '未找到');
			if (hotRankTitle) {
				console.log('[fzgamer-debug] 触发 observer.takeRecords()');
				observer.takeRecords(); // 触发一次检查
			}
		}
	}, 1500);
};

if (process.env.NODE_ENV === 'development') {
	import(/* webpackMode: "eager" */ './tester');
}
