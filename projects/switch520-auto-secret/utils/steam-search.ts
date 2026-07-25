/**
 * Steam 商店搜索 / 商品页 URL 工具
 *
 * 参数依据 Steam 商店搜索页与社区实践：
 * - l：商店界面语言（API language code，如 schinese）
 * - term：搜索关键词
 * - ignore_preferences=1：忽略账号内容偏好，避免结果被过滤变少
 * - supportedlang：按「游戏支持语言」筛选，多语言用逗号分隔
 * - ndl=1：商店搜索页常用参数，配合忽略偏好使用
 *
 * @see https://partner.steamgames.com/doc/store/localization/languages
 * @see https://github.com/Revadike/InternalSteamWebAPI/wiki/Get-Search-Results
 */

/** 默认扩大搜索命中的支持语言：简中 / 繁中 / 英 / 日 / 韩 */
export const STEAM_SEARCH_SUPPORTED_LANGS = [
	'schinese',
	'tchinese',
	'english',
	'japanese',
	'koreana',
] as const;

/**
 * 构建 Steam 商店搜索 URL（全站点统一）
 */
export function buildSteamSearchUrl(term: string): string {
	const trimmed = term.trim();
	const params = new URLSearchParams();
	params.set('l', 'schinese');
	params.set('term', trimmed);
	params.set('ignore_preferences', '1');
	params.set('supportedlang', STEAM_SEARCH_SUPPORTED_LANGS.join(','));
	params.set('ndl', '1');

	// 与历史行为一致：空格用 + 而非 %20
	return `https://store.steampowered.com/search/?${params.toString().replace(/%20/g, '+')}`;
}

/**
 * 是否为 Steam 商店链接（app / bundle / search 等）
 */
export function isSteamStoreUrl(url: string): boolean {
	return typeof url === 'string' && /^https?:\/\/store\.steampowered\.com\//i.test(url);
}

/**
 * 规范化 Steam 商品页 URL，缺省时补上简中界面语言
 */
export function normalizeSteamAppUrl(url: string): string {
	try {
		const parsed = new URL(url);
		if (!parsed.searchParams.get('l')) {
			parsed.searchParams.set('l', 'schinese');
		}
		return parsed.toString();
	} catch {
		return url;
	}
}
