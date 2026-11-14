/** 挂在下载区外壳后面，避免切 tab 重建内部 HTML 时把按钮清掉 */
export const getSteamButtonAnchor = (): HTMLElement | null => {
	return document.querySelector<HTMLElement>(
		'.article-content .modown-private-slot[data-modown-section="download"]'
	) || document.querySelector<HTMLElement>('.article-content .erphpdown-box');
};

export const getGameName = (
	titleText = (document.querySelector('.article-title') as HTMLElement).innerText
) => {
	let { chinese , english } = titleText.match(/《(?<chinese>[\s\S]+?)\((?<english>[\s\S]+?)\)》[\w\W]*/)?.groups || {};	
	if(!chinese && !english){
		english = titleText.split('|')[0];
	}
	return {
		chinese,
		english,
	}
}

if(process.env.NODE_ENV === 'development'){
	import(/* webpackMode: "eager" */ './tester');
}
