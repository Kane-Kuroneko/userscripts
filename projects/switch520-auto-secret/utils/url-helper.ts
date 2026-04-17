/**
 * URL 处理工具函数
 * 提供网盘链接和密码参数的处理逻辑
 */

/**
 * 为 URL 添加 pwd 参数
 * 自动判断 URL 是否已有查询参数，选择 ? 或 & 连接符
 * @param url 原始 URL
 * @param pwd 密码值
 * @returns 添加了 pwd 参数的 URL
 */
export function appendPwdToUrl(url: string, pwd: string): string {
	if (!pwd) return url;
	if (url.includes('pwd=')) return url;

	const separator = url.includes('?') ? '&' : '?';
	return `${url}${separator}pwd=${pwd}`;
}

/**
 * 判断是否为百度网盘链接
 * @param url 待检测的 URL
 * @returns 是否为百度网盘链接
 */
export function isBaiduPanUrl(url: string): boolean {
	return typeof url === 'string' && url.includes('pan.baidu.com');
}

/**
 * 判断是否为阿里云盘链接
 * @param url 待检测的 URL
 * @returns 是否为阿里云盘链接
 */
export function isAliyunPanUrl(url: string): boolean {
	return typeof url === 'string' && url.includes('aliyundrive.com');
}

/**
 * 判断是否为夸克网盘链接
 * @param url 待检测的 URL
 * @returns 是否为夸克网盘链接
 */
export function isQuarkPanUrl(url: string): boolean {
	return typeof url === 'string' && url.includes('quark.cn');
}

/**
 * 根据 URL 获取网盘提供商名称
 * @param url 网盘链接
 * @returns 提供商名称（百度网盘/阿里云盘/夸克网盘）或空字符串
 */
export function getProviderName(url: string): string {
	if (!url || typeof url !== 'string') return '';
	
	if (isBaiduPanUrl(url)) return '百度网盘';
	if (isAliyunPanUrl(url)) return '阿里云盘';
	if (isQuarkPanUrl(url)) return '夸克网盘';
	
	return '';
}

/**
 * 从文本中提取百度网盘链接
 * @param text 包含链接的文本
 * @returns 提取的链接或 null
 */
export function extractBaiduLinkFromText(text: string): string | null {
	const reg = /https:\/\/pan\.baidu\.com[.a-zA-Z0-9-\/_?=/]+/u;
	const match = text.match(reg);
	return match?.[0] || null;
}
