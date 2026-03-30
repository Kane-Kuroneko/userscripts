

(function() {
	'use strict';
	
	if(location.hostname !== 'www.gamer520.com'){
		return;
	}
	const el_input = function() {
		return document.querySelector('input#password') as HTMLInputElement ||
			document.querySelector(`input[type='password']`) as HTMLInputElement ||
			document.querySelector(`input[name='post_password']`) as HTMLInputElement;
	}();
	const el_submit = function() {
		return document.querySelector(`input[type='submit']`) as HTMLInputElement ||
			document.querySelector(`input[name='Submit']`) as HTMLInputElement ||
			document.querySelector(`input[value='提交']`) as HTMLInputElement;
	}();
	
	
	document.querySelectorAll('*').forEach((node:HTMLElement) => {
		const innerText = node.innerText;
		if (
			innerText?.startsWith('密码保护：') &&
			!innerText?.includes('上一篇') &&
			!innerText?.includes('牛夫人') &&
			!innerText?.includes('当前位置') &&
			!innerText?.includes('此内容受密码保护') &&
			!innerText?.includes('永久防迷路')
		) {
			// const [result] = innerText.match(/[0-9]{3,6}/) ?? [null];
			const secret = innerText.replace('密码保护：' , '');
			if ( secret && el_input ) {
				
				el_input.value = secret;
				el_submit.click();
			}
		}
	});
	
	
	//以下代码将百度网盘的链接+提取码融合为一个按钮,点击之后直接跳转并填充密码
	(() => {
		/**
		 * 拿到链接文本所在的P标签
		 * @type {HTMLElement}
		 */
		const containerDiv = function() {
			return Array.from(document.querySelectorAll('div.entry-content.u-text-format.u-clearfix')).find(el => {
				return (el.innerText?.includes?.('提取码')) && (el.innerText?.includes?.('链接:')) && (el.innerText?.includes?.('https://pan.baidu.com'));
			});
		}();
		
		if ( containerDiv ) {
			const [baiduLink , baiduLinkAElement] = function() {
				//兼容不是<a/>标签的情况,将其转换为a标签
				const aElement = Array.from(containerDiv.querySelectorAll('*')).reduce((accu,el) => {
					if(accu) return accu;
					if(el.tagName.toLowerCase() === 'a' && el.href?.startsWith?.('https://pan.baidu.com')){
						return accu = el;
					}else {
						//如果网盘链接是个普通text,则将其转换为a标签
						if([
							el.innerText.includes('链接'),
							el.innerText.includes('https://pan.baidu.com'),
							(el.children.length === 0) || Array.from(el.childNodes).find(e => (e.nodeName === '#text') && (e.nodeValue.includes('https://pan.baidu.com'))),
						].every(bool => bool)){
							const url = el.innerText.match(/https?:\/\/pan\.baidu\.com\/[\/a-zA-Z0-9?=&]+/)[0];
							el.innerHTML = el.innerText.replace(url , `<a href='${ url }'>${ url }</a>`);
							return accu = el.querySelector('a');
						}
					}
				},null);
				return [aElement.href , aElement];
			}();
			
			const [pwdText , pwdElement] = function() {
				const pwdElement = Array.from(containerDiv.querySelectorAll('*')).find(el => el?.innerText?.startsWith?.('提取码:'));
				return [pwdElement?.innerText.replace('提取码: ' , '').replaceAll(' ' , '') , pwdElement];
			}();
			
			
			if ( !baiduLink.includes('pwd=') && pwdText ) {
				const href = baiduLink + (baiduLink.includes('?') ? `&pwd=${ pwdText }` : `?pwd=${ pwdText }`);
				baiduLinkAElement.href = href;
				baiduLinkAElement.innerText = baiduLinkAElement.innerText.replace(baiduLink , href);
			}
			
			containerDiv.removeChild(pwdElement);
		}
	})();
	
	//以下代码跳过获取下载地址的过程 , 不需要点两次立即下载
	(() => {
		const downloadButton = new Promise( ( resolve ) => {
			const interval = setInterval( () => {
				const button = Array.from( document.querySelectorAll( 'a' ) ).find( el => {
					return el.innerText === ' 立即下载';
				} );
				if( button ) {
					clearInterval( interval );
					resolve( button );
				}
			} , 100 );
		} );
		
		downloadButton.then( ( button ) => {
			
			let interval , invokedCount , startTime;
			if( button ) {
				button.addEventListener( 'click' , () => {
					invokedCount = 0;
					startTime = Date.now();
					interval = setInterval( () => {
						if( invokedCount >= 40 || Date.now() - startTime > 5 * 1000 ) {
							clearInterval( interval );
							interval = null;
							invokedCount = 0;
						} else {
							invokedCount++;
							const secondDownloadButton = function () {
								return Array.from( document.querySelectorAll( '*' ) ).find( el => el.innerText === '立即下载' );
							}();
							if( secondDownloadButton ) {
								secondDownloadButton.click();
								clearInterval( interval );
								interval = null;
								invokedCount = 0;
							}
						}
					} , 100 );
				} );
			} else {
				console.warn( 'downloadButton not founddddddddddddddddddddddddddddddd' );
			}
		} );
		
	})();
	
	//如果有密码,则自动点击网盘按钮
	(() => {
		if(location.href.startsWith('https://pan.baidu.com') && location.href.includes('pwd=')){
			const submitBtn = document.getElementById('submitBtn');
			if(submitBtn.innerText === '提取文件'){
				submitBtn.click();
			}
		}
	})();
	
	//游戏介绍页添加直达steam按钮,打开弹窗来浏览该游戏的价格和steam的用户评价
	(() => {
		const articleDiv = function () {
			return document.querySelector('div.entry-wrapper')
		}();
		const steamModal = {}
	})();
	
	
	if(!document.body.innerText.includes('牛夫人') && (location.pathname !== '/')){
		render(<SearchInSteam />,articleContainer());
	}
	
})();


import {render} from 'preact';
import React from 'react';
import {createReaxable,reaxel} from 'reaxes';
import {reaxper} from 'reaxes-react';
import Modal from 'react-modal';
import { articleContainer } from './DOM-finder';
import { SearchInSteam } from './Components/Search-In-Steam';
import "./style.less";
