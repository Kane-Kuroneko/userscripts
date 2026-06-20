 # ResizeObserver loop completed with undelivered notifications — 分析与修复
 
 ## 问题描述
 
 访问 `steamzg.com` 等站点时，Tampermonkey 用户脚本在控制台反复报出以下运行时错误，并触发 webpack HMR 红色 overlay 遮挡页面：
 
 ```
 Uncaught runtime errors:
 ×
 ERROR
 ResizeObserver loop completed with undelivered notifications.
     at handleError (userscript.html:21606:58)
     at Proxy.<anonymous> (userscript.html:21630:7)
 ```
 
 ## 根因分析
 
 ### 1. 错误的本质
 
 `ResizeObserver loop completed with undelivered notifications.` 是 Chrome 浏览器内部机制产生的非致命通知。Chrome 的 ResizeObserver 实现限制了一帧内最多传递一次观察回调，如果回调触发的布局变化导致更多元素尺寸变化，超出单帧容量时就会抛出此警告。该错误本身无害，不会导致任何功能异常。
 
 ### 2. 为什么变成"运行时错误"
 
 问题不在错误本身，而在于 webpack dev-server/client/overlay 模块的工作方式：
 
 - webpack 的 HMR overlay 在 `window` 上注册了 `"error"` 事件监听（`window.addEventListener('error', ...)`）
 - 当 Chrome 内部抛出上述 ResizeObserver 通知时，它表现为一个 `ErrorEvent` 被投递到 `window` 的 `"error"` 事件
 - webpack overlay 的 `handleError` 捕获后，尝试渲染 DOM overlay（`#webpack-dev-server-client-overlay`）
 - DOM overlay 的插入/显示导致更多布局变化，进而触发新的 ResizeObserver 通知
 - 形成级联死循环：Chrome 内部通知 → webpack 捕获 → 渲染 DOM → 布局变化 → 新通知 → ...
 
 ### 3. Tampermonkey 沙箱的特殊性
 
 Tampermonkey 的沙箱实现使用了 `Proxy` 包装 `window` 对象。当脚本使用 `@grant` 获取特权（如 `GM.*` API）时，`window.addEventListener` 在沙箱初始化时已被缓存引用。这意味着：
 
 - 通过修改 `EventTarget.prototype.addEventListener` 来拦截错误事件在 Tampermonkey 沙箱中无效
 - 需要直接劫持沙箱上下文中 `window.addEventListener` 这个自有属性
 
 ## 修复方案
 
 ### Layer 1 — `index.tsx` capture-phase 错误拦截
 
 在用户脚本入口文件（`index.tsx`）顶部、所有导入语句之前注册一个 capture-phase（第三个参数 `true`）的错误事件监听：
 
 ```typescript
 window.addEventListener('error', (event) => {
    if (event.message?.includes('ResizeObserver loop completed with undelivered notifications')) {
       console.log('[switch520-auto-secret] 抑制 ResizeObserver 循环错误');
       event.stopPropagation();
    }
 }, true);
 ```
 
 - `capture: true` 确保监听在 at-target 阶段之前触发
 - `event.stopPropagation()` 阻止事件传播到 webpack overlay 的冒泡阶段监听器
 - 需要位于所有 `import` 语句之前，因为 webpack 注入的 bootstrap 代码在运行时才执行
 
 ### Layer 2 — `webpack.partial.ts` BannerPlugin 注入 window.addEventListener 劫持
 
 在 webpack 打包产物的最顶端（@require 等 Userscript metadata 之后）注入代码，直接劫持 `window.addEventListener`：
 
 ```javascript
 /* suppress ResizeObserver loop errors - layer 1: intercept window.addEventListener */
 {
    const __a = window.addEventListener;
    window.addEventListener = function(t, l, o) {
       if (t === "error") {
          const w = function(e) {
             if (e instanceof ErrorEvent
                && typeof e.message === "string"
                && e.message.indexOf("ResizeObserver loop completed") !== -1) {
                return; // 静默过滤
             }
             return l.call(this, e);
          };
          return __a.call(this, t, w, o);
       }
       return __a.call(this, t, l, o);
    }
 }
 ```
 
 - 直接修改 `window.addEventListener` 自有属性，绕过 `EventTarget.prototype` 在 Tampermonkey 沙箱中的缓存问题
 - 为 `"error"` 事件类型包裹一层过滤器，对 ResizeObserver 相关消息静默放行
 - 对其他事件类型不做改动，保持透明
 
 ### Layer 3 — `webpack.partial.ts` BannerPlugin CSS 兜底
 
 在上述代码之后立即注入 CSS 隐藏 overlay DOM 元素：
 
 ```javascript
 {
    var __s = document.createElement("style");
    __s.textContent = "#webpack-dev-server-client-overlay{display:none!important}";
    document.documentElement.appendChild(__s);
 }
 ```
 
 - 作为 reactive fallback，即使错误事件未被 Layer 1/2 拦截，overlay 也不会显示
 - 阻断因 DOM 渲染导致的级联通知
 
 ## 涉及文件
 
 | 文件 | 改动 |
 |------|------|
 | `index.tsx` | 新增 capture-phase error 监听，在 webpack bootstrap 之前拦截 ResizeObserver 错误传播 |
 | `webpack.partial.ts` | 新增 `webpack.BannerPlugin`，注入 addEventListener 劫持 + CSS overlay 隐藏（raw banner） |
 | `dist/main.user.js` | 构建产物，由 webpack 自动生成（gitignored，无需跟踪） |
 
 ## 验证
 
 - 重新加载目标页面，红色 overlay 不再出现
 - 控制台可观察到 `[switch520-auto-secret] 抑制 ResizeObserver 循环错误` 日志
 - 所有既有功能（自动填密、二维码转直链等）正常运行，无回归
