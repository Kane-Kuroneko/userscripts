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
