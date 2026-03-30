

( function (){
	'use strict';
	if( !document.body ) return;
	if( window.parent !== window.self ) {
		document.querySelectorAll('a').forEach(( a ) => a.target = '_blank');
	}
	//自动输入密码并提交
	;( () => {
		useMatchDomain({
			includes : [ 'gamer520.com','gamers520.com' ] ,
		} , () => {
			const el_input = function (){
				return document.querySelector('input#password') as HTMLInputElement ||
					document.querySelector(`input[type='password']`) as HTMLInputElement ||
					document.querySelector(`input[name='post_password']`) as HTMLInputElement;
			}();
			const el_submit = function (){
				return document.querySelector(`input[type='submit']`) as HTMLInputElement ||
					document.querySelector(`input[name='Submit']`) as HTMLInputElement ||
					document.querySelector(`input[value='提交']`) as HTMLInputElement;
			}();
			document.querySelectorAll('*').forEach(( node: HTMLElement ) => {
				const innerText = node.innerText;
				if(
					innerText?.startsWith('密码保护：') &&
					!innerText?.includes('上一篇') &&
					!innerText?.includes('牛夫人') &&
					!innerText?.includes('当前位置') &&
					!innerText?.includes('此内容受密码保护') &&
					!innerText?.includes('永久防迷路')
				) {
					// const [result] = innerText.match(/[0-9]{3,6}/) ?? [null];
					const secret = innerText.replace('密码保护：' , '');
					if( secret && el_input ) {
						el_input.value = secret;
						el_submit.click();
					}
				}
			});
		});
		
		useMatchDomain({
			includes:['acgxj.com']
		},async () => {
			document.querySelectorAll('span').forEach((el) => {
				if(el.innerText.startsWith('访问密码：') && /\d{6}$/.test(el.innerText)){
					const pwd = (el.innerText.replace('访问密码：',''));
					const input_pwd = document.querySelector( 'input[type=password][name=e_secret_key]' ) as HTMLInputElement;
					if(!input_pwd)return;
					input_pwd.value = pwd;
					const input_confirm = document.querySelector('input[type=submit][value=确定]') as HTMLInputElement;
					input_confirm.click();
				}
			})
		})
	} )();
	
	//以下代码将百度网盘的链接+提取码融合为一个按钮,点击之后直接跳转并填充密码
	;( () => {
		const {
			linkReg ,
			codeReg ,
			recursiveFindDirectContainer ,
			findTextNode ,
			getPwd ,
			createLink,
			removeLinkFromParent,
			removeCodeFromParent,
			getBaiduLink,
		} = BaiduNetdiskLink;
		//可能会有多个百度网盘的链接
		useMatchDomain({includes : [ 'gamer520.com','gamers520.com' ]} , () => {
			if(!location.href.endsWith('.html')){
				return;
			}
			// debugger;
			const containerEl = recursiveFindDirectContainer(linkReg,document.body,['友情链接：','限时特惠']);
			const pwdEl = recursiveFindDirectContainer( codeReg);
			if(!containerEl){
				return;
			}
			const links = getBaiduLink(containerEl);
			// debugger;
			for(const link of links){
				const pwd = pwdEl ? getPwd(pwdEl.innerText) : null;
				createLink(link,pwd,containerEl);
			}
			
			// debugger;
			removeLinkFromParent(containerEl);
			pwdEl && removeCodeFromParent(pwdEl);
			// debugger;
		});
		useMatchDomain({includes:['dl.xxxxx520.cc']},() => {
			try {
				const linkEl = recursiveFindDirectContainer( linkReg,document.body,[/下方|下载链接|下载不完整/ ]);
				if( !linkEl ) {
					return;
				}
				const pwdEl = recursiveFindDirectContainer( codeReg,document.body,["直链+"] );
				const links = getBaiduLink( linkEl );
				if(pwdEl){
					var code = getPwd(pwdEl.innerText);
				}else {
					code = '';
				}
				links.forEach((link,) => {
					createLink(link,code,linkEl);
					removeLinkFromParent(linkEl);
					pwdEl && removeCodeFromParent(pwdEl);
				})
				
				
				
				// debugger;
				
				return 
				if(0){
					const containerEl = recursiveFindDirectContainer(linkReg);
					let pwdEl = recursiveFindDirectContainer(codeReg);
					
					let pwd = getPwd(pwdEl?.innerText || '');
					const link = getBaiduLink(containerEl);
					if(containerEl){
						const aEl = containerEl.querySelector('a');
						if(aEl){
							aEl.href += `?pwd=${pwd}`
							aEl.innerText += `?pwd=${pwd}`
							containerEl.parentElement.removeChild(pwdEl);
						}else {
							const baiduLinkEl = document.createElement('span');
							//@ts-ignore
							let _link = /pwd=/.test(link) ? link : `${link}?pwd=${pwd}`;
							baiduLinkEl.innerHTML = `<a href="${_link}" target="_blank" style="text-decoration: underline">百度网盘:${_link}</a><br>`;
							
							containerEl.innerText = containerEl.innerText.replace(/(链接|百度?网盘)[:：]\s*https:[.a-zA-Z0-9-/]+[\s\r\n]*/,'').replace(/(提取码|如遇到有带x的提取码请手打输入)[:：]\s*[a-zA-Z0-9]{4}/,'');
							containerEl.parentElement.insertBefore(baiduLinkEl,containerEl);
						}
					}
				}
			}catch ( e ) {
				console.error(e);
			}
		});
		useMatchDomain( { includes : [ 'xxxxx520.org','acgxj' ] } , () => {
			// if( !location.href.endsWith( '.html' ) ) {
			// 	return;
			// }
			// debugger;
			const linkEl = recursiveFindDirectContainer( linkReg,document.body,[/下方|下载链接|下载不完整/,'直链+'] , (el) => [
				Array.from(el.querySelectorAll('a')).find(element => element.href.includes('pan.baidu.com')),
				Array.from(el.querySelectorAll('*')).find((element:HTMLElement) => /https:\/\/pan\.baidu\.com/.test(element.innerText??''))
			].some(bool => bool) );
			if( !linkEl ) {
				return;
			}
			const pwdEl = recursiveFindDirectContainer( codeReg );
			const links = getBaiduLink( linkEl );
			if(pwdEl){
				var code = getPwd(pwdEl.innerText);
			}else {
				code = '';
			}
			links.forEach( link => {
				createLink( link , code , linkEl );
				removeLinkFromParent( linkEl );
				pwdEl && removeCodeFromParent( pwdEl );
			} );
			
			
			
			
			
			// debugger;
			return;
			
			
			
			
			
			let downloadArea = recursiveFindDirectContainer( 'https://pan.baidu.com' );
			if( !downloadArea ) {
				return;
			}
			if( downloadArea.parentElement instanceof HTMLAnchorElement ) {
				downloadArea = downloadArea.parentElement;
			}
			if( downloadArea instanceof HTMLAnchorElement ) {
				const anchor = downloadArea as HTMLAnchorElement;
				if( anchor.href.includes( '?pwd=' ) ) {return;}
				const pwdEl = recursiveFindDirectContainer( codeReg );
				const pwd = getPwd(pwdEl.innerText);
				if( !pwd ) {
					// 密码为空时不处理
					return;
				}
				anchor.href += `?pwd=${ pwd }`;
				anchor.target = '_blank';
				anchor.innerText = `${ anchor.innerText.trim() }?pwd=${ pwd }`;
				if( pwdEl?.parentElement ) {
					pwdEl.parentElement.removeChild( pwdEl );
				}
			} else {
				// 新增：处理“链接:”和“提取码:”分别为textNode的情况（更健壮，支持空格、换行、span等混排）
				const linkTextNode = recursiveFindDirectContainer( linkReg,document.body,['下方'] );
				const pwdTextNode = recursiveFindDirectContainer( codeReg );
				// debugger;
				if( linkTextNode && pwdTextNode ) {
					try {
						const linkMatch = linkTextNode.textContent.match( /https?:\/\/pan\.baidu\.com\/\S+/ );
						const pwdMatch = pwdTextNode.textContent.match( /提取码[:：]?\s*([a-zA-Z0-9]{4})/ );
						if( linkMatch && pwdMatch ) {
							const link = `${ linkMatch[0] }?pwd=${ pwdMatch[1] }`;
							const newSpan = document.createElement( 'span' );
							newSpan.innerHTML = `百度网盘:<a target="_blank" href="${ link }">${ link }</a><br>`;
							// 清空原内容并插入新结构
							downloadArea.innerHTML = '';
							downloadArea.appendChild( newSpan );
						}
					} catch ( e ) {
						// 忽略异常
					}
					return;
				}
				let textNodeOfLink = Array.from( downloadArea.childNodes ).find( ( node ): node is Text => node.nodeType === Node.TEXT_NODE && linkReg.test( node.textContent ) );
				if( !textNodeOfLink ) {
					textNodeOfLink = downloadArea.childNodes[0] as Text;
					if( !textNodeOfLink || !textNodeOfLink.textContent ) {
						// 没有可用的链接节点
						return;
					}
				}
				const newTextNode = document.createElement( 'span' );
				// 包含链接的dom里面也包含提取码的情况
				if( codeReg.test( textNodeOfLink.textContent ) ) {
					try {
						const link = textNodeOfLink.textContent.replaceAll( ' ' , '' ).replace( codeReg , '?pwd=' ).replace( linkReg , '' );
						newTextNode.innerHTML = `百度网盘:<a target="_blank" href="${ link }">${ link }</a><br>`;
						textNodeOfLink.parentElement?.append( newTextNode );
						textNodeOfLink.parentElement?.removeChild( textNodeOfLink );
					} catch ( e ) {
						// 忽略异常
					}
				} else {
					// 链接里不含提取码
					var textNodeOfPwd = findTextNode( downloadArea , codeReg );
					if( !textNodeOfPwd || !textNodeOfPwd.textContent ) {
						// 没有提取码节点
						textNodeOfPwd = recursiveFindDirectContainer( codeReg )?.childNodes[0] as Text;
					}
					try {
						const link = `${ textNodeOfLink.textContent.replaceAll( /\s/g , '' ).replaceAll( /链接[:：]/g , '' ).replace( linkReg , '' ) }?pwd=${ textNodeOfPwd.textContent.replace( codeReg , '' ).trim() }`;
						// 只移除textNodeOfPwd和textNodeOfLink，不移除父元素
						if( textNodeOfPwd.parentElement ) {
							textNodeOfPwd.parentElement.removeChild( textNodeOfPwd );
						}
						downloadArea.prepend( newTextNode );
						newTextNode.innerHTML = `百度网盘:<a target="_blank" href="${ link }">${ link }</a><br>`;
						if( textNodeOfLink.parentElement ) {
							textNodeOfLink.parentElement.removeChild( textNodeOfLink );
						}
					} catch ( e ) {
						// 忽略异常
					}
				}
			}
		} );
	} )();
	
	//以下代码跳过获取下载地址的过程 , 不需要点两次立即下载
	;( async() => {
		useMatchDomain({
			includes : [ 'gamer520.com' ] ,
		} , async() => {
			if( !location.href.endsWith('.html') ) {
				return;
			}
			const downloadBtn = document.querySelector('a.go-down') as HTMLElement;
			if( !downloadBtn ) return;
			const srcId = downloadBtn.dataset.id;
			downloadBtn?.addEventListener('click' , async( e ) => {
				e.preventDefault();
				e.stopPropagation();
				const form = new URLSearchParams();
				form.set('action' , 'user_down_ajax');
				form.set('post_id' , srcId);
				0 && fetch(`https://${ location.host }/wp-admin/admin-ajax.php` , {
					method : 'POST' ,
					body : form ,
					credentials : 'include' ,
					headers : {
						// 'content-encoding' : 'zstd',
						'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
					} ,
					mode : 'cors',
				}).then(res => res.json()).then(( { msg } ) => {
					console.log(msg);
				}).catch(e => {
					console.error(e);
				});
				
				const url = `https://${ location.host }/go?post_id=${ srcId }`;
				
				if( location.host.includes('like.gamer520') ) {
					window.open(url);
					return;
				}
				location.href = url;
			} , false);
		});
	} )();
	
	//如果有密码,則自動點擊網盤按鈕
	;( () => {
		useMatchDomain({
			hosts : [ 'pan.baidu.com' ] ,
		} , () => {
			if( location.href.startsWith('https://pan.baidu.com') && location.href.includes('pwd=') ) {
				const submitBtn = document.getElementById('submitBtn');
				if( submitBtn?.innerText === '提取文件' ) {
					submitBtn.click();
				}
			}
		});
	} )();
	
	//在游戏网站中划词搜索
	;( () => {
		useMatchDomain({
			includes : [ 'gamer520' , 'switch618','steamzg','xxxxx520' ] ,
		} , () => {
			import(/*webpackMode:'eager'*/'./SearchOnSelect');
		});
	} )();
	
	//允许switch618.com的右键菜单
	;( () => {
		useMatchDomain({
			includes : [ 'switch618' ] ,
		} , () => {
			document.oncontextmenu = null;
		});
	} )();
	
	//模态框模式浏览游戏
	;( async() => {
		if( location.href.includes('wp-content/plugins/erphpdown/download.php') ) {
			return;
		}
		const registerMenu = async() => {
			const modalMode = await GM.getValue('options::modal-mode' , true);
			
			GM.registerMenuCommand(`窗口模式打开下载页面:${ modalMode ? '✅已开启' : '❌已关闭' }` , async() => {
				await GM.setValue('options::modal-mode' , !await GM.getValue('options::modal-mode'));
				await registerMenu();
				location.reload();
			});
		};
		registerMenu();
		if( await GM.getValue('options::modal-mode' , true) ) {
			const div = document.createElement('div');
			const reactRoot = createRoot(div);
			reactRoot.render(<OpenInModal />);
		}
	} )();
	
	//将去steam搜索框插入进页面正文
	;( async() => {
		if( location.href.includes('wp-content/plugins/erphpdown/download.php') ) {
			return;
		}
		let container: HTMLElement;
		const div = document.createElement('div');
		const reactRoot = createRoot(div);
		
		useMatchDomain({
			includes : [ 'gamer520.com' ] ,
		} , async() => {
			const { articleContainer } = await import(/*webpackMode:'eager'*/'./DOM-finder/switch520.com');
			container = articleContainer();
			if( !document.body.innerText.includes('牛夫人') && ( location.pathname !== '/' ) && container ) {
				container.prepend(div);
				reactRoot.render(<SearchInSteam />);
			}
		});
		
		useMatchDomain({
			regExp : /switch618\.com\/[\d+]+.html/g,
		} , () => {
			container = document.querySelector(`.erphpdown-box`)!;
			if( !container ) {
				return;
			}
			container.insertAdjacentElement('afterend' , div);
			reactRoot.render(<SearchInSteam />);
		});
		
		
		useMatchDomain({
			includes:['steamzg']
		} , () => {
			if(!/\d{5,8}\/?$/.test(location.pathname)){
				return
			}
			if(location.host === 'xj.steamzg.com'){
				return;
			}
			const siblingEl = document.querySelector('.su-row');
			
			if(!siblingEl){
				throw new Error('无法找到挂载<SearchInSteam />的节点');
			}
			
			const parent = siblingEl.parentElement;
			
			parent.insertBefore(div,siblingEl);
			reactRoot.render(<SearchInSteam />);
		});
		
		
	} )();
	
	//二维码canvas转换为链接
	;(async () => {
		const providers = {
			'baidu': '百度网盘',
			'aliyundrive': '阿里云盘',
			'quark': '夸克网盘',
		};
		
		// ==================== 共用工具函數（封裝重複邏輯） ====================
		/**
		 * 根據 URL 取得對應的網盤名稱
		 * （與原代碼完全一致的 provider 查找方式）
		 */
		const getProviderName = (url) => {
			if (typeof url !== 'string') return '';
			const key = Object.keys(providers).find(k => url.includes(k));
			return providers[key] || '';
		};
		
		/**
		 * 建立轉換後的直鏈 <a> 元素
		 * @param {string} url 處理完 pwd 的最終 URL
		 * @param {object} [extraStyle={}] 額外樣式（僅 gamer520 使用）
		 */
		const createDirectLink = (url, extraStyle = {}) => {
			const link = document.createElement('a');
			link.href = url;
			link.textContent = `${getProviderName(url)}：已为您转换为免扫码直链: ${url}`;
			link.setAttribute('target','blank');
			// 套用額外樣式（空物件時無副作用）
			if (Object.keys(extraStyle).length > 0) {
				Object.assign(link.style, extraStyle);
			}
			return link;
		};
		
		/**
		 * 將建立好的 link 插入到 QR 元素後方
		 * （增加 ?. 防空錯誤，提升健壯性，但不改變原邏輯）
		 */
		const insertLinkAfterQR = (qrElement, linkElement) => {
			qrElement.parentElement?.insertAdjacentElement('afterend', linkElement);
		};
		
		// ==================== acg 站點（保持 100% 原邏輯） ====================
		useMatchDomain({
			includes: ['acgxj.com', 'acfb.top','xj.steamzg.com']
		}, () => {
			const qrCodeCanvasEls = Array.from(document.querySelectorAll('canvas.su-qr-canvas')) as HTMLCanvasElement[];
			
			const getWithdrawCode = () => {
				for (const el of document.querySelectorAll('*')) {
					const textNode = el.childNodes?.[0] as Text;
					const reg = /统一提取码：(?<code>\d{4,})/;
					if (textNode instanceof Text && reg.test(textNode.textContent)) {
						const { code } = reg.exec(textNode.textContent).groups;
						if (typeof code === 'string') return code;
					}
				}
			};
			
			// 原代碼中 getWithdrawCode 在迴圈外呼叫一次，保持不變
			const withdrawCode = getWithdrawCode();
			debugger;
			qrCodeCanvasEls.forEach((target) => {
				let url = decodeQrFromCanvas(target);
				debugger;
				// 原邏輯：永遠附加 pwd（即使原本已有 pwd= 或 withdrawCode 為 undefined）
				if(withdrawCode){
					if (url.includes('?')) {
						url += `&pwd=${withdrawCode}`;
					} else {
						url += `?pwd=${withdrawCode}`;
					}
				}
				
				const newNode = createDirectLink(url);           // ← 重複邏輯已被封裝
				insertLinkAfterQR(target, newNode);              // ← 重複邏輯已被封裝
			});
		});
		
		// ==================== gamer520 站點（保持 100% 原邏輯） ====================
		useMatchDomain({
			includes: ['gamers520.com']
		}, () => {
			const qrcodeImages = Array.from(document.querySelectorAll('img.wpkqcg_qrcode')) as HTMLImageElement[];
			
			for (const el of qrcodeImages) {
				// 原有防死循環查找提取碼邏輯（完全不變）
				const codeEl = (() => {
					let current = el.parentElement as Element;
					let timestamp = Date.now();
					while (true) {
						// 如果執行超過100ms則強行打斷,防止死循環
						if (Date.now() - timestamp > 100) {
							console.error('執行時間過長,可能出現死循環');
							break;
						}
						if ((current?.nextElementSibling as HTMLElement)?.innerText?.includes('提取码')) {
							return current.nextElementSibling;
						}
						if (!current) {
							return null;
						}
						current = current?.nextElementSibling;
					}
				})();
				
				const code = codeEl?.textContent.replace('提取码: ', '');
				
				let url = decodeQRFromImageElement(el);
				
				// 原邏輯：只有當「沒有 pwd=」且「有 code」時才附加
				if (!url.includes('pwd=') && code) {
					if (url.includes('?')) {
						url += `&pwd=${code}`;
					} else {
						url += `?pwd=${code}`;
					}
				}
				
				const anchor = createDirectLink(url, {
					marginTop: '20px',
					display: 'block',
					color: 'palegreen',
				});                                              // ← 重複邏輯已被封裝
				
				insertLinkAfterQR(el, anchor);                   // ← 重複邏輯已被封裝
			}
		});
	})()
} )();


console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
	require('./ProxyDetector');
}

import { decodeQrFromCanvas ,decodeQRFromImageElement} from "./QrcodeToLink";
import { BaiduNetdiskLink } from './BaiduNetdiskLink';
import { OpenInModal } from './Components/OpenInModal';
import { SearchInSteam } from './Components/SearchInSteamButton';
import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import React from 'react';
import { createRoot } from 'react-dom/client';
import "./style.less";
