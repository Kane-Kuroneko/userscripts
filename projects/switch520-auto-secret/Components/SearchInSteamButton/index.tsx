export const SearchInSteam = reaxper(() => {

	return <div>
		<button
			style={{
				backgroundColor: '#20a0ff',
				color: '#eee',
				width: '100%',
				padding: '12px 18px',
				borderRadius: '4px',
				border: 'none',
				cursor: 'pointer',
				fontSize: '16px',
				letterSpacing: '2px',
				margin: '0 0 24px 0'
			}}
			onClick={async () => {
				// fzgamer：有「正版购买」按钮就直接点，由站点（+二维码转链）处理
				let clickedBuy = false;
				await useMatchDomain({
					includes: ['fzgamer'],
				}, async () => {
					const { clickGenuinePurchaseButton } = await import(
						/*webpackMode:'eager'*/'../../DOM-finder/fzgamer.com'
					);
					clickedBuy = clickGenuinePurchaseButton();
				});
				if (clickedBuy) return;

				// 其他站：页面已有 Steam 商品直链则打开
				const directSteamUrl = findPageSteamStoreUrl();
				if (directSteamUrl) {
					window.open(normalizeSteamAppUrl(directSteamUrl));
					return;
				}

				// 否则按站点提取游戏名，走商店搜索
				let searchResult: string | null = null;

				await useMatchDomain({
					includes: [...GAMER520_INCLUDES],
				}, async () => {
					const { getGameName } = await import(/*webpackMode:'eager'*/'../../DOM-finder/switch520.com');
					searchResult = getGameName();
				});

				await useMatchDomain({
					includes: ['switch618'],
				}, async () => {
					const { getGameName } = await import(/*webpackMode:'eager'*/'../../DOM-finder/switch618.com');
					const { english, chinese } = getGameName();
					searchResult = english || chinese || null;
				});

				await useMatchDomain({
					includes: ['fzgamer'],
				}, async () => {
					const { getGameName } = await import(/*webpackMode:'eager'*/'../../DOM-finder/fzgamer.com');
					searchResult = getGameName() || null;
				});

				if (!searchResult) {
					return;
				}

				window.open(buildSteamSearchUrl(searchResult));
			}}
		>
			去Steam搜索此游戏
		</button>
	</div>;
});

import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import { GAMER520_INCLUDES } from '../../core/domain-matcher';
import {
	buildSteamSearchUrl,
	findPageSteamStoreUrl,
	normalizeSteamAppUrl,
} from '../../utils/steam-search';
import React from 'react';
import { reaxper } from 'reaxes-react';
