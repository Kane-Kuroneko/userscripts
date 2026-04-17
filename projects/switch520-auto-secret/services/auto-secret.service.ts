/**
 * 自动输入密码服务
 * 在访问密码保护的页面时，自动提取密码并提交表单
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { extractPasswordFromTitle, extractPasswordFromSpan } from '../core/password-extractor';
import { querySelector } from '../utils/dom-helper';

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
 */
function initGamer520AutoSecret(): void {
	useMatchDomain({
		includes: ['gamer520.com', 'gamers520.com'],
	}, () => {
		const el_input = findPasswordInput();
		const el_submit = findSubmitButton();

		if (!el_input || !el_submit) return;

		document.querySelectorAll('*').forEach((node: HTMLElement) => {
			const secret = extractPasswordFromTitle(node.innerText);
			if (secret) {
				el_input.value = secret;
				el_submit.click();
			}
		});
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


