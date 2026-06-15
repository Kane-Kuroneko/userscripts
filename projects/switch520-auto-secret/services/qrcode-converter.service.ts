/**
 * 二维码转链接服务
 * 将页面中二维码 canvas/image 解析为直链，免去扫码步骤
 *
 * 兼容新旧两种 gamer520 下载页 DOM 结构：
 *   新版 .bdp-container 卡片式布局（百度/夸克/迅雷）
 *   旧版 wpkqcg_qrcode 格式
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { decodeQrFromCanvas, decodeQRFromImageElement } from '../QrcodeToLink';
import { extractUnifiedCode } from '../core/password-extractor';
import { getProviderName } from '../utils/url-helper';
import { insertAfter } from '../utils/dom-helper';

/**
 * 从 URL 中提取 pwd 参数值
 * 回退方案，用于 DOM 中无提取码元素（如迅雷云盘的隐藏提取码）时附加 pwd 到 URL
 */
function extractPwdFromUrl(url: string): string | null {
	try {
		const pwd = new URL(url).searchParams.get('pwd');
		return pwd || null;
	} catch {
		return url.match(/[?&]pwd=([^&#]+)/)?.[1] || null;
	}
}

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
 * 兼容新旧两种格式：
 *   新版 .bdp-container 卡片式布局（百度/夸克/迅雷）
 *   旧版 img.wpkqcg_qrcode 格式
 */
function initGamer520QrcodeConverter(): void {
	useMatchDomain({
		includes: ['gamer520.com', 'gamers520.com']
	}, () => {
		// 新版 .bdp-container 卡片式布局
		convertBdpCardsToLinks();
		// 旧版 wpkqcg_qrcode 格式（兼容留存文章页）
		convertWpkqcgQrcodesToLinks();
	});
}

/**
 * 处理新版 .bdp-container 卡片式下载布局
 * 百度/夸克：从 api.qrserver.com 的 data 参数提取直链 URL
 * 迅雷：直接使用 .bdp-btn 的 href
 * 直链插入到原提取码框 ( .bdp-pwd-box ) 下方，保留原 DOM 不动
 */
function convertBdpCardsToLinks(): void {
	const cards = document.querySelectorAll('.bdp-container .bdp-grid .bdp-card');
	if (!cards.length) return;

	cards.forEach((card) => {
		let url: string | null = null;
		let code: string | null = null;

		// 提取提取码
		const pwdBox = card.querySelector('.bdp-pwd-box');
		if (pwdBox) {
			const strong = pwdBox.querySelector('strong');
			if (strong?.textContent) {
				code = strong.textContent.trim();
			}
		}

		// 方式1：从 api.qrserver.com 二维码图片 src 的 data 参数提取 URL
		const qrImg = card.querySelector('.bdp-qrcode-box img') as HTMLImageElement | null;
		if (qrImg) {
			url = extractUrlFromQrserverSrc(qrImg.src);
		}

		// 方式2：从直链按钮提取 URL（迅雷等）
		if (!url) {
			const directBtn = card.querySelector('.bdp-btn[href]') as HTMLAnchorElement | null;
			if (directBtn) {
				url = directBtn.href;
			}
		}

		if (!url) return;

		// 提取码回退：若 DOM 中未找到，尝试从 URL 参数中提取（迅雷场景）
		if (!code) {
			code = extractPwdFromUrl(url);
		}

		// 附加提取码（仅当 URL 中不含 pwd= 时——百度链接通常已内含）
		if (code && !url.includes('pwd=')) {
			url = url.includes('?') ? `${url}&pwd=${code}` : `${url}?pwd=${code}`;
		}

		const link = createDirectLink(url, {
			marginTop: '12px',
			display: 'block',
			color: 'palegreen',
			width: '100%',
			textAlign: 'center',
			wordBreak: 'break-all',
		});

		// 插入到提取码框下方，保留原提取码 DOM 供扫码者查阅
		const insertTarget = card.querySelector('.bdp-pwd-box') || card.querySelector('.bdp-qrcode-box') || card.querySelector('.bdp-btn');
		if (insertTarget) {
			insertAfter(link, insertTarget as HTMLElement);
		}
	});
}

/**
 * 从 api.qrserver.com 图片 URL 中提取目标链接
 * 示例 src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fpan.baidu.com%2Fs%2F..."
 * 解析 data 参数即可获得真实下载 URL，无需实际解码 QR 码
 */
function extractUrlFromQrserverSrc(src: string): string | null {
	if (!src || !src.includes('qrserver')) return null;
	try {
		const urlObj = new URL(src);
		const data = urlObj.searchParams.get('data');
		if (data && (data.startsWith('http://') || data.startsWith('https://'))) {
			return data;
		}
	} catch {
		// URL 构造失败时的降级正则提取
		const match = src.match(/[?&]data=([^&]+)/);
		if (match) {
			const decoded = decodeURIComponent(match[1]);
			if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
				return decoded;
			}
		}
	}
	return null;
}

/**
 * 旧版 wpkqcg_qrcode 处理（兼容留存文章页）
 * 从二维码图片邻近的隐藏 input 中提取 URL
 */
function convertWpkqcgQrcodesToLinks(): void {
	const qrcodeImages = Array.from(document.querySelectorAll('img.wpkqcg_qrcode')) as HTMLImageElement[];

	qrcodeImages.forEach((el) => {
		// 优先从隐藏 input 提取 URL（文章页内嵌完整链接，更可靠）
		let url = extractUrlFromHiddenInput(el) || decodeQRFromImageElement(el);

		if (!url) return;

		// 尝试提取提取码并附加（仅当 URL 不含 pwd 时）
		let code: string | null = null;
		if (!url.includes('pwd=')) {
			const codeEl = findExtractionCode(el);
			if (codeEl?.textContent) {
				const match = codeEl.textContent.match(/提取码[:：]\s*([a-zA-Z0-9]{4})/);
				code = match?.[1] || null;
			}
			if (code) {
				url = url.includes('?') ? `${url}&pwd=${code}` : `${url}?pwd=${code}`;
			}
		} else {
			code = extractPwdFromUrl(url);
		}

		const link = createDirectLink(url, {
			marginTop: '20px',
			display: 'block',
			color: 'palegreen',
		});

		insertAfter(link, el);
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
 * 创建直链 &lt;a&gt; 元素
 * @param url  最终 URL
 * @param extraStyle 额外样式
 */
function createDirectLink(url: string, extraStyle: Partial<CSSStyleDeclaration> = {}): HTMLAnchorElement {
	const link = document.createElement('a');
	link.href = url;
	link.textContent = `${getProviderName(url)}：已为您转换为免扫码直链: ${url}`;
	link.setAttribute('target', '_blank');
	link.title = url;

	if (Object.keys(extraStyle).length > 0) {
		Object.assign(link.style, extraStyle);
	}

	return link;
}
