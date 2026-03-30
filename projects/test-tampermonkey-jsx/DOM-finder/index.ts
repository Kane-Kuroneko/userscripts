
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
	if(/^《[\w\W]+》$/.test(rowText)){
		console.log(111);
		return analyzeGameNameInTitle( rowText.match( /(?<=《)[\w\W]+(?=》)/ )?.[0] );
	} else if(/^《[\w\W]+》\s*[\u4e00-\u9fa5]+\s*[a-zA-Z]+\s*$/.test(rowText)){
		console.log(222,{innerText:rowText.match( /(?<=《)[\w\W]+(?=》)/ )?.[0]});
		return analyzeGameNameInTitle( rowText.replaceAll(/[\u4e00-\u9fa5《》][a-zA-Z0-9]+/g,'').replaceAll(/[\u4e00-\u9fa5《》]/g,'') );
	}else if( el?.childNodes[0]?.textContent.startsWith( '名称:' ) ) {
		console.log(333,{ innerText : el.childNodes[0]?.textContent.replace( '名称:' , '' ).trim() });
		return analyzeGameNameInTitle(  el.childNodes[0]?.textContent.replace( '名称:' , '' ).trim() );
	}else if(el?.tagName.toLowerCase() === 'p'){
		console.log(444,JSON.stringify(rowText));
		return analyzeGameNameInTitle(  rowText );
	}
	
	return analyzeGameNameInTitle( rowText );
}

export const nameInTitle = () => {
	const el = titleElement();
	return analyzeGameNameInTitle( el.innerText );
}

export const nameInArticle = (container = articleContainer() ) => {
	return Array.from( container.querySelectorAll( '*' ) ).reduce( ( accu:{english:string,chinese:string} , el ) => {
		if( accu ) return accu;
		if(el.innerText.includes('解压密码') || el.innerText.includes('去Steam') || !el.innerText.trim()) return null;
		return accu = analyzeGameNameInArticle(el.innerText,el);
	},null as {english:string,chinese:string} );
}

const tester = () => {
	
	const testCases = [
		{
			type : 'title',
			input:'地平线 零之曙光™ 重制版',
			expectENG : null,
			expectCHN : '地平线 零之曙光™ 重制版'
		},
		{
			type : 'title',
			input:'超级竞技场:Hyper Jam/官方中文/本体+1.1.0升补/[NSZ]',
			expectENG : 'Hyper Jam',
			expectCHN : '超级竞技场'
		},
		{
			type : 'title',
			input:'超级竞技场:弯道:Hyper Jam:Apex/官方中文/本体+1.1.0升补/[NSZ]',
			expectENG : 'Hyper Jam:Apex',
			expectCHN : '超级竞技场:弯道'
		},
		{
			type : 'title',
			input:'零号奴隶X Slave Zero X',
			expectENG : 'Slave Zero X',
			expectCHN : '零号奴隶X'
		},
		{
			type : 'title',
			input:'商店模拟器 超市 Shop Simulator Supermarket',
			expectENG : 'Shop Simulator Supermarket',
			expectCHN : '商店模拟器 超市'
		},
		{
			type : 'title',
			input:'Liberated: Enhanced Edition',
			expectENG : 'Liberated: Enhanced Edition',
			expectCHN : undefined
		},
		{
			type : 'title',
			input:'蒸汽朋克塔2',
			expectENG : null,
			expectCHN : '蒸汽朋克塔2'
		},
		{
			type : 'title',
			input:'格兰蒂亚秘闻 Secrets of Grindea',
			expectENG : 'Secrets of Grindea',
			expectCHN : '格兰蒂亚秘闻'
		},
		{
			type : 'title',
			input:' 英雄传说 黎之轨迹Ⅱ -绯红原罪-',
			expectENG : null,
			expectCHN : '英雄传说 黎之轨迹Ⅱ -绯红原罪-'
		},
		{
			type : 'article',
			input:'《地平线 零之曙光™》重制版 Horizon Zero Dawn Remastered',
			expectENG : 'Horizon Zero Dawn Remastered',
			expectCHN : '《地平线 零之曙光™》重制版'
		},
	];
	
	
	testCases.forEach( ( {type, expectENG , expectCHN , input } ) => {
		let { chinese , english } = type === 'title' ? analyzeGameNameInTitle(input ) : (analyzeGameNameInArticle(input) ?? {});
		if(!chinese) chinese = null;
		if(!english) english = null;
		const chinesePass = chinese?.trim() == expectCHN?.trim();
		const englishPass = english?.trim() == expectENG?.trim();
		if(chinesePass && englishPass){
			crayon.group.lightGreen(input);
		}else {
			crayon.group.blue( input );
		}
		if( chinese?.trim() != expectCHN?.trim() ) {
			console.warn( `测试不通过Chinese | match:<${chinese || null}> | expect:<${ expectCHN || null }> ` );
		}
		if( english?.trim() != expectENG?.trim() ) {
			console.warn( `测试不通过English | match:<${english || null}> | expect:<${ expectENG || null }> ` );
		}
		console.groupEnd();
	} );
}

tester();
import { crayon } from 'reaxes-utils';
