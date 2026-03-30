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
		{
			type : 'title',
			input:'双影奇境|豪华中文|Build.16999078+预购特典+全DLC-支持手柄|解压即撸|\n',
			expectENG : null,
			expectCHN : '双影奇境'
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


useMatchDomain({
	includes : [ 'gamer520.com' ] ,
} , () => {
	__DEV__ && tester();
});

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { analyzeGameNameInArticle , analyzeGameNameInTitle } from './index';

import { crayon } from 'reaxes-utils';
