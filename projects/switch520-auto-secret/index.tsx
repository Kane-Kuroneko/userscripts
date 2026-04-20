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

// 导入服务层
import { initAutoSecret } from './services/auto-secret.service';
import { initBaiduLinkService } from './services/baidu-link.service';
import { initDownloadBypassService } from './services/download-bypass.service';
import { initBaiduPanAutoSubmitService } from './services/baidupan-auto-submit.service';
import { initModalModeService } from './services/modal-mode.service';
import { initContextMenuService } from './services/context-menu.service';
import { initQrcodeConverterService } from './services/qrcode-converter.service';
import { initSearchOnSelect } from './features/search-on-select';
import { initSearchInSteam } from './features/search-in-steam';
import { moveElementsToVersionIntro, removeSidebarContentAboveHotRank } from './DOM-finder/fzgamer.com';
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

	// 初始化各服务
	initAutoSecret();
	initBaiduLinkService();
	initDownloadBypassService();
	initBaiduPanAutoSubmitService();
	initModalModeService();
	initContextMenuService();
	initQrcodeConverterService();
	initSearchOnSelect();
	initSearchInSteam();
	moveElementsToVersionIntro();
	removeSidebarContentAboveHotRank();
}
