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
				let searchResult: string | null = null;
				let openedDirect = false;

				await useMatchDomain({
					includes: ['gamer520.com'],
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
					includes: ['steamzg'],
				}, async () => {
					for (const el of Array.from(document.querySelectorAll('a'))) {
						if (el.href?.startsWith('https://store.steampowered.com/app')) {
							window.open(normalizeSteamAppUrl(el.href));
							openedDirect = true;
							return;
						}
					}
				});

				await useMatchDomain({
					includes: ['fzgamer'],
				}, async () => {
					const { resolveSteamBuyUrl, getGameName } = await import(
						/*webpackMode:'eager'*/'../../DOM-finder/fzgamer.com'
					);
					const steamUrl = resolveSteamBuyUrl();
					if (steamUrl) {
						window.open(normalizeSteamAppUrl(steamUrl));
						openedDirect = true;
						return;
					}
					// 无 Steam 正版链接时，用游戏名走商店搜索
					searchResult = getGameName() || null;
				});

				if (openedDirect || !searchResult) {
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
import { buildSteamSearchUrl, normalizeSteamAppUrl } from '../../utils/steam-search';
import React from 'react';
import { reaxper } from 'reaxes-react';
