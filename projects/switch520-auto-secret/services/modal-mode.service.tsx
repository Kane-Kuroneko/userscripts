/**
 * 模态框浏览服务
 * 提供窗口模式打开下载页面的功能，通过 Tampermonkey 菜单切换开关
 */

import { OpenInModal } from '../Components/OpenInModal';
import { createRoot } from 'react-dom/client';

/**
 * 初始化模态框浏览服务
 */
export function initModalModeService(): void {
	if (location.href.includes('wp-content/plugins/erphpdown/download.php')) {
		return;
	}

	registerMenuCommand();
	initModalMode();
}

/**
 * 注册 Tampermonkey 菜单命令
 * 用于切换模态框模式的开启/关闭状态
 */
async function registerMenuCommand(): Promise<void> {
	const modalMode = await GM.getValue('options::modal-mode', true);

	GM.registerMenuCommand(
		`窗口模式打开下载页面:${modalMode ? '✅已开启' : '❌已关闭'}`,
		async () => {
			await GM.setValue('options::modal-mode', !await GM.getValue('options::modal-mode'));
			await registerMenuCommand();
			location.reload();
		}
	);
}

/**
 * 初始化模态框模式
 * 如果开启，则渲染 OpenInModal 组件
 */
async function initModalMode(): Promise<void> {
	const isEnabled = await GM.getValue('options::modal-mode', true);
	if (!isEnabled) return;

	const div = document.createElement('div');
	const reactRoot = createRoot(div);
	reactRoot.render(<OpenInModal />);
}
