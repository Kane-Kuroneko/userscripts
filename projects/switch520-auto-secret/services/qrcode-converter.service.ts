/**
 * 二维码转链接服务
 * 将页面中二维码 canvas/image 解析为直链，免去扫码步骤
 *
 * 兼容新旧两种 gamer520 下载页 DOM 结构：
 *   新版 .bdp-container 卡片式布局（百度/夸克/迅雷）
 *   旧版 wpkqcg_qrcode 格式
 *
 * fzgamer.com：资源下载按钮弹出 #fzg-qr-mask 扫码弹窗，
 * 直链以 base64 存于 window.__fzg_d / fzgOpenQr 参数中
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { decodeQrFromCanvas, decodeQRFromImageElement } from '../QrcodeToLink';
import { extractUnifiedCode } from '../core/password-extractor';
import { getProviderName } from '../utils/url-helper';
import { insertAfter } from '../utils/dom-helper';
import { GAMER520_INCLUDES } from '../core/domain-matcher';

const FZG_DIRECT_LINK_ID = 's520-fzg-direct-link';
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
	initFzgamerQrcodeConverter();
}

/**
 * acgxj/acfb/xj.steamzg 站点处理
 * 兼容新旧两种 DOM 结构：
 *   新版 button.su-download-btn[data-qr-url]（base64 直链）
 *   旧版 canvas.su-qr-canvas（QR 解码）
 */
function initAcgQrcodeConverter(): void {
	useMatchDomain({
		includes: ['acgxj.com', 'acfb.top', 'xj.steamzg.com']
	}, () => {
		// 旧版 canvas.su-qr-canvas 逻辑（向后兼容）
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

		// 新版 su-download 结构（button[data-qr-url] + base64）
		convertSuDownloadToLinks();
	});
}

/**
 * 处理 acgxj/acfb/xj.steamzg 新版 DOM 结构
 * 站长改为 hover .su-download-item 才展示子元素，
 * 直链 URL 以 base64 编码存储在 button.su-download-btn 的 data-qr-url 属性中
 */
