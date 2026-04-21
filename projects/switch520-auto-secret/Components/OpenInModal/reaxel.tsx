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
				e.preventDefault();
				e.stopPropagation();
				const cardEl = e.composedPath().find(( p: HTMLElement ) => !!( p ).dataset?.id && p.className === 'post grid') as HTMLElement;
				if( cardEl ) {
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
		const containerEls = document.querySelectorAll('.widget-ajaxpager');
		
		containerEls.forEach((containerEl) => {
			containerEl.addEventListener('click' , async ( e ) => {
				const modalModeEnabled = await GM.getValue('options::modal-mode' , true);
				
				if(!modalModeEnabled){
					return;
				}
				
				const path = e.composedPath();
				
				const cardEl = path.find((p: HTMLElement) => {
					const isPostsItem = p.tagName === 'POSTS' && p.classList?.contains('posts-item');
					const isPostsMini = p.classList?.contains('posts-mini') && p.classList?.contains('ajax-item');
					return isPostsItem || isPostsMini;
				}) as HTMLElement;
				
				if(cardEl){
					e.preventDefault();
					e.stopPropagation();
					
					const linkEl = cardEl.querySelector('.item-thumbnail a, .item-heading a, a') as HTMLAnchorElement;
					
					if(linkEl && linkEl.href){
						setState({
							iframeURL : linkEl.href ,
							modalOpened : true ,
						});
					}
				}
			});
		});
		
		const hotPostsContainers = document.querySelectorAll('.zib-widget.hot-posts');
		
		hotPostsContainers.forEach((containerEl) => {
			containerEl.addEventListener('click' , async ( e ) => {
				const modalModeEnabled = await GM.getValue('options::modal-mode' , true);
				
				if(!modalModeEnabled){
					return;
				}
				
				const path = e.composedPath();
				
				const cardEl = path.find((p: HTMLElement) => {
					const isDirectChild = p.parentElement === containerEl;
					const isHotPostCard = p.classList?.contains('flex') || (p.classList?.contains('relative') && isDirectChild);
					return isHotPostCard;
				}) as HTMLElement;
				
				if(cardEl){
					e.preventDefault();
					e.stopPropagation();
					
					const linkEl = cardEl.querySelector('a') as HTMLAnchorElement;
					
					if(linkEl && linkEl.href){
						setState({
							iframeURL : linkEl.href ,
							modalOpened : true ,
						});
					}
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
