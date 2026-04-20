/**
 * fzgamer.com DOM 操作测试文件
 */

const tester = () => {
	console.log('[fzgamer tester] 测试 DOM 元素移动功能');
	
	// 检查是否存在目标元素
	const articleContent = document.querySelector('.article-content');
	if (!articleContent) {
		console.warn('[fzgamer tester] 未找到 .article-content 元素');
		return;
	}

	// 检查温馨提示框（直接子级）
	const warmTipBox = Array.from(articleContent.children).find(
		(el) => el.outerHTML.includes('温馨提示') && el.getAttribute('style')?.includes('linear-gradient')
	);
	console.log('[fzgamer tester] 温馨提示框:', warmTipBox ? '已找到' : '未找到');

	// 检查游戏视频标题
	const videoHeading = Array.from(articleContent.querySelectorAll('h3.wp-block-heading')).find(
		(el) => el.textContent.includes('游戏视频')
	);
	console.log('[fzgamer tester] 游戏视频标题:', videoHeading ? '已找到' : '未找到');

	// 检查游戏视频框
	const videoBox = articleContent.querySelector('.wp-block-zibllblock-dplayer');
	console.log('[fzgamer tester] 游戏视频框:', videoBox ? '已找到' : '未找到');

	// 检查版本介绍标题
	const versionIntroHeading = Array.from(articleContent.querySelectorAll('h4.wp-block-heading')).find(
		(el) => el.textContent.includes('版本介绍')
	);
	console.log('[fzgamer tester] 版本介绍标题:', versionIntroHeading ? '已找到' : '未找到');

	// 执行移动操作
	if (warmTipBox && videoHeading && videoBox && versionIntroHeading) {
		console.log('[fzgamer tester] 所有元素已找到，可以执行移动操作');
		console.log('[fzgamer tester] 移动顺序：游戏视频标题 → 游戏视频框 → 温馨提示框 → 版本介绍');
	}
};

useMatchDomain({
	includes: ['fzgamer'],
}, () => {
	__DEV__ && tester();
});

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
