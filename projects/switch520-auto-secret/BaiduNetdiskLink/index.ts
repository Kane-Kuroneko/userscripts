/**
 * 百度网盘链接处理工具集
 * 提供链接查找、密码提取、DOM操作等底层能力
 * 已被 services/baidu-link.service.ts 调用
 */

/**
 * 正则表达式常量（保持向后兼容）
 * @deprecated 建议使用 core/password-extractor 中的函数
 */
export const codeReg = /(提取码|如遇到有带x的提取码请手打输入)[:：]\s*(?=\S)[\w\W]+/;
export const linkReg = /(百度(网盘)?|链接)[:：]?\s*(?=[^\s:：])[\w\W]+$/;

import { extractBaiduPwd } from '../core/password-extractor';
import { recursiveFindContainer, findDirectTextNode } from '../utils/dom-helper';

export { extractBaiduPwd as getPwd };
export { recursiveFindContainer as recursiveFindDirectContainer };
export { findDirectTextNode as findTextNode };

/**
 * 从容器中移除包含链接的元素
 * @deprecated 建议使用 services/baidu-link.service.ts 中的 removeLinkElements
 */
export const removeLinkFromParent = (parent: HTMLElement) => {
	const waitForRemove: Array<HTMLElement | Text> = [];
	const matcher = node => {
		switch (node.nodeType) {
			case Node.TEXT_NODE:
				if ([linkReg, /https:\/\/pan\.baidu\.com/].some(reg => reg.test(node.textContent))) {
					waitForRemove.push(node.parentElement);
				}
				break;
			case Node.ELEMENT_NODE:
				if ([linkReg, /https:\/\/pan\.baidu\.com/].some(reg => reg.test((node as HTMLElement).innerText))) {
					waitForRemove.push(node);
				}
				break;
		}
	}
	parent.childNodes.forEach(matcher);
	matcher(parent);
	waitForRemove.forEach(el => el.remove());
}

/**
 * 从容器中移除包含提取码的元素
 * @deprecated 建议使用 services/baidu-link.service.ts 中的相关函数
 */
export const removeCodeFromParent = (parent: HTMLElement) => {
	const matcher = node => {
		if (node.nodeType === Node.TEXT_NODE ? codeReg.test(node.textContent) : codeReg.test((node as HTMLElement).innerText)) {
			node.parentElement.removeChild(node);
		}
	};
	parent.childNodes.forEach(matcher);
	matcher(parent);
}

/**
 * 创建直链按钮
 * @deprecated 建议使用 services/baidu-link.service.ts 中的 createDirectLink
 */
export const createLink = (link: string, pwd: string, containerEl: HTMLElement) => {
	const baiduLinkEl = document.createElement('span');
	const query = typeof pwd === 'string' ?
		link.includes('?') ? `&pwd=${pwd}` : `?pwd=${pwd}` :
		'';
	let _link = /pwd=/.test(link) ? link : `${link}${query}`;
	baiduLinkEl.innerHTML = `<a href="${_link}" target="_blank" style="text-decoration: underline">百度网盘:${_link}</a><br>`;
	baiduLinkEl.setAttribute('target', 'blank');
	containerEl.parentElement?.insertBefore(baiduLinkEl, containerEl);
}

/**
 * 从容器中获取所有百度网盘链接
 */
export const getBaiduLink = (container: HTMLElement = document.body) => {
	const baiduLinks: string[] = [];
	traverse: for (const el of Array.from([...container.querySelectorAll('*'), container])) {
		if (el instanceof HTMLElement) {
			if (el instanceof HTMLAnchorElement) {
				if (el.href.includes('pan.baidu.com') && !baiduLinks.includes(el.href)) {
					baiduLinks.push(el.href);
					continue traverse;
				}
			}
			if (el.innerText.includes('pan.baidu.com')) {
				const match: string | null = el.innerText.match(/https:\/\/pan\.baidu\.com[.a-zA-Z0-9-\/_?=/]+/u)?.[0];
				match && !baiduLinks.includes(match) && baiduLinks.push(match);
				continue traverse;
			}
		}
	}

	return baiduLinks;
}

/**
 * @deprecated 未实现
 */
export const getBaiduPwd = (container: HTMLElement = document.body) => {
	// 未实现
}

/**
 * 导出兼容旧版 API 的对象
 * @deprecated 建议直接使用具名导出
 */
export const BaiduNetdiskLink = {
	codeReg,
	linkReg,
	getPwd: extractBaiduPwd,
	recursiveFindDirectContainer: recursiveFindContainer,
	findTextNode: findDirectTextNode,
	createLink,
	removeCodeFromParent,
	removeLinkFromParent,
	getBaiduLink,
};
