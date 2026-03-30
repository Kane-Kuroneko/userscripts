export const SearchInSteam = reaxper( () => {
	
	return <div>
		<button
			style={{
				backgroundColor : '#20a0ff',
				color : '#eee',
				width : '100%',
				padding : '12px 18px',
				borderRadius : '4px',
				border : 'none',
				cursor : 'pointer',
				fontSize : '16px',
				letterSpacing : '2px',
				margin : '0 0 24px 0'
			}}
			onClick = { async () => {
				let searchResult = null;
				await useMatchDomain({
					includes:['gamer520.com'],
				},async () => {
					const { getGameName } = await import(/*webpackMode:'eager'*/'../../DOM-finder/switch520.com');
					searchResult = getGameName();
				});
				await useMatchDomain({
					includes : [ 'switch618' ] ,
				} , async () => {
					const { getGameName } = await import(/*webpackMode:'eager'*/'../../DOM-finder/switch618.com');
					const {english,chinese} = getGameName();
					english ? ( searchResult = english ) : ( searchResult = chinese );
				});
				await useMatchDomain({
					includes : [ 'steamzg' ] ,
				} , async () => {
					const href = document.querySelectorAll('a').forEach((el) => {
						if(el.href && el.href.startsWith('https://store.steampowered.com/app')){
							window.open(el.href);
						}
					})
				});
				
				if(!searchResult){
					return;
				}
				window.open( `https://store.steampowered.com/search/?l=schinese&term=${encodeURIComponent(searchResult.trim()).replace(/%20/g, '+')}` );
			} }
		>
			去Steam搜索此游戏
		</button>
	</div>;
} );

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import React from 'react';
import { reaxper } from 'reaxes-react';
