/**
 * 下载跳转服务
 * 在 gamer520 内容页点击"立即下载"后，通过 GM.xmlHttpRequest 获取内容并替换页面
 *
 * 核心原理：
 * - form.submit() 在跨站 iframe 中会触发第三方 Cookie 阻止，Set-Cookie 被丢弃
 * - GM.xmlHttpRequest 运行在扩展环境，anonymous: false 可正常设置 Cookie
 * - 使用 document.open/write/close 替换页面内容，避免 SameSite 限制
 */

/**
 * gamer520 站点下载跳转并自动填密码
 */
function initGamer520DownloadJump(): void {
	// 仅在文章详情页生效
	if (!location.href.endsWith('.html')) return;

	const downloadBtn = document.querySelector<HTMLAnchorElement>('a.go-down');
	if (!downloadBtn) return;

	const srcId = downloadBtn.dataset.id;
	if (!srcId) return;

	downloadBtn.addEventListener('click', async (e) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			// 1. 获取跳转 URL
			const redirectUrl = await getRedirectUrl(
				`https://${location.host}/go/?post_id=${srcId}`
			);

			if (!redirectUrl) {
				console.warn('[download-jump] 未找到跳转URL');
				return;
			}

			// 2. 从分享页读取密码
			const password = await readPassword(redirectUrl);

			if (password) {
				// 3. 通过 GM.xmlHttpRequest 提交密码（anonymous: false 携带 Cookie）
				await gmSubmitPassword(password, redirectUrl);
			}

			// 4. 通过 GM.xmlHttpRequest 获取下载页内容（Cookie 已由步骤3设置）
			console.log('[download-jump] 获取下载页内容:', redirectUrl);
			const html = await gmGetProtectedContent(redirectUrl);

			if (html) {
				// 5. 替换当前文档内容（模拟跳转，但避开 SameSite 限制）
				document.open();
				document.write(html);
				document.close();
			} else {
				console.warn('[download-jump] 未获取到下载页内容');
			}
		} catch (error) {
			console.error('[download-jump] 处理下载请求失败:', error);
		}
	});
}

/**
 * 通过 GM.xmlHttpRequest POST 提交密码
 * anonymous: false 确保 Set-Cookie 被保存到浏览器 Cookie jar
 */
function gmSubmitPassword(
	password: string,
	originalUrl: string
): Promise<void> {
	return new Promise((resolve, reject) => {
		const urlObject = new URL(originalUrl);
		const passwordUrl = `${urlObject.origin}/wp-login.php?action=postpass`;

		GM.xmlHttpRequest({
			method: 'POST',
			url: passwordUrl,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			data: `post_password=${encodeURIComponent(password)}&Submit=%E6%8F%90%E4%BA%A4`,
			anonymous: false,
			onload() {
				console.log('[download-jump] 密码提交成功');
				resolve();
			},
			onerror(err) {
				console.error('[download-jump] 密码提交失败:', err);
				reject(err);
			},
		});
	});
}

/**
 * 通过 GM.xmlHttpRequest GET 获取受保护页面内容
 * anonymous: false 确保携带已设置的 wp-postpass Cookie
 */
function gmGetProtectedContent(url: string): Promise<string | null> {
	return new Promise((resolve) => {
		GM.xmlHttpRequest({
			method: 'GET',
			url,
			anonymous: false,
			onload(response) {
				resolve(response.responseText);
			},
			onerror() {
				resolve(null);
			},
		});
	});
}

/**
 * 通过 GM.xmlHttpRequest 获取重定向后的真实 URL
 */
function getRedirectUrl(url: string): Promise<string | null> {
	return new Promise((resolve) => {
		GM.xmlHttpRequest({
			method: 'GET',
			url,
			onload(response) {
				const regex = /window\.location\s*=\s*['"]([^'"]+)['"]/;
				const match = response.responseText.match(regex);
				resolve(match?.[1] || null);
			},
			onerror() {
				resolve(null);
			},
		});
	});
}

/**
 * 通过 GM.xmlHttpRequest 从分享页读取密码
 */
function readPassword(url: string): Promise<string | null> {
	return new Promise((resolve) => {
		GM.xmlHttpRequest({
			method: 'GET',
			url,
			onload(response) {
				const doc = new DOMParser().parseFromString(
					response.responseText,
					'text/html'
				);
				const titleEl = doc.querySelector('h1.entry-title');
				if (titleEl) {
					const match = titleEl.textContent?.match(/[A-Za-z0-9]+/);
					resolve(match?.[0] || null);
				} else {
					resolve(null);
				}
			},
			onerror() {
				resolve(null);
			},
		});
	});
}

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';

/**
 * 初始化下载跳转服务
 */
export function initDownloadJumpService(): void {
	useMatchDomain(
		{ includes: ['gamer520.com', 'gamers520.com'] },
		initGamer520DownloadJump
	);
}
