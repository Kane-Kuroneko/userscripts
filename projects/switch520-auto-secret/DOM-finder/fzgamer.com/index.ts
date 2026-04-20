/**
 * fzgamer.com 内容页 DOM 操作
 * 将"温馨提示框"和"游戏视频框"移动到"版本介绍"上方
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

if (process.env.NODE_ENV === 'development') {
	import(/* webpackMode: "eager" */ './tester');
}
