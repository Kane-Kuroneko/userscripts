export const tester = () => {
	const cases = [
		{
			title : '《我即軍團：替身幸存者(Stand Survivors)》|v20250307|中文|免安裝硬盤版\n',
			chinese : '我即軍團：替身幸存者',
			english : 'Stand Survivors',
		},
		{
			title : '《我的人生(My Life)》|v20250307|中文|免安裝硬盤版\n',
			chinese : '我的人生',
			english : 'My Life',
		},
		{
			title : '《魔女與學生會：卡牌之戰(Witch and Council : The Card)》|V2.0.0|中文|免安裝硬盤版\n',
			chinese : '魔女與學生會：卡牌之戰',
			english : 'Witch and Council : The Card',
		},
	];
	
	cases.forEach(( { title , chinese , english } ) => {
		const result = getGameName(title);
		if(result && result.chinese === chinese && result.english === english ) {
			crayon.group.lightGreen(title);
		} else {
			crayon.group.orange(title);
		}
		if( !result || result.chinese !== chinese ) {
			console.warn(`chinese测试用例不通过`);
		}
		if( !result || result.english !== english ) {
			console.warn(`chinese测试用例不通过`);
		}
		crayon.groupEnd();
	});
}

useMatchDomain({
	includes : [ 'switch618.com' ] ,
} , () => {
	__DEV__ && tester();
});

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { getGameName } from './index';
import { crayon } from 'reaxes-utils';
