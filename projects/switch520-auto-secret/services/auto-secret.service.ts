/**
 * 自动输入密码服务
 * 在访问密码保护的页面时，自动提取密码并提交表单
 *
 * 防死循环保护（仅在 iframe 内启用）：
 * - 10s 滑动窗口记录各域名访问次数，>= 3 次触发
 * - 触发后将域名加入 GM_storage 持久化黑名单
 * - 黑名单命中时不自动提交，通过 postMessage + window.open 打开新标签页
 * - 顶层上下文（独立标签页）不受影响，始终正常提交
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { extractPasswordFromTitle, extractPasswordFromSpan } from '../core/password-extractor';
import { querySelector } from '../utils/dom-helper';

// ============== GM Storage 键名定义 ==============

/** GM 存储键：各域名访问时间戳映射 */
export const VISIT_TS_KEY = 'g520_visit_ts';

/** GM 存储键：持久化黑名单域名列表（auto-secret 自身跳过用） */
export const BLACKLIST_KEY = 'g520_blacklist';

/** GM 存储键：已知死循环的 post_id 列表（download-bypass 预检查用） */
export const BAD_POST_IDS_KEY = 'g520_bad_post_ids';

/** GM 存储键：当前待确认的 post_id（download-bypass 写入，auto-secret 读取） */
export const PENDING_SRC_KEY = 'g520_pending_src';

/** postMessage 来源标识 */
export const MSG_SOURCE = 'S520_LOOP_GUARD';

/** 10s 滑动窗口 */
export const LOOP_WINDOW_MS = 10_000;

/** 窗口内触发阈值 */
export const LOOP_THRESHOLD = 3;

/**
 * 初始化自动密码服务
 */
export function initAutoSecret(): void {
	initGamer520AutoSecret();
	initAcgxAutSecret();
}

/**
 * gamer520/gamers520 站点自动密码
 * 从标题 "密码保护：XXX" 中提取密码并自动提交
 * 防死循环保护仅在 iframe 内启用
 */
function initGamer520AutoSecret(): void {
	useMatchDomain({
		includes: ['gamer520.com', 'gamers520.com'],
	}, async () => {
		const el_input = findPasswordInput();
		const el_submit = findSubmitButton();

		if (!el_input || !el_submit) return;

		let secret: string | null = null;
		// 优化：优先检查常见的标题元素，避免遍历所有节点
		const titleSelectors = ['h1', 'h2', 'h3', '.entry-title', '.post-title', 'title'];
		for (const selector of titleSelectors) {
			const elements = document.querySelectorAll(selector);
			for (const el of elements) {
				const extracted = extractPasswordFromTitle(el.innerText);
				if (extracted) {
					secret = extracted;
					break;
				}
			}
			if (secret) break;
		}

		// 如果标题中未找到，再遍历所有元素（降级方案）
		if (!secret) {
			document.querySelectorAll('*').forEach((node: HTMLElement) => {
				if (!secret) {
					secret = extractPasswordFromTitle(node.innerText);
				}
			});
		}

		if (!secret) return;

		// 防死循环：仅在 iframe 内启用
		if (window.parent !== window.self) {
			const domain = location.hostname;

			// 检查当前域名是否已被持久化黑名单
			if (await isDomainBlacklisted(domain)) {
				console.log(`[auto-secret] ${domain} 已在黑名单，改用新标签页打开`);
				const url = new URL(location.href);
				url.searchParams.set('pwd', secret);
				notifyTopOpenTab(url.toString());
				return;
			}

			// 10s 滑动窗口记录访问
			const visitCount = await recordAndCountVisits();

			if (visitCount >= LOOP_THRESHOLD) {
				console.log(`[auto-secret] ${domain} 10s内访问${visitCount}次，触发死循环保护`);
				await blacklistDomain(domain);

				// 通过 GM_storage 接力：读取 download-bypass 写入的 post_id，加入精细化黑名单
				const pendingSrcId = await GM.getValue(PENDING_SRC_KEY, null);
				if (pendingSrcId) {
					await markBadPostId(pendingSrcId as string);
					await GM.setValue(PENDING_SRC_KEY, null);
					console.log(`[auto-secret] post_id=${pendingSrcId} 已加入精细化黑名单`);
				}

				const url = new URL(location.href);
				url.searchParams.set('pwd', secret);
				notifyTopOpenTab(url.toString());
				return;
			}
		}

		// 正常自动提交
		el_input.value = secret;
		el_submit.click();
	});
}

