/**
 * 百度网盘自动提交服务
 * 在百度网盘分享页面自动点击"提取文件"按钮
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';

/**
 * 初始化百度网盘自动提交服务
 */
export function initBaiduPanAutoSubmitService(): void {
	useMatchDomain({
		hosts: ['pan.baidu.com'],
	}, () => {
		if (!location.href.startsWith('https://pan.baidu.com')) return;
		if (!location.href.includes('pwd=')) return;

		const submitBtn = document.getElementById('submitBtn');
		if (submitBtn?.innerText === '提取文件') {
			submitBtn.click();
		}
	});
}
