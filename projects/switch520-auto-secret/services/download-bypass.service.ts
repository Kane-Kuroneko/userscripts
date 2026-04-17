/**
 * 下载跳过服务
 * 跳过游戏下载站的"立即下载"二次点击过程，直接跳转到下载地址页
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';

/**
 * 初始化下载跳过服务
 */
export function initDownloadBypassService(): void {
	initGamer520DownloadBypass();
}

/**
 * gamer520 站点下载按钮直达
 * 拦截下载按钮点击事件，直接跳转到下载页
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
			e.preventDefault();
			e.stopPropagation();

			// 可选：发送 AJAX 请求记录下载（当前已禁用）
			/*
			const form = new URLSearchParams();
			form.set('action', 'user_down_ajax');
			form.set('post_id', srcId);
			
			await fetch(`https://${location.host}/wp-admin/admin-ajax.php`, {
				method: 'POST',
				body: form,
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				mode: 'cors',
			});
			*/

			const url = `https://${location.host}/go?post_id=${srcId}`;

			// like.gamer520 子域新窗口打开，其他直接跳转
			if (location.host.includes('like.gamer520')) {
				window.open(url);
			} else {
				location.href = url;
			}
		}, false);
	});
}
