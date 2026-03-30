/**
 * 静默运行函数,用于tampermonkey寻找dom但没找到时使用,不影响接下来的脚本
 */
export const useSilenceCatch = (callback:() => void) => {
	try {
		callback()
	}catch ( e ) {
		console.warn('回调报错,但已被捕获');
	}
}
