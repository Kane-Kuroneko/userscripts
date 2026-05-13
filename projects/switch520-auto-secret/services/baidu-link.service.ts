/**
 * 百度网盘链接处理服务
 * 将百度网盘链接和提取码融合为一个直链按钮，点击后直接跳转并填充密码
 */

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { extractBaiduPwd } from '../core/password-extractor';
import { recursiveFindContainer, findDirectTextNode, safeRemove } from '../utils/dom-helper';
import { appendPwdToUrl, extractBaiduLinkFromText } from '../utils/url-helper';

// 正则表达式：匹配百度网盘链接和提取码文本
const codeReg = /(提取码|如遇到有带x的提取码请手打输入)[:：]\s*(?=\S)[\w\W]+/;
const linkReg = /(百度(网盘)?|链接)[:：]?\s*(?=[^\s:：])[\w\W]+$/;

/**
 * 初始化百度网盘链接服务
 */
export function initBaiduLinkService(): void {
	initGamer520BaiduLink();
	initDlSiteBaiduLink();
	initOtherSitesBaiduLink();
}

/**
 * gamer520/gamers520 站点处理
 */
function initGamer520BaiduLink(): void {
	useMatchDomain({ includes: ['gamer520.com', 'gamers520.com'] }, () => {
		if (!location.href.endsWith('.html')) return;

		const containerEl = recursiveFindContainer(linkReg, document.body, ['友情链接：', '限时特惠']);
		if (!containerEl) return;

		const pwdEl = recursiveFindContainer(codeReg);
		const links = getBaiduLinks(containerEl);
		const pwd = pwdEl ? extractBaiduPwd(pwdEl.innerText) : null;

		links.forEach(link => createDirectLink(link, pwd, containerEl));
		removeLinkElements(containerEl);
		pwdEl && safeRemove(pwdEl);
	});
}

/**
 * dl.xxxxx520.cc 站点处理
 */
function initDlSiteBaiduLink(): void {
	useMatchDomain({ includes: ['dl.xxxxx520.cc'] }, () => {
		const linkEl = recursiveFindContainer(linkReg, document.body, [/下方|下载链接|下载不完整/]);
		if (!linkEl) return;

		const pwdEl = recursiveFindContainer(codeReg, document.body, ['直链+']);
		const links = getBaiduLinks(linkEl);
		const code = pwdEl ? extractBaiduPwd(pwdEl.innerText) : '';

		links.forEach(link => {
			createDirectLink(link, code, linkEl);
			removeLinkElements(linkEl);
			pwdEl && safeRemove(pwdEl);
		});
	});
}

/**
 * 其他站点（xxxxx520.org, acgxj 等）处理
 */
function initOtherSitesBaiduLink(): void {
	useMatchDomain({ includes: ['xxxxx520.org', 'acgxj'] }, () => {
		const linkEl = recursiveFindContainer(
			linkReg,
			document.body,
			[/下方|下载链接|下载不完整/, '直链+'],
			(el) => [
				Array.from(el.querySelectorAll('a')).find(element => element.href.includes('pan.baidu.com')),
				Array.from(el.querySelectorAll('*')).find((element: HTMLElement) => /https:\/\/pan\.baidu\.com/.test(element.innerText || ''))
			].some(Boolean)
		);

		if (!linkEl) return;

		const pwdEl = recursiveFindContainer(codeReg);
		const links = getBaiduLinks(linkEl);
		const code = pwdEl ? extractBaiduPwd(pwdEl.innerText) : '';

		links.forEach(link => {
			createDirectLink(link, code, linkEl);
			removeLinkElements(linkEl);
			pwdEl && safeRemove(pwdEl);
		});
	});
}

/**
 * 从容器中提取所有百度网盘链接
 */
function getBaiduLinks(container: HTMLElement): string[] {
	const baiduLinks: string[] = [];
	
	for (const el of Array.from([...container.querySelectorAll('*'), container])) {
		if (!(el instanceof HTMLElement)) continue;

		if (el instanceof HTMLAnchorElement) {
			if (el.href.includes('pan.baidu.com') && !baiduLinks.includes(el.href)) {
				baiduLinks.push(el.href);
				continue;
			}
		}

		if (el.innerText.includes('pan.baidu.com')) {
			const match: string | null = el.innerText.match(/https:\/\/pan\.baidu\.com[.a-zA-Z0-9-\/_?=/]+/u)?.[0];
			if (match && !baiduLinks.includes(match)) {
				baiduLinks.push(match);
			}
		}
	}

	return baiduLinks;
}

/**
 * 创建直链按钮
 */
function createDirectLink(link: string, pwd: string | null, containerEl: HTMLElement): void {
	const baiduLinkEl = document.createElement('span');
	const _link = appendPwdToUrl(link, pwd || '');
	
	baiduLinkEl.innerHTML = `<a href="${_link}" target="_blank" style="text-decoration: underline">百度网盘:${_link}</a><br>`;
	baiduLinkEl.setAttribute('target', '_blank');
	containerEl.parentElement?.insertBefore(baiduLinkEl, containerEl);
}

/**
 * 移除容器中的链接元素
 */
function removeLinkElements(parent: HTMLElement): void {
	const waitForRemove: Array<HTMLElement | Text> = [];
	
	const matcher = (node: Node) => {
		const shouldRemove = node.nodeType === Node.TEXT_NODE
			? [linkReg, /https:\/\/pan\.baidu\.com/].some(reg => reg.test(node.textContent || ''))
			: [linkReg, /https:\/\/pan\.baidu\.com/].some(reg => reg.test((node as HTMLElement).innerText));
		
		if (shouldRemove) {
			waitForRemove.push(node.nodeType === Node.TEXT_NODE ? node.parentElement as HTMLElement : node as HTMLElement);
		}
	};

	parent.childNodes.forEach(matcher);
	matcher(parent);
	waitForRemove.forEach(el => safeRemove(el));
}