/**
 * acgxj.com 站点自动密码
 * 从 span "访问密码：XXXXXX" 中提取密码并自动提交
 */
function initAcgxAutSecret(): void {
	useMatchDomain({
		includes: ['acgxj.com']
	}, () => {
		document.querySelectorAll('span').forEach((el) => {
			const pwd = extractPasswordFromSpan(el.innerText);
			if (!pwd) return;

			const input_pwd = querySelector<HTMLInputElement>('input[type=password][name=e_secret_key]');
			if (!input_pwd) return;

			input_pwd.value = pwd;
			const input_confirm = querySelector<HTMLInputElement>('input[type=submit][value=确定]');
			input_confirm?.click();
		});
	});
}

/**
 * 查找密码输入框（兼容多种选择器）
 */
function findPasswordInput(): HTMLInputElement | null {
	return querySelector<HTMLInputElement>('input#password') ||
		querySelector<HTMLInputElement>('input[type="password"]') ||
		querySelector<HTMLInputElement>('input[name="post_password"]');
}

/**
 * 查找提交按钮（兼容多种选择器）
 */
function findSubmitButton(): HTMLInputElement | null {
	return querySelector<HTMLInputElement>('input[type="submit"]') ||
		querySelector<HTMLInputElement>('input[name="Submit"]') ||
		querySelector<HTMLInputElement>('input[value="提交"]');
}

// ============== 防死循环保护 ==============

/**
 * 记录当前域名访问，返回 10s 窗口内的访问次数
 */
async function recordAndCountVisits(): Promise<number> {
	const now = Date.now();
	const raw = await GM.getValue(VISIT_TS_KEY, '{}');
	const map: Record<string, number[]> = JSON.parse(raw as string);
	const domain = location.hostname;

	const timestamps = (map[domain] || []).filter(ts => now - ts < LOOP_WINDOW_MS);
	timestamps.push(now);
	map[domain] = timestamps;

	await GM.setValue(VISIT_TS_KEY, JSON.stringify(map));
	return timestamps.length;
}

/**
 * 检查域名是否在持久化黑名单中
 */
async function isDomainBlacklisted(domain: string): Promise<boolean> {
	const raw = await GM.getValue(BLACKLIST_KEY, '[]');
	const list: string[] = JSON.parse(raw as string);
	return list.includes(domain);
}

/**
 * 将域名加入持久化黑名单
 */
async function blacklistDomain(domain: string): Promise<void> {
	const raw = await GM.getValue(BLACKLIST_KEY, '[]');
	const list: string[] = JSON.parse(raw as string);
	if (!list.includes(domain)) {
		list.push(domain);
		await GM.setValue(BLACKLIST_KEY, JSON.stringify(list));
		console.log(`[auto-secret] ${domain} 已加入域名黑名单`);
	}
}

/**
 * 将 post_id 加入精细化黑名单（download-bypass 预检查用）
 */
async function markBadPostId(postId: string): Promise<void> {
	const raw = await GM.getValue(BAD_POST_IDS_KEY, '[]');
	const list: string[] = JSON.parse(raw as string);
	if (!list.includes(postId)) {
		list.push(postId);
		await GM.setValue(BAD_POST_IDS_KEY, JSON.stringify(list));
	}
}

/**
 * 通过 postMessage + 直接调用打开新标签页（双保险）
 */
function notifyTopOpenTab(url: string): void {
	if (window.parent !== window.self) {
		window.parent.postMessage({
			source: MSG_SOURCE,
			type: 'OPEN_TAB',
			url
		}, '*');
	}
	window.open(url, '_blank');
}


