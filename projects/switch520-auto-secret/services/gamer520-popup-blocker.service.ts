/**
 * gamer520.com 下载页面弹窗禁用服务
 * 使用多种策略完全阻止 SweetAlert2 弹窗出现
 */

/**
 * 策略 1: 确保 CSS 已注入（防御性检查）
 */
const injectCSSBlocker = (): void => {
	// 检查是否已经注入
	if (document.querySelector('style[data-gamer520-blocker]')) {
		console.log('[gamer520-popup-blocker] ✅ CSS 已存在，跳过注入');
		return;
	}
	
	// 如果还没有，再次注入
	const target = document.head || document.documentElement;
	const style = document.createElement('style');
	style.setAttribute('data-gamer520-blocker', 'true');
	style.textContent = `
		body > div.swal2-container,
		div.swal2-container,
		.swal2-popup,
		.swal2-modal {
			display: none !important;
			visibility: hidden !important;
			opacity: 0 !important;
			pointer-events: none !important;
			width: 0 !important;
			height: 0 !important;
			overflow: hidden !important;
			position: fixed !important;
			left: -9999px !important;
			top: -9999px !important;
			z-index: -9999 !important;
		}
		html.swal2-shown,
		html.swal2-no-transition {
			overflow: auto !important;
			padding-right: 0 !important;
		}
		body.swal2-shown,
		body.swal2-height-auto,
		body.swal2-no-transition {
			overflow: auto !important;
			height: auto !important;
			padding-right: 0 !important;
		}
	`;
	
	if (target.firstChild) {
		target.insertBefore(style, target.firstChild);
	} else {
		target.appendChild(style);
	}
	console.log('[gamer520-popup-blocker] ✅ CSS 拦截器已注入（函数调用）');
};

/**
 * 策略 2: 拦截 SweetAlert2 全局函数
 */
const interceptSwalFunctions = (): void => {
	// 等待 Swal 对象出现并覆盖
	const tryIntercept = () => {
		if (window.Swal) {
			const originalSwal = window.Swal;
			window.Swal = new Proxy(originalSwal, {
				apply(target, thisArg, args) {
					console.log('[gamer520-popup-blocker] 🚫 拦截 Swal 调用:', args[0]);
					// 检查是否是我们的目标弹窗
					const content = typeof args[0] === 'object' ? args[0].html : args[0];
					if (content && typeof content === 'string' && content.includes('欢迎来到 GAMER520.COM')) {
						console.log('[gamer520-popup-blocker] ✅ 已阻止目标弹窗');
						return Promise.resolve({ isConfirmed: false });
					}
					return target.apply(thisArg, args);
				}
			});
			console.log('[gamer520-popup-blocker] ✅ Swal 函数已拦截');
			return true;
		}
		return false;
	};

	if (!tryIntercept()) {
		// 定时尝试，直到 Swal 加载
		const interval = setInterval(() => {
			if (tryIntercept()) {
				clearInterval(interval);
			}
		}, 50);
		// 5秒后停止尝试
		setTimeout(() => clearInterval(interval), 5000);
	}
};

/**
 * 策略 3: MutationObserver 在节点渲染前删除
 */
const setupMutationObserver = (): void => {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === 'childList') {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as HTMLElement;
						// 立即删除匹配的弹窗（在浏览器渲染前）
						if (element.classList?.contains('swal2-container')) {
							const content = element.querySelector('.swal2-content');
							if (content && content.innerHTML.includes('欢迎来到 GAMER520.COM')) {
								console.log('[gamer520-popup-blocker] 🚫 DOM 拦截：删除弹窗');
								element.remove();
							}
						}
					}
				});
			}
		}
	});

	// 观察 body 的子节点变化
	if (document.body) {
		observer.observe(document.body, {
			childList: true,
			subtree: false
		});
		console.log('[gamer520-popup-blocker] ✅ MutationObserver 已启动');
	}

	// 页面卸载时断开观察
	window.addEventListener('beforeunload', () => observer.disconnect());
};

/**
 * 初始化 gamer520.com 弹窗禁用服务
 */
export const initGamer520PopupBlocker = (): void => {
	console.log('[gamer520-popup-blocker] 服务初始化');
	
	useMatchDomain({
		includes: ['gamers520.com'],
	}, () => {
		// 只在内容页执行（URL 以 .html 结尾）
		if (!location.href.endsWith('.html')) {
			return;
		}

		console.log('[gamer520-popup-blocker] 启动多层弹窗拦截');

		// 策略 1: 立即注入 CSS（最快）
		injectCSSBlocker();

		// 策略 2: 拦截 Swal 函数（阻止调用）
		// interceptSwalFunctions();

		// 策略 3: DOM 变化时删除节点（兜底）
		// setupMutationObserver();
	});
};

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';

// 扩展 Window 接口以支持 Swal
declare global {
	interface Window {
		Swal?: any;
	}
}
