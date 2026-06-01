/**
 * 二维码转链接服务
 * 将页面中的二维码 canvas/image 解析为直链，免去扫码步骤
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { decodeQrFromCanvas, decodeQRFromImageElement } from '../QrcodeToLink';
import { extractUnifiedCode } from '../core/password-extractor';
import { getProviderName } from '../utils/url-helper';
import { insertAfter } from '../utils/dom-helper';

/**
 * 初始化二维码转链接服务
 */
export function initQrcodeConverterService(): void {
	initAcgQrcodeConverter();
	initGamer520QrcodeConverter();
}

/**
 * acgxj/acfb/xj.steamzg 站点处理
 * 将 canvas.su-qr-canvas 解析为直链
 */
function initAcgQrcodeConverter(): void {
	useMatchDomain({
		includes: ['acgxj.com', 'acfb.top', 'xj.steamzg.com']
	}, () => {
		const qrCodeCanvasEls = Array.from(document.querySelectorAll('canvas.su-qr-canvas')) as HTMLCanvasElement[];
		const withdrawCode = findUnifiedWithdrawCode();

		qrCodeCanvasEls.forEach((canvas) => {
			let url = decodeQrFromCanvas(canvas);
			if (!url) return;

			// 附加统一提取码
			if (withdrawCode) {
				url = url.includes('?') ? `${url}&pwd=${withdrawCode}` : `${url}?pwd=${withdrawCode}`;
			}

			const link = createDirectLink(url);
			insertAfter(link, canvas);
		});
	});
}

/**
 * gamer520/gamers520 站点处理
 * 将 img.wpkqcg_qrcode 解析为直链（文章页 + 下载页）
 */
function initGamer520QrcodeConverter(): void {
	useMatchDomain({
		includes: ['gamer520.com', 'gamers520.com']
	}, () => {
		const qrcodeImages = Array.from(document.querySelectorAll('img.wpkqcg_qrcode')) as HTMLImageElement[];

		qrcodeImages.forEach((el) => {
			// 优先从隐藏 input 提取 URL（文章页内嵌完整链接，更可靠）
			let url = extractUrlFromHiddenInput(el) || decodeQRFromImageElement(el);

			if (!url) return;

			// 尝试提取提取码并附加（仅当 URL 不含 pwd 时）
			if (!url.includes('pwd=')) {
				const codeEl = findExtractionCode(el);
				let code: string | null = null;
				if (codeEl?.textContent) {
					const match = codeEl.textContent.match(/提取码[:：]\s*([a-zA-Z0-9]{4})/);
					code = match?.[1] || null;
				}
				if (code) {
					url = url.includes('?') ? `${url}&pwd=${code}` : `${url}?pwd=${code}`;
				}
			}

			const link = createDirectLink(url, {
				marginTop: '20px',
				display: 'block',
				color: 'palegreen',
			});

			insertAfter(link, el);
		});
	});
}

/**
 * 从二维码图片邻近的隐藏 input 中提取 URL
 * 文章页结构：wpkqcg_qrcode_wrapper 内含 input[id$="_content"] 直接存储完整链接
 */
function extractUrlFromHiddenInput(img: HTMLImageElement): string | null {
	const wrapper = img.closest('.wpkqcg_qrcode_wrapper');
	if (!wrapper) return null;

	const contentInput = wrapper.querySelector('input[id$="_content"]') as HTMLInputElement | null;
	if (!contentInput?.value) return null;

	// 确保值是有效 URL
	const value = contentInput.value.trim();
	if (value.startsWith('http://') || value.startsWith('https://')) {
		return value;
	}

	return null;
}

/**
 * 查找统一提取码
 */
function findUnifiedWithdrawCode(): string | undefined {
	for (const el of document.querySelectorAll('*')) {
		const textNode = el.childNodes?.[0] as Text;
		if (textNode instanceof Text && /统一提取码：/.test(textNode.textContent)) {
			return extractUnifiedCode(textNode.textContent);
		}
	}
	return undefined;
}

/**
 * 查找提取码元素（向上遍历兄弟节点）
 * 包含超时保护（100ms）防止死循环
 */
function findExtractionCode(qrElement: HTMLElement): Element | null {
	let current = qrElement.parentElement as Element | null;
	const startTime = Date.now();
	const TIMEOUT_MS = 100;
	const MAX_ITERATIONS = 50; // 额外保护：最大迭代次数
	let iterations = 0;

	while (current) {
		// 超时保护
		if (Date.now() - startTime > TIMEOUT_MS) {
			console.warn('[qrcode-converter] 查找提取码超时，终止搜索');
			break;
		}

		// 迭代次数保护
		if (++iterations > MAX_ITERATIONS) {
			console.warn('[qrcode-converter] 查找提取码迭代次数超限，终止搜索');
			break;
		}

		const nextSibling = current.nextElementSibling as HTMLElement;
		if (nextSibling?.innerText?.includes('提取码')) {
			return nextSibling;
		}

		current = current.parentElement;
	}

	return null;
}

/**
 * 创建直链 <a> 元素
 * @param url 最终 URL
 * @param extraStyle 额外样式
 */
function createDirectLink(url: string, extraStyle: Partial<CSSStyleDeclaration> = {}): HTMLAnchorElement {
	const link = document.createElement('a');
	link.href = url;
	link.textContent = `${getProviderName(url)}：已为您转换为免扫码直链: ${url}`;
	link.setAttribute('target', '_blank');

	if (Object.keys(extraStyle).length > 0) {
		Object.assign(link.style, extraStyle);
	}

	return link;
}