function convertSuDownloadToLinks(): void {
	const btns = document.querySelectorAll('button.su-download-btn[data-qr-url]');
	if (!btns.length) return;

	const unifiedCode = findUnifiedWithdrawCode();
	console.log('[qrcode-converter] 检测到 su-download-btn %d 个', btns.length);

	btns.forEach((btn) => {
		try {
			const rawBase64 = btn.getAttribute('data-qr-url');
			if (!rawBase64) {
				console.warn('[qrcode-converter] su-download-btn 缺少 data-qr-url，跳过');
				return;
			}

			let decodedUrl: string;
			try {
				decodedUrl = atob(rawBase64);
			} catch (decodeErr) {
				console.warn('[qrcode-converter] atob 解码失败:', rawBase64.substring(0, 30) + '...', decodeErr);
				return;
			}

			if (!decodedUrl || (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://'))) {
				console.warn('[qrcode-converter] 解码结果非有效 URL:', decodedUrl);
				return;
			}

			// 提取独立提取码
			let code = btn.getAttribute('data-code')?.trim() || '';

			// 回退到统一提取码
			if (!code && unifiedCode) {
				code = unifiedCode;
			}

			// 拼接 pwd 参数（URL 中已含 pwd= 则跳过）
			if (code && !decodedUrl.includes('pwd=')) {
				decodedUrl = decodedUrl.includes('?')
					? `${decodedUrl}&pwd=${code}`
					: `${decodedUrl}?pwd=${code}`;
			}

			const provider = getProviderName(decodedUrl) || '网盘';
			console.log('[qrcode-converter] 处理下载项: %s, code=%s', provider, code || '(无)');

			const suDownloadItem = btn.closest('.su-download-item');
			if (!suDownloadItem) {
				console.warn('[qrcode-converter] 找不到父级 .su-download-item，跳过');
				return;
			}

			const link = createDirectLink(decodedUrl);
			insertAfter(link, suDownloadItem);
		} catch (err) {
			console.warn('[qrcode-converter] su-download 处理失败:', err);
		}
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
		includes: [...GAMER520_INCLUDES]
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
 * fzgamer.com：资源下载区点击后弹出 #fzg-qr-mask 扫码弹窗
 * 优先 hook window.fzgOpenQr 拿到 base64 直链；失败时再解码弹窗内 QR
 *
 * 注意：
 * - 不可在匹配失败时回退 __fzg_d[0]，否则非百度项也会被错指到百度
 * - qrcodejs 会把 URL 写到 #fzg-qr-canvas[title]，切换网盘时旧 title 会短暂残留
 */
function initFzgamerQrcodeConverter(): void {
	useMatchDomain({
		includes: ['fzgamer.com']
	}, () => {
		hookFzgOpenQr();
		observeFzgQrMask();
	});
}

type FzgOpenQrFn = (
	encodedUrl: string,
	title?: string,
	hint?: string,
	scanTip?: string,
	panType?: string
) => void;

/** 弹窗标题 / panType → __fzg_d.type 别名（兼容中英文 UI） */
const FZG_PAN_TYPE_ALIASES: Record<string, string[]> = {
	baidu: ['baidu', '百度'],
	quark: ['quark', '夸克'],
	xunlei: ['xunlei', 'thunder', '迅雷'],
	alipan: ['alipan', 'aliyun', '阿里'],
	lanzou: ['lanzou', '蓝奏'],
	weiyun: ['weiyun', '微云'],
	'123pan': ['123pan', '123'],
	onedrive: ['onedrive'],
	buy: ['buy', 'steam', 'genuine', '正版', '购买', 'purchase'],
};

/** hook 最近一次解析出的直链，供 observer 兜底时优先使用，避免读到残留 title */
let lastFzgOpenedUrl: string | null = null;

/**
 * Hook 站点的 fzgOpenQr：参数即为 base64 编码的真实下载链接
 */
function hookFzgOpenQr(): void {
	const tryHook = (): boolean => {
		const win = window as Window & {
			fzgOpenQr?: FzgOpenQrFn & { __s520Hooked?: boolean };
		};
		if (typeof win.fzgOpenQr !== 'function') return false;
		if (win.fzgOpenQr.__s520Hooked) return true;

		const original = win.fzgOpenQr;
		const hooked: FzgOpenQrFn & { __s520Hooked?: boolean } = function (
			encodedUrl: string,
			title?: string,
			hint?: string,
			scanTip?: string,
			panType?: string
		) {
			// 清除上一份二维码残留的 title，避免兜底解析读到旧链接
			document.getElementById('fzg-qr-canvas')?.removeAttribute('title');
			lastFzgOpenedUrl = decodeFzgBase64Url(encodedUrl);

			original.call(this, encodedUrl, title, hint, scanTip, panType);

			if (lastFzgOpenedUrl) {
				const url = lastFzgOpenedUrl;
				// 站点异步生成二维码，稍后再注入，避免被 innerHTML 清空
				setTimeout(() => enhanceFzgQrModal(url), 80);
			}
		};
		hooked.__s520Hooked = true;
		win.fzgOpenQr = hooked;

		if (process.env.NODE_ENV === 'development') {
			console.log('[qrcode-converter] 已 hook fzgOpenQr');
		}
		return true;
	};

	if (tryHook()) return;

	const timer = window.setInterval(() => {
		if (tryHook()) window.clearInterval(timer);
	}, 200);
	window.setTimeout(() => window.clearInterval(timer), 15000);
}

/**
 * 监听 #fzg-qr-mask.show，作为 hook 未就绪或遗漏时的兜底
 */
function observeFzgQrMask(): void {
	const handleMaskShown = () => {
		const mask = document.getElementById('fzg-qr-mask');
		if (!mask?.classList.contains('show')) return;

		// 已有直链且与最近一次打开一致则跳过；否则允许覆盖错误链接
		const existingLink = document.getElementById(FZG_DIRECT_LINK_ID) as HTMLAnchorElement | null;
		if (existingLink && lastFzgOpenedUrl && existingLink.href === lastFzgOpenedUrl) {
			return;
		}

		window.setTimeout(() => {
			const url = lastFzgOpenedUrl || resolveFzgQrUrlFromDom();
			if (url) enhanceFzgQrModal(url);
		}, 150);
	};

	const existing = document.getElementById('fzg-qr-mask');
	if (existing) {
		if (existing.classList.contains('show')) handleMaskShown();
		new MutationObserver(handleMaskShown).observe(existing, {
			attributes: true,
			attributeFilter: ['class'],
		});
		return;
	}

	const bodyObserver = new MutationObserver((_mutations, obs) => {
		const mask = document.getElementById('fzg-qr-mask');
		if (!mask) return;
		obs.disconnect();
		if (mask.classList.contains('show')) handleMaskShown();
		new MutationObserver(handleMaskShown).observe(mask, {
			attributes: true,
			attributeFilter: ['class'],
		});
	});
	bodyObserver.observe(document.body, { childList: true, subtree: true });
}

/**
 * 向弹窗插入免扫码直链（二维码缩小由 style.less 负责）
 */
function enhanceFzgQrModal(url: string): void {
	const body = document.querySelector('.fzg-qr-body') as HTMLElement | null;
	const wrap = document.querySelector('.fzg-qr-wrap') as HTMLElement | null;
	if (!body || !wrap) return;

	document.getElementById(FZG_DIRECT_LINK_ID)?.remove();

	const link = createDirectLink(url, {
		// 主样式在 #s520-fzg-direct-link，这里仅兜底
		display: 'block',
	});
	link.id = FZG_DIRECT_LINK_ID;

	insertAfter(link, wrap);

	if (process.env.NODE_ENV === 'development') {
		console.log('[qrcode-converter] fzgamer 直链已注入:', url);
	}
}

/**
 * 从弹窗 DOM 解析直链（hook 失败时的兜底）
 * 优先级：解码 canvas/img → 按标题/type 匹配 __fzg_d（绝不回退到 [0]）
 */
function resolveFzgQrUrlFromDom(): string | null {
	const canvasBox = document.getElementById('fzg-qr-canvas');
	if (!canvasBox) return null;

	// 1) 优先解码当前二维码（比 title 属性可靠，title 会残留上一次的 URL）
	const canvas = canvasBox.querySelector('canvas') as HTMLCanvasElement | null;
	if (canvas && canvas.width > 0 && canvas.height > 0) {
		try {
			const fromCanvas = decodeQrFromCanvas(canvas);
			if (fromCanvas && /^https?:\/\//.test(fromCanvas)) return fromCanvas;
		} catch {
			// canvas 可能尚未绘制完成
		}
	}
	const img = canvasBox.querySelector('img') as HTMLImageElement | null;
	if (img) {
		const fromQrserver = extractUrlFromQrserverSrc(img.src);
		if (fromQrserver) return fromQrserver;
		if (img.complete && img.naturalWidth > 0) {
			try {
				const fromImg = decodeQRFromImageElement(img);
				if (fromImg && /^https?:\/\//.test(fromImg)) return fromImg;
			} catch {
				// ignore
			}
		}
	}

	// 2) title 仅在与当前标题网盘类型一致时采用，避免残留旧链接
	const titleUrl = canvasBox.getAttribute('title')?.trim();
	if (titleUrl && /^https?:\/\//.test(titleUrl) && isFzgTitleConsistentWithUrl(titleUrl)) {
		return titleUrl;
	}

	// 3) 对照 window.__fzg_d（按 type / 中英文名匹配，失败则返回 null）
	return resolveFzgUrlFromGlobalData();
}

/**
 * title 属性里的 URL 是否与当前弹窗标题的网盘类型一致
 */
function isFzgTitleConsistentWithUrl(url: string): boolean {
	const titleText = document.getElementById('fzg-qr-title-text')?.textContent?.trim() || '';
	const type = inferFzgPanTypeFromText(titleText);
	if (!type) return false;
	return fzgUrlMatchesType(url, type);
}

/**
 * 从 window.__fzg_d 按当前弹窗标题 / panType 匹配直链
 * 匹配失败返回 null，禁止回退到 list[0]
 */
function resolveFzgUrlFromGlobalData(): string | null {
	const win = window as Window & {
		__fzg_d?: Array<{ d?: string; name?: string; type?: string }>;
	};
	const list = win.__fzg_d;
	if (!Array.isArray(list) || !list.length) return null;

	const titleText = document.getElementById('fzg-qr-title-text')?.textContent?.trim() || '';
	const inferredType = inferFzgPanTypeFromText(titleText);

	const matched = list.find((item) => {
		if (inferredType && item.type === inferredType) return true;
		if (item.name && titleText.includes(item.name)) return true;
		if (item.type) {
			const aliases = FZG_PAN_TYPE_ALIASES[item.type] || [];
			const lowerTitle = titleText.toLowerCase();
			return aliases.some((alias) => lowerTitle.includes(alias.toLowerCase()));
		}
		return false;
	});

	return matched?.d ? decodeFzgBase64Url(matched.d) : null;
}

/**
 * 从弹窗标题推断网盘 type（兼容中英文翻译）
 */
function inferFzgPanTypeFromText(text: string): string | null {
	if (!text) return null;
	const lower = text.toLowerCase();
	for (const [type, aliases] of Object.entries(FZG_PAN_TYPE_ALIASES)) {
		if (aliases.some((alias) => lower.includes(alias.toLowerCase()))) {
			return type;
		}
	}
	return null;
}

/**
 * URL 是否属于指定网盘 type
 */
function fzgUrlMatchesType(url: string, type: string): boolean {
	const host = (() => {
		try {
			return new URL(url).hostname.toLowerCase();
		} catch {
			return url.toLowerCase();
		}
	})();

	switch (type) {
		case 'baidu':
			return host.includes('baidu.com');
		case 'quark':
			return host.includes('quark.cn');
		case 'xunlei':
			return host.includes('xunlei.com');
		case 'alipan':
			return host.includes('alipan.com') || host.includes('aliyundrive.com');
		case 'buy':
			return host.includes('steampowered.com') || host.includes('epicgames.com') || host.includes('gog.com');
		default:
			return true;
	}
}

/**
 * 解码 fzgamer 的 base64 下载链接
 */
function decodeFzgBase64Url(encoded: string): string | null {
	if (!encoded) return null;
	try {
		const decoded = atob(encoded).trim();
		if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
			return decoded;
		}
	} catch (err) {
		console.warn('[qrcode-converter] fzgamer base64 解码失败:', err);
	}
	return null;
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
