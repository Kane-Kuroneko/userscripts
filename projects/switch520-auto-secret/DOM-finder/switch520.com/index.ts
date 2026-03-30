
export const articleContainer = function () {
	
	return document.querySelector( 'div.entry-content.u-text-format.u-clearfix' ) as HTMLElement;
};

export const titleElement = function () {
	return document.querySelector( 'h1.entry-title' ) as HTMLElement;
};

/**
 * 根据标题解析出中文名和英文名
 */
export const analyzeGameNameInTitle = function ( title = titleElement()?.innerText ) {
	
	let chineseGameName :string;
	let englishGameName :string;
	
	const _titleText:string = title.split(/\/|\|/)[0];
	
	//<Liberated: Enhanced Edition>
	if(/^[a-zA-Z0-9\s:]+/.test(_titleText)){
		chineseGameName = null;
		englishGameName = _titleText.replaceAll(/[\u4e00-\u9fa5]/g,'').replaceAll(/^:|:$/g,'').trim();
	}
	
	//<商店模拟器 超市 Shop Simulator Supermarket>
	if(/^\s*[\u4e00-\u9fa5™…?《][\w\W]*[\u4e00-\u9fa5\s™…?》-](?=(\s|$))/.test(_titleText)){
		chineseGameName = _titleText.match(/^\s*[\u4e00-\u9fa5™…?《-]+[\w\W]*[\u4e00-\u9fa5™…?-]+(?=\s?)/)?.[0];
		englishGameName = _titleText.replace(chineseGameName,'').replaceAll(/^:|:$/g,'').trim();
	}
	
	//<零号奴隶X Slave Zero X>
	if(/^\s*[\u4e00-\u9fa5™…?《]+[a-zA-Z0-9](\s+|\b)/.test(_titleText)){
		chineseGameName = _titleText.match(/\s*[\u4e00-\u9fa5《]+[a-zA-Z0-9](?=\s*)/)?.[0];
		englishGameName = _titleText.replace( chineseGameName , '' ).replaceAll(/^:|:$/g,'').trim();
	}
	
	//<我的世界:传奇:minecraft:legends>
	if((_titleText.split(':').length - 1 > 2) && /^[\u4e00-\u9fa5]+[\w\W]*:[\w\W]*$/i.test(_titleText)){
		chineseGameName = _titleText.match(/^[\u4e00-\u9fa5]+:[\u4e00-\u9fa5]+/g)?.[0];
		englishGameName = _titleText.replace( chineseGameName , '' ).replaceAll(/^:|:$/g,'').trim();
	}
	//<超级竞技场:Hyper Jam>
	if(/^[\u4e00-\u9fa5]+:[a-zA-Z\s]+$/.test(_titleText)){
		chineseGameName = _titleText.match(/^\s*[\u4e00-\u9fa5]+:?[\u4e00-\u9fa5]*(?=:)/i)?.[0];
		englishGameName = _titleText.replace(chineseGameName,'').replaceAll(/^:|:$/g,'').trim();
	}
	
	const res = { chinese : chineseGameName , english : englishGameName }; 

	return res;
}

/**
 * 根据文章内容解析出游戏名
 */
export const analyzeGameNameInArticle = (rowText:string,el?:HTMLElement) => {
	if(/《[\w\W]+》/.test(rowText)){
		__DEV__ && console.log(111);
		return analyzeGameNameInTitle( rowText.match( /(?<=《)[\w\W]+(?=》)/ )?.[0] );
	} else if(/^《[\w\W]+》\s*[\u4e00-\u9fa5]+\s*[a-zA-Z]+\s*$/.test(rowText)){
		__DEV__ && console.log(222,{innerText:rowText.match( /(?<=《)[\w\W]+(?=》)/ )?.[0]});
		return analyzeGameNameInTitle( rowText.replaceAll(/[\u4e00-\u9fa5《》][a-zA-Z0-9]+/g,'').replaceAll(/[\u4e00-\u9fa5《》]/g,'') );
	}else if( el?.childNodes[0]?.textContent.startsWith( '名称:' ) ) {
		__DEV__ && console.log(333,{ innerText : el.childNodes[0]?.textContent.replace( '名称:' , '' ).trim() });
		return analyzeGameNameInTitle(  el.childNodes[0]?.textContent.replace( '名称:' , '' ).trim() );
	}else if(el?.tagName.toLowerCase() === 'p'){
		__DEV__ && console.log(444,JSON.stringify(rowText));
		return analyzeGameNameInTitle( rowText );
	}
	
	return analyzeGameNameInTitle( rowText );
}

export const nameInTitle = () => {
	const el = titleElement();
	return analyzeGameNameInTitle( el.innerText );
}

export const nameInArticle = (container = articleContainer() ) => {
	return Array.from( container.querySelectorAll( '*' ) ).reduce( ( accu:{english:string,chinese:string} , el:HTMLElement ) => {
		if( accu ) return accu;
		if(el.innerText.includes('解压密码') || el.innerText.includes('去Steam') || !el.innerText.trim()) return null;
		return accu = analyzeGameNameInArticle(el.innerText,el);
	},null as {english:string,chinese:string} );
}

export const getGameName = ():string => {
	return titleElement().innerText.split('|')[0];
	const articleName = nameInArticle();
	const titleName = nameInTitle();
	return articleName.english || articleName.chinese || titleName.english || titleName.chinese;  
}

if (process.env.NODE_ENV === 'development') {
	/*注释不得被移除!作用是命令webpack不分包而是内联打包*/
	import(/* webpackMode: "eager" */ './tester');
}
import { crayon } from 'reaxes-utils';

