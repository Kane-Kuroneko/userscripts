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
 * gamers520.com 站点处理
 * 将 img.wpkqcg_qrcode 解析为直链
 */
function initGamer520QrcodeConverter(): void {
	useMatchDomain({
		includes: ['gamers520.com']
	}, () => {
		const qrcodeImages = Array.from(document.querySelectorAll('img.wpkqcg_qrcode')) as HTMLImageElement[];

		qrcodeImages.forEach((el) => {
			const codeEl = findExtractionCode(el);
			const code = codeEl?.textContent.replace('提取码: ', '');
			let url = decodeQRFromImageElement(el);

			if (!url) return;

			// 附加提取码（仅当 URL 不含 pwd 且有 code 时）
			if (!url.includes('pwd=') && code) {
				url = url.includes('?') ? `${url}&pwd=${code}` : `${url}?pwd=${code}`;
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
	let current = qrElement.parentElement as Element;
	let timestamp = Date.now();

	while (true) {
		// 超时保护
		if (Date.now() - timestamp > 100) {
			console.error('执行时间过长,可能出现死循环');
			break;
		}

		if ((current?.nextElementSibling as HTMLElement)?.innerText?.includes('提取码')) {
			return current.nextElementSibling;
		}

		if (!current) break;
		current = current?.nextElementSibling;
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
	link.setAttribute('target', 'blank');

	if (Object.keys(extraStyle).length > 0) {
		Object.assign(link.style, extraStyle);
	}

	return link;
}
