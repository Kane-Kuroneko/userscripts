export const reaxel_OpenInModal = reaxel(() => {
	const { store , setState  } = createReaxable({
		modalOpened : false ,
		iframeURL : null ,
	});
	
	useMatchDomain({
		includes : [ 'gamer520' ] ,
	} , () => {
		const mountContainerListener = async (container:HTMLElement) => {
			const cardElements = Array.from(container.children);
			container?.addEventListener('click' , async ( e ) => {
				if(!await GM.getValue('options::modal-mode' , true)){
					return;
				}
				e.preventDefault();
				e.stopPropagation();
				// console.log('bbbbbbbbbbbbb' , e.composedPath());
				const cardEl = e.composedPath().find(( p ) => cardElements.includes(p as HTMLElement)) as HTMLElement;
				if( cardEl ) {
					const { href } = cardEl.querySelector('a');
					setState({
						iframeURL : href ,
						modalOpened : true ,
					});
				}
			});
		}
		
		if(location.pathname === '/'){
			const containerEl = document.querySelector('div.row.cat-posts-wrapper') as HTMLElement;
			mountContainerListener(containerEl);
		}
		if( !location.href.endsWith('.html') ) {
			const containerEl = document.querySelector('.posts-wrapper') as HTMLElement;
			mountContainerListener(containerEl);
		}
	});
	useMatchDomain({
		includes : [ 'xxxxx520' ] ,
	} , () => {
		if( !location.href.endsWith('.html') ) {
			const containerEl = document.querySelector('.row.posts-wrapper.scroll');
			
			containerEl?.addEventListener('click' , async ( e ) => {
				if(!await GM.getValue('options::modal-mode' , true)){
					return;
				}
				e.preventDefault();
				e.stopPropagation();
				// console.log('bbbbbbbbbbbbb' , e.composedPath());
				const cardEl = e.composedPath().find(( p ) => [ ...containerEl.children ].includes(p as HTMLElement)) as HTMLElement;
				if( cardEl ) {
					const { href } = cardEl.querySelector('a');
					setState({
						iframeURL : href ,
						modalOpened : true ,
					});
				}
			});
		}
	});
	useMatchDomain({
		includes : [ 'switch618' ] ,
	} , () => {
		if( !location.href.endsWith('.html') ) {
			const mainEl = document.querySelector('.main');
			
			mainEl?.addEventListener('click' , async ( e ) => {
				if(!await GM.getValue('options::modal-mode' , true)){
					return;
				}
				const cardEl = e.composedPath().find(( p: HTMLElement ) => !!( p ).dataset?.id && p.className === 'post grid') as HTMLElement;
				if( cardEl ) {
					e.preventDefault();
					e.stopPropagation();
					const id = cardEl.dataset.id;
					setState({
						iframeURL : `https://www.switch618.com/${ id }.html` ,
						modalOpened : true ,
					});
				}
			});
		} else {
			document.querySelectorAll('a').forEach(( el ) => {
				if( el.innerText === ' 立即下载' ) {
					el.addEventListener('click' , ( e ) => {
						e.preventDefault();
						location.href = el.href;
					});
				}
			});
		}
	});
	useMatchDomain({
		includes : [ 'fzgamer' ] ,
	} , () => {
		console.log('[fzgamer-modal] 初始化 fzgamer 弹窗监听器');
		
		// 监听 .widget-ajaxpager 和 .ajaxpager 容器（兼容不同页面结构）
		const containerEls = document.querySelectorAll('.widget-ajaxpager, .ajaxpager');
		console.log('[fzgamer-modal] 找到 .widget-ajaxpager/.ajaxpager 容器数量:', containerEls.length);
		
		containerEls.forEach((containerEl, index) => {
			console.log(`[fzgamer-modal] 为容器[${index}] 添加点击监听器:`, containerEl.className);
			containerEl.addEventListener('click' , async ( e ) => {
				console.log('[fzgamer-modal] ⚡ 容器被点击！容器类名:', containerEl.className);
				console.log('[fzgamer-modal] 容器元素:', containerEl);
				console.log('[fzgamer-modal] 事件目标:', e.target);
				
				const modalModeEnabled = await GM.getValue('options::modal-mode' , true);
				console.log('[fzgamer-modal] modal-mode 状态:', modalModeEnabled);
				
				if(!modalModeEnabled){
					console.log('[fzgamer-modal] modal-mode 已关闭，跳过处理');
					return;
				}
				
				const path = e.composedPath();
				console.log('[fzgamer-modal] 点击路径:', path);
				
				const cardEl = path.find((p: HTMLElement) => {
					const isPostsItem = p.tagName === 'POSTS' && p.classList?.contains('posts-item');
					const isPostsMini = p.classList?.contains('posts-mini') && p.classList?.contains('ajax-item');
					console.log('[fzgamer-modal] 🔍 检查元素:', p.tagName, p.className, '=> isPostsItem:', isPostsItem, 'isPostsMini:', isPostsMini);
					return isPostsItem || isPostsMini;
				}) as HTMLElement;
				
				console.log('[fzgamer-modal] 查找结果 cardEl:', cardEl);
				
				if(cardEl){
					console.log('[fzgamer-modal] 找到卡片元素:', cardEl.tagName, cardEl.className);
					e.preventDefault();
					e.stopPropagation();
					
					const linkEl = cardEl.querySelector('.item-thumbnail a, .item-heading a, a') as HTMLAnchorElement;
					console.log('[fzgamer-modal] 查找链接元素:', linkEl);
					
					if(linkEl && linkEl.href){
						console.log('[fzgamer-modal] 找到链接:', linkEl.href);
						setState({
							iframeURL : linkEl.href ,
							modalOpened : true ,
						});
					} else {
						console.log('[fzgamer-modal] 未找到有效链接');
					}
				} else {
					console.log('[fzgamer-modal] 未找到匹配的卡片元素');
				}
			});
		});
		
		// 监听 .zib-widget.hot-posts 容器
		const hotPostsContainers = document.querySelectorAll('.zib-widget.hot-posts');
		console.log('[fzgamer-modal] 找到 .zib-widget.hot-posts 容器数量:', hotPostsContainers.length);
		
		hotPostsContainers.forEach((containerEl, index) => {
			console.log(`[fzgamer-modal] 为 .zib-widget.hot-posts[${index}] 添加点击监听器`);
			containerEl.addEventListener('click' , async ( e ) => {
				console.log('[fzgamer-modal] .zib-widget.hot-posts 容器被点击');
				
				const modalModeEnabled = await GM.getValue('options::modal-mode' , true);
				console.log('[fzgamer-modal] modal-mode 状态:', modalModeEnabled);
				
				if(!modalModeEnabled){
					console.log('[fzgamer-modal] modal-mode 已关闭，跳过处理');
					return;
				}
				
				const path = e.composedPath();
				console.log('[fzgamer-modal] 点击路径:', path);
				
				const cardEl = path.find((p: HTMLElement) => {
					const isDirectChild = p.parentElement === containerEl;
					const isHotPostCard = p.classList?.contains('flex') || (p.classList?.contains('relative') && isDirectChild);
					console.log('[fzgamer-modal] 检查 hot-posts 元素:', p.tagName, p.className, 'isDirectChild:', isDirectChild, 'isHotPostCard:', isHotPostCard);
					return isHotPostCard;
				}) as HTMLElement;
				
				if(cardEl){
					console.log('[fzgamer-modal] 找到 hot-posts 卡片元素:', cardEl.tagName, cardEl.className);
					e.preventDefault();
					e.stopPropagation();
					
					const linkEl = cardEl.querySelector('a') as HTMLAnchorElement;
					console.log('[fzgamer-modal] 查找链接元素:', linkEl);
					
					if(linkEl && linkEl.href){
						console.log('[fzgamer-modal] 找到链接:', linkEl.href);
						setState({
							iframeURL : linkEl.href ,
							modalOpened : true ,
						});
					} else {
						console.log('[fzgamer-modal] 未找到有效链接');
					}
				} else {
					console.log('[fzgamer-modal] 未找到匹配的 hot-posts 卡片元素');
				}
			});
		});
	});
	useMatchDomain({
		includes : [ 'steamzg' ] ,
	} , () => {
		
		
		if(/\d{5,8}\/?$/.test(location.href)){
			return
		}
		
		const getRemainNotiCounts = () => GM_getValue('user_read_steazg_not_support_modal',3);
		
		const notice = (href:string) => {
			const remainNotifyCounts = getRemainNotiCounts();
			if(remainNotifyCounts){
				const {destroy} = Modal.confirm({
					title : '敬告 (来自switch520-auto-secret脚本)',
					content : <>
						<p>由于站长修改了网站配置,switch520-auto-secret脚本将无法再为本站提供弹窗浏览功能,将为您开启新窗口浏览</p>
						<p style={{textDecoration:"underline"}}><a href="https://greasyfork.org/zh-CN/scripts/475199-switch520-auto-secret/discussions/324611" target='_blank'>失效原因</a></p>
						<p>(此提示还会显示{remainNotifyCounts - 1}次)</p>
					</>,
					onOk (){
						destroy();
						setTimeout(() => window.open(href),100);
						GM_setValue('user_read_steazg_not_support_modal',remainNotifyCounts - 1);
					},
					okText : '新窗口打开',
					cancelText : '取消',
					okButtonProps:{
						style:{
							color : 'white'
						}
					}
				});
			}else {
				window.open(href);
			}
		}
		
		const mainEl = document.querySelector('.poi-row.inn-archive__container');
		
			mainEl?.addEventListener('click' , async ( e ) => {
				if(!await GM.getValue('options::modal-mode' , true)){
					return;
				}
				
				const cardEl = e.composedPath().find(( el: HTMLElement ) => el.tagName ==='ARTICLE') as HTMLElement;
				if(cardEl){
					e.preventDefault();
					e.stopPropagation();
					
					const href = (cardEl.querySelector(`a[href^='https://steamzg.com/']`) as HTMLLinkElement).href;
					
					//临时代码,当站长修复X-Frame-Options之前
					notice(href);
					return;
					////////////////////////////
					setState({
						iframeURL : href ,
						modalOpened : true ,
					});
				}
			});
	});
	
	if(!document.body){
		console.table(location);
	}
	
	const rtn = {};
	return Object.assign(() => rtn , {
		store ,
		setState ,
	});
});


import { reaxel , createReaxable } from 'reaxes';
import { message,Modal } from 'antd';
import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import {useState,useEffect} from 'react';
import {reaxper} from 'reaxes-react';
