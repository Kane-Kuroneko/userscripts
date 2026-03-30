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
