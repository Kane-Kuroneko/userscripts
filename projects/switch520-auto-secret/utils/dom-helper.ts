/**
 * DOM 操作工具函数
 * 提供常用的 DOM 查询、创建、插入等操作的封装
 */

/**
 * 安全查询单个 DOM 元素
 * @param selector CSS 选择器
 * @returns 匹配的元素或 null
 */
export function querySelector<T extends HTMLElement>(selector: string): T | null {
	return document.querySelector(selector) as T | null;
}

/**
 * 查询所有匹配的 DOM 元素
 * @param selector CSS 选择器
 * @returns 元素数组
 */
export function querySelectorAll<T extends HTMLElement>(selector: string): T[] {
	return Array.from(document.querySelectorAll<T>(selector));
}

/**
 * 创建 DOM 元素并设置属性
 * @param tag 标签名
 * @param attributes 属性键值对
 * @returns 创建的元素
 */
export function createElement<T extends HTMLElement>(
	tag: string,
	attributes?: Record<string, string>
): T {
	const element = document.createElement(tag) as T;
	if (attributes) {
		Object.entries(attributes).forEach(([key, value]) => {
			element.setAttribute(key, value);
		});
	}
	return element;
}

/**
 * 在参考节点后插入新节点
 * @param newNode 要插入的节点
 * @param referenceNode 参考节点
 */
export function insertAfter(newNode: Node, referenceNode: Node): void {
	referenceNode.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * 查找直接子节点中的文本节点
 * @param container 容器元素
 * @param reg 匹配正则
 * @returns 匹配的文本节点或 null
 */
export function findDirectTextNode(container: HTMLElement, reg: RegExp): Text | null {
	return Array.from(container.childNodes).find((node): node is Text => {
		return node.nodeType === Node.TEXT_NODE && reg.test(node.textContent || '');
	}) || null;
}

/**
 * 递归查找包含指定关键字的最深层容器
 * @param keyword 关键字（字符串或正则）
 * @param container 起始容器，默认 document.body
 * @param exclude 排除的关键字列表
 * @param tester 自定义测试函数
 * @returns 匹配的容器元素或 null
 */
export function recursiveFindContainer(
	keyword: string | RegExp,
	container: HTMLElement = document.body,
	exclude?: (string | RegExp)[],
	tester?: (el: HTMLElement) => boolean
): HTMLElement | null {
	const isExcluded = (text: string) =>
		exclude?.some(ex => ex instanceof RegExp ? ex.test(text) : text.includes(ex)) || false;

	const isMatch = keyword instanceof RegExp
		? keyword.test(container.innerText)
		: container.innerText?.includes(keyword);

	if (isMatch) {
		// 递归查找子元素
		for (const child of container.children) {
			const result = recursiveFindContainer(keyword, child as HTMLElement, exclude, tester);
			if (result) return result;
		}

		// 检查排除条件
		if (exclude && exclude.length > 0 && isExcluded(container.innerText)) {
			return null;
		}

		// 自定义测试
		if (tester && !tester(container)) {
			return null;
		}

		return container;
	}

	return null;
}

/**
 * 安全移除元素
 * @param element 要移除的元素
 */
export function safeRemove(element: Node | null): void {
	element?.parentNode?.removeChild(element);
}
