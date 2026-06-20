<h1>📝 更新日志</h1>

<h2>🐛 7.2.1 版本更新</h2>
<ul>
    <li>修正 7.2.0 发布文档错误：恢复被误删的 7.1.0 补丁条目，7.2.0 仅保留 acgxj su-download 适配</li>
    <li>修正 Readme.md 中 7.2.0 放在错误文档区域的问题</li>
    <li>新增 docs/release-checklist.md 发布检查清单，防止文档结构错误再发</li>
</ul>

<h2>🎉 7.2.0 版本更新</h2>
<ul>
    <li>适配 acgxj su-download 新版 DOM（button[data-qr-url] base64 直链）</li>
</ul>

<h2>🎉 7.1.0 版本更新</h2>
<ul>
    <li>适配 gamer520 新版下载页 .bdp-container 卡片式布局，百度/夸克/迅雷/GOFILE 二维码自动转直链</li>
    <li>新增 GOFILE 海外盘、迅雷云盘网盘名称识别，直链标签不再显示空白</li>
    <li>修复新版下载页布局下提取码 DOM 被旧逻辑误删的问题，扫码用户可正常查看提取码</li>
</ul>


<h2>🐛 7.1.0 补丁 — ResizeObserver 循环错误修复</h2>
<ul>
    <li>修复 steamzg.com 等页面因 ResizeObserver 循环触发 webpack HMR overlay 红色错误遮罩的问题</li>
    <li>三层防御：capture-phase 拦截 + window.addEventListener 劫持 + CSS overlay 隐藏，适配 Tampermonkey Proxy 沙箱</li>
</ul>

<h2>✨ 7.0.17 版本更新</h2>
<ul>
    <li>新增 gamer520.com 文章页二维码转直链功能（已有功能仅在下载页生效，现扩展至文章页）</li>
</ul>

<h2>🎉 7.0.16 版本更新</h2>
<ul>
    <li>新增 fzgamer.com 站点功能：自动移除烦人贪吃蛇</li>
</ul>

<h2>🎉 7.0.15 版本更新</h2>
<ul>
    <li>修复了gamer520下载页可能会无限原地跳转的问题，如遇无限跳转则会从新标签页打开(由站长的wordpress配置和iframe cookie的限制共同导致)</li>
    <li>自动隐藏下载页的弹窗提示(但由于技术限制还是会闪一下)</li>
</ul>

<h2>🎉 7.0.12 版本更新</h2>
<ul>
    <li>更新了userscript description描述</li>
</ul>

<h2>🎉 7.0.11 版本更新</h2>
<ul>
    <li>修复了fzgamer.com主要区域卡片无法弹窗打开(因为站长修改了页面结构)
</li>
</ul>

<h2>🚀 7.0.10 版本更新</h2>
<ul>
    <li>新增 fzgamer.com 站点支持</li>
    <li>添加「去Steam搜索」按钮集成</li>
    <li>支持模态弹窗浏览功能</li>
    <li>优化页面布局和侧栏展示</li>
</ul>

<h2>🔧 7.0.9 版本更新</h2>
<ul>
    <li>修复 fzgamer.com main body 区域弹窗失效问题</li>
    <li>扩展选择器为 .widget-ajaxpager, .ajaxpager 兼容不同页面结构</li>
    <li>优化事件监听逻辑，移除调试代码避免 TypeError</li>
    <li>对 gamer520 其它位置的卡片适配弹窗浏览功能</li>
</ul>

<h2>🎊 7.0.0 版本更新</h2>
<ul>
    <li>全面适配了fzgamer.com,并优化了详情页结构</li>
</ul>

<h2>🎊 6.0.0 版本更新</h2>
<ul>
    <li>📱 二维码自动转直链 - 页面二维码自动识别并转换为直链</li>
    <li>🔍 Steam 划词搜索全面进化 - 优先使用中文名称搜索，命中率大幅提升</li>
    <li>🔗 链接拼接逻辑深度优化 - 修复多处 Bug，各类网盘地址处理更稳定</li>
    <li>⚙️ 功能调整 - 因 steamzg 站长修改规则，已移除对该站点的弹窗浏览支持</li>
</ul>

