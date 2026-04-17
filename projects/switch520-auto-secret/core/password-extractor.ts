/**
 * 密码提取核心逻辑
 * 从页面文本中提取受保护内容的访问密码，纯函数无副作用
 */

/**
 * 从标题文本中提取密码保护内容的密码
 * 匹配格式: "密码保护：123456"
 * @param text 元素文本内容
 * @returns 提取的密码或 null
 */
export function extractPasswordFromTitle(text: string): string | null {
	if (!text?.startsWith('密码保护：')) return null;
	
	// 排除非密码保护的干扰文本
	if (text.includes('上一篇') || text.includes('牛夫人')) return null;
	if (text.includes('当前位置') || text.includes('此内容受密码保护')) return null;
	if (text.includes('永久防迷路')) return null;

	return text.replace('密码保护：', '');
}

/**
 * 从 span 元素中提取访问密码
 * 匹配格式: "访问密码：123456"（6位数字结尾）
 * @param text 元素文本内容
 * @returns 提取的密码或 null
 */
export function extractPasswordFromSpan(text: string): string | null {
	if (!text.startsWith('访问密码：')) return null;
	if (!/\d{6}$/.test(text)) return null;

	return text.replace('访问密码：', '');
}

/**
 * 从提取码文本中提取4位密码
 * 匹配格式: "提取码：abcd" 或 "提取码: abcd"
 * @param text 包含提取码的文本
 * @returns 4位提取码
 */
export function extractBaiduPwd(text: string): string | null {
	const reg = /(提取码|如遇到有带x的提取码请手打输入)[:：]\s*(?<code>[a-zA-Z0-9]{4})/;
	const match = text.match(reg);
	return match?.groups?.code || null;
}

/**
 * 统一提取码提取（用于多网盘场景）
 * 匹配格式: "统一提取码：1234"
 * @param text 文本内容
 * @returns 提取码或 undefined
 */
export function extractUnifiedCode(text: string): string | undefined {
	const reg = /统一提取码：(?<code>\d{4,})/;
	const match = reg.exec(text);
	return match?.groups?.code;
}
