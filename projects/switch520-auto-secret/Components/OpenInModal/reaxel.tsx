export const reaxel_OpenInModal = reaxel(() => {
	const { store , setState  } = createReaxable({
		modalOpened : false ,
		iframeURL : null ,
	});
	
	useMatchDomain({
		includes : [ 'gamer520' ] ,
	} , () => {
		if( !location.href.endsWith('.html') ) {
			const containerEl = document.querySelector('.posts-wrapper');
			
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
				if(cardEl){
					e.preventDefault();
					e.stopPropagation();
				}
				if( cardEl ) {
					console.log(cardEl , '0000000000');
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
