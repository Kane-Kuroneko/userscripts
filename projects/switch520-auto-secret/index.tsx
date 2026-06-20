/**
 * Switch520 Auto Secret - 油猴脚本入口文件
 * 
 * 功能：优化多个游戏下载站（switch520、switch618、acgxj、steamzg等）
 * - 二维码转链接
 * - 无跳转弹窗浏览
 * - 自动填写密码
 * - 下载按钮直达下载地址页
 * - 去Steam查看游戏
 * 
 * 架构：ESM 模块化，分层设计
 * - core/：核心纯函数逻辑
 * - services/：业务服务层
 * - features/：React 特性层
 * - utils/：通用工具函数
 * - Components/：React 组件
 */

'use strict';

// 抑制 webpack 运行时错误 overlay 误捕浏览器内部 ResizeObserver 循环错误
// 该错误本质无害（Chrome 内部限制），但被 webpack HMR 的 window.addEventListener("error") 捕获后
// 会尝试渲染 DOM overlay，进而触发更多 ResizeObserver 通知，造成级联死循环
// capture-phase 在 at-target phase 之前触发，可通过 stopPropagation 阻止传播
window.addEventListener('error', (event) => {
	if (event.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
		console.log('[switch520-auto-secret] 抑制 ResizeObserver 循环错误');
		event.stopPropagation();
	}
}, true);

// 导入服务层
import { initAutoSecret } from './services/auto-secret.service';
import { initBaiduLinkService } from './services/baidu-link.service';
import { initDownloadBypassService } from './services/download-bypass.service';
import { initBaiduPanAutoSubmitService } from './services/baidupan-auto-submit.service';
import { initModalModeService } from './services/modal-mode.service';
import { initContextMenuService } from './services/context-menu.service';
import { initQrcodeConverterService } from './services/qrcode-converter.service';
import { initGamer520PopupBlocker } from './services/gamer520-popup-blocker.service';
import { initSearchOnSelect } from './features/search-on-select';
import { initSearchInSteam } from './features/search-in-steam';
import { moveElementsToVersionIntro, removeSidebarContentAboveHotRank, removeSnakeCanvas } from './DOM-finder/fzgamer.com';
import "./style.less";

// 开发环境：条件加载代理检测器
if (process.env.NODE_ENV === 'development') {
	require('./ProxyDetector');
	console.log('[switch520-auto-secret] 开发模式');
}

// 安全检查
if (!document.body) {
	console.warn('[switch520-auto-secret] document.body 不存在，脚本终止');
} else {
	// iframe 中设置所有链接在新窗口打开
	if (window.parent !== window.self) {
		document.querySelectorAll('a').forEach((a) => a.target = '_blank');
	}

	// 初始化各服务（添加错误边界，确保单个服务失败不影响其他功能）
	try { initAutoSecret(); } catch (err) { console.error('[switch520-auto-secret] initAutoSecret 失败:', err); }
	try { initBaiduLinkService(); } catch (err) { console.error('[switch520-auto-secret] initBaiduLinkService 失败:', err); }
	try { initDownloadBypassService(); } catch (err) { console.error('[switch520-auto-secret] initDownloadBypassService 失败:', err); }
	try { initBaiduPanAutoSubmitService(); } catch (err) { console.error('[switch520-auto-secret] initBaiduPanAutoSubmitService 失败:', err); }
	try { initModalModeService(); } catch (err) { console.error('[switch520-auto-secret] initModalModeService 失败:', err); }
	try { initContextMenuService(); } catch (err) { console.error('[switch520-auto-secret] initContextMenuService 失败:', err); }
	try { initQrcodeConverterService(); } catch (err) { console.error('[switch520-auto-secret] initQrcodeConverterService 失败:', err); }
	try { initGamer520PopupBlocker(); } catch (err) { console.error('[switch520-auto-secret] initGamer520PopupBlocker 失败:', err); }
	try { initSearchOnSelect(); } catch (err) { console.error('[switch520-auto-secret] initSearchOnSelect 失败:', err); }
	try { initSearchInSteam(); } catch (err) { console.error('[switch520-auto-secret] initSearchInSteam 失败:', err); }
	try { moveElementsToVersionIntro(); } catch (err) { console.error('[switch520-auto-secret] moveElementsToVersionIntro 失败:', err); }
	try { removeSidebarContentAboveHotRank(); } catch (err) { console.error('[switch520-auto-secret] removeSidebarContentAboveHotRank 失败:', err); }
	try { removeSnakeCanvas(); } catch (err) { console.error('[switch520-auto-secret] removeSnakeCanvas 失败:', err); }

	// 监听来自 iframe 的防死循环 postMessage
	window.addEventListener('message', (e) => {
		if (e.data?.source === 'S520_LOOP_GUARD' && e.data?.type === 'OPEN_TAB') {
			console.log('[switch520-auto-secret] postMessage 触发新标签页打开:', e.data.url);
			window.open(e.data.url, '_blank');
		}
	});
}
