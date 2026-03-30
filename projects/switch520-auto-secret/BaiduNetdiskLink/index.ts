const codeReg = /(提取码|如遇到有带x的提取码请手打输入)[:：]\s*(?=\S)[\w\W]+/;
const linkReg = /(百度(网盘)?|链接)[:：]?\s*(?=[^\s:：])[\w\W]+$/;
const removeLinkFromParent = (parent:HTMLElement) => {
	const waitForRemove:Array<HTMLElement|Text> = [];
	const matcher = node => {
		switch( node.nodeType ){
			case Node.TEXT_NODE:
				if([linkReg,/https:\/\/pan\.baidu\.com/].some(reg => reg.test(node.textContent))){
					waitForRemove.push(node.parentElement);
				}
				break;
			case Node.ELEMENT_NODE:
				if([linkReg,/https:\/\/pan\.baidu\.com/].some(reg => reg.test((node as HTMLElement).innerText))){
					waitForRemove.push(node);
				}
				break;
		}
	}
	parent.childNodes.forEach(matcher);
	matcher(parent);
	waitForRemove.forEach(el => el.remove());
}
const removeCodeFromParent = (parent:HTMLElement) => {
	const matcher = node => {
		if (node.nodeType === Node.TEXT_NODE ? codeReg.test(node.textContent) : codeReg.test((node as HTMLElement).innerText)) {
			node.parentElement.removeChild(node);
		}
	};
	parent.childNodes.forEach(matcher);
	matcher(parent);
}
const getPwd = (text:string) => {
	const reg = /(提取码|如遇到有带x的提取码请手打输入)[:：]\s*(?<code>[a-zA-Z0-9]{4})/;
	return text.match(reg).groups.code as string;
}
const getBaiduLink_ = (container:HTMLElement) => {
	const reg = /(?<link>https:\/\/pan.baidu.com[.a-zA-Z0-9-\/_?=/]+)[\s\r\n]*/u;
	// 优先查找a元素
	const aEl = Array.from(container.querySelectorAll('a')).find(el => reg.test(el.href ));
	if (aEl && aEl.href) {
		return aEl.href;
	}
	const linkStr = container.innerText.match(reg)?.groups?.link as string;
	if(linkStr){
		return linkStr;
	}
	debugger;
	throw new Error('没找到百度链接')
}
// 递归查找包含关键字的容器，支持可选 tester
const recursiveFindDirectContainer = (
    keyword: string | RegExp,
    container: HTMLElement = document.body,
    exclude?: (string | RegExp)[],
    tester?: (el: HTMLElement) => boolean
): HTMLElement => {
    let currentContainer = container;
    const excl = (text: string) =>
        exclude && exclude.length > 0
            ? exclude.some(ex => ex instanceof RegExp ? ex.test(text) : text.includes(ex))
            : false;
    if (
        keyword instanceof RegExp
            ? keyword.test(currentContainer.innerText)
            : currentContainer.innerText?.includes(keyword)
    ) {
        for (const child of currentContainer.children) {
            const rtn = recursiveFindDirectContainer(keyword, child as HTMLElement, exclude, tester);
            if (rtn) {
                return rtn;
            }
        }
        // 只在最内层匹配时再判断exclude
        if (exclude && exclude.length > 0) {
            if (excl(currentContainer.innerText)) {
                return null;
            }
        }
        // 新增：tester 存在且不通过时，继续查找
        if (tester && !tester(currentContainer)) {
            return null;
        }
        return currentContainer;
    } else {
        return null;
    }
}
// 新增：查找直接子textNode
const findTextNode = (container, reg)=> {
	return Array.from(container.childNodes).find(
		(node): node is Text => {
			if (node && typeof node === 'object' && 'nodeType' in node && 'textContent' in node) {
				// @ts-ignore
				return node.nodeType === Node.TEXT_NODE && reg.test(node.textContent);
			}
			return false;
		}
	);
}

const createLink = (link:string,pwd:string,containerEl:HTMLElement) => {
	
	const baiduLinkEl = document.createElement('span');
	const query = typeof pwd === 'string' ?
		link.includes('?') ? `&pwd=${pwd}` : `?pwd=${pwd}` :
		'';
	let _link = /pwd=/.test(link) ? link : `${link}${query}`;
	baiduLinkEl.innerHTML = `<a href="${_link}" target="_blank" style="text-decoration: underline">百度网盘:${_link}</a><br>`;
	baiduLinkEl.setAttribute('target','blank');
	containerEl.parentElement.insertBefore(baiduLinkEl,containerEl);
}

const getBaiduLink = (container:HTMLElement = document.body,) => {
	const baiduLinks:string[] = [];
	// debugger;
	traverse:for(const el of Array.from([...container.querySelectorAll('*'),container])){
		if(el instanceof HTMLElement){
			if(el instanceof HTMLAnchorElement){
				if(el.href.includes('pan.baidu.com') && !baiduLinks.includes(el.href)){
					baiduLinks.push(el.href);
					continue traverse;
				}
			}
			if(el.innerText.includes('pan.baidu.com')){
				const match:string|null = el.innerText.match(/https:\/\/pan\.baidu\.com[.a-zA-Z0-9-\/_?=/]+/u)?.[0];
				match && !baiduLinks.includes(match) && baiduLinks.push(match);
				continue traverse;
			}
		}
	}
	
	return baiduLinks;
}

const getBaiduPwd = (container:HTMLElement = document.body) => {
	
}

export const BaiduNetdiskLink = {
	codeReg,
	linkReg,
	getPwd,
	recursiveFindDirectContainer,
	findTextNode,
	createLink,
	removeCodeFromParent,
	removeLinkFromParent,
	getBaiduLink,
}
