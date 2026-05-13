/**
 * 下载跳过服务
 * 跳过游戏下载站的"立即下载"二次点击过程，直接跳转到下载地址页
 *
 * iframe 内预检查：post_id 在精细化黑名单时直接新标签页打开，避免 302 死循环
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { BAD_POST_IDS_KEY, PENDING_SRC_KEY, MSG_SOURCE } from './auto-secret.service';

/**
 * 初始化下载跳过服务
 */
export function initDownloadBypassService(): void {
	initGamer520DownloadBypass();
}

/**
 * gamer520 站点下载按钮直达
 * 拦截下载按钮点击事件，直接跳转到下载页
 * iframe 内若 post_id 在黑名单则新标签页打开，跳过 302 链
 */
function initGamer520DownloadBypass(): void {
	useMatchDomain({
		includes: ['gamer520.com'],
	}, async () => {
		if (!location.href.endsWith('.html')) return;

		const downloadBtn = document.querySelector('a.go-down') as HTMLElement;
		if (!downloadBtn) return;

		const srcId = downloadBtn.dataset.id;

		downloadBtn?.addEventListener('click', async (e) => {
			// useCapture=true 确保先于原页面监听器执行
			// stopImmediatePropagation 彻底阻断同元素上其他监听器，避免原页面弹窗
			e.preventDefault();
			e.stopImmediatePropagation();

			const url = `https://${location.host}/go?post_id=${srcId}`;

			// like.gamer520 子域新窗口打开
			if (location.host.includes('like.gamer520')) {
				window.open(url);
				return;
			}

			// iframe 内预检查：post_id 在精细化黑名单 → 新标签页打开，跳过 302 死循环
			if (window.parent !== window.self) {
				if (await isPostIdBlacklisted(srcId as string)) {
					console.log(`[download-bypass] post_id=${srcId} 在黑名单，新标签页打开`);
					notifyTopOpenTab(url);
					return;
				}
			}

			// 写入待确认 post_id（供 auto-secret 死循环检测后接力）
			await GM.setValue(PENDING_SRC_KEY, srcId);
			location.href = url;
		}, true); // useCapture: true — 在捕获阶段拦截，先于原页面冒泡阶段监听器
	});
}

/**
 * 检查 post_id 是否在精细化黑名单中
 */
async function isPostIdBlacklisted(postId: string): Promise<boolean> {
	const raw = await GM.getValue(BAD_POST_IDS_KEY, '[]');
	const list: string[] = JSON.parse(raw as string);
	return list.includes(postId);
}

/**
 * 通过 postMessage + 直接调用打开新标签页（双保险）
 */
function notifyTopOpenTab(url: string): void {
	if (window.parent !== window.self) {
		window.parent.postMessage({
			source: MSG_SOURCE,
			type: 'OPEN_TAB',
			url
		}, '*');
	}
	window.open(url, '_blank');
}

