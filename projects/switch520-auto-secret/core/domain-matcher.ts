/**
 * 域名匹配核心逻辑
 * 封装 useMatchDomain 的条件判断，提供统一的域名检测接口
 */

export interface DomainMatchOptions {
	includes?: string[];
	hosts?: string[];
	regExp?: RegExp;
}

/**
 * gamer520 / gamers520 必须同时列出：后者多一个 s，
 * `includes('gamer520')` / `includes('gamer520.com')` 都匹配不到 `gamers520.com`
 */
export const GAMER520_INCLUDES = ['gamer520.com', 'gamers520.com'];

/**
 * 是否为 .html 内容页（gamer520 文章页 / gamers520 下载页均为此形态）。
 * 必须用 pathname，否则 `?pwd=` 会让 `href.endsWith('.html')` 误判。
 */
export function isHtmlPostPage(): boolean {
	return location.pathname.endsWith('.html');
}

/**
 * 检查当前页面是否匹配指定的域名规则
 * @param options 域名匹配规则
 * @returns 是否匹配
 */
export function isDomainMatch(options: DomainMatchOptions): boolean {
	const { includes, hosts, regExp } = options;
	const currentHost = location.host;
	const currentHref = location.href;

	if (includes && includes.some(keyword => currentHost.includes(keyword) || currentHref.includes(keyword))) {
		return true;
	}

	if (hosts && hosts.some(host => currentHost === host)) {
		return true;
	}

	if (regExp && regExp.test(currentHref)) {
		return true;
	}

	return false;
}

/**
 * 获取当前站点标识（用于日志和调试）
 */
export function getCurrentSiteIdentifier(): string {
	return location.host;
}
