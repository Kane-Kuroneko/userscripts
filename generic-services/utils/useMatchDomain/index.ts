/**
 * 如果匹配到域名则会执行回调
 */

export const useMatchDomain = async (
	matcher: DomainMatcher ,
	callback: () => void ,
) => {
	let matchResult = false;
	switch( true ) {
		case matcher.regExp?.test(location.href):
		case matcher.hosts?.some(host => location.host === host):
		case matcher.includes?.some(kw => {
			if( _.isString(kw) ) {
				return location.href.includes(kw);
			} else {
				return kw.every(txt => location.href.includes(txt));
			}
		}):{
			matchResult = true;
			break;
		}

	}
	if(matchResult){
		return callback();
	}else {
		return null;
	}
};

/**
 * regExp,hosts,includes取并集,protocol为约束性规则,与上述规则结果取交集
 * 需要注意的是includes规则:第一层的所有规则取并集,如果第一层的某个成员是数组,则数组内的规则取交集,href必须包含该内层数组中的所有字符
 * 比如includes:['switch520',['switch','618']]这个规则代表href要么包含'switch520',要么既包含'switch'也同时包含'618'
 */
type DomainMatcher = {
	regExp?: RegExp,
	hosts?: string[],
	includes?: ( string | string[] )[],
}


import _ from 'lodash';

