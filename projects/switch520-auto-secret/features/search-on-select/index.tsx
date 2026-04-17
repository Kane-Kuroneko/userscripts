/**
 * 划词搜索特性
 * 在游戏网站中选中文字后，弹出 Steam 搜索提示
 * 使用 reaxes 状态管理
 */

import { notification } from 'antd';
import { reaxper } from 'reaxes-react';
import { obsReaction, createReaxable } from 'reaxes';
import { createRoot } from 'react-dom/client';
import { useMatchDomain } from '#generic-svc/utils/useMatchDomain';
import "./style.module.less";

const notificationKey = 'search-on-steam';
const getSelection = () => window.getSelection().toString();

const { store, setState, mutate } = createReaxable({
	open: false,
	selection: '',
});

obsReaction((first) => {
	if (first) return;
	const { selection } = store;
	if (selection) {
		setState({ open: true });
	} else {
		setState({ open: false });
	}
}, () => [store.selection]);

const App = reaxper(() => {
	const [api, contextHolder] = notification.useNotification();
	const { open, selection } = store;
	
	if (open) {
		api.open({
			message: <a
				style={{ color: 'black', fontSize: '18px', display: "inline-block" }}
				onClick={(e) => {
					e.preventDefault();
					window.open(`https://store.steampowered.com/search/?l=schinese&term=${encodeURIComponent(selection.trim()).replace(/%20/g, '+')}`);
				}}
			>
				Steam搜索：
				<div style={{
					color: '#7f7fff',
					display: 'flex',
					maxHeight: '30px',
					overflow: 'hidden',
				}}>{selection}</div>
			</a>,
			placement: 'top',
			key: notificationKey,
			duration: null,
			closable: false,
			onClose: null,
			closeIcon: null
		});
	} else {
		api.destroy(notificationKey);
	}
	return contextHolder;
});

/**
 * 初始化划词搜索功能
 */
export function initSearchOnSelect(): void {
	useMatchDomain({
		includes: ['gamer520', 'switch618', 'steamzg', 'xxxxx520']
	}, () => {
		document.addEventListener('mouseup', (evt) => {
			if ((evt.target as HTMLElement).className?.includes?.('ant-notification')) {
				return;
			}
			const selection = getSelection();
			setState({ selection });
		});

		const container = document.createElement('div');
		document.body.append(container);
		const reactRoot = createRoot(container);
		reactRoot.render(<App />);
	});
}
