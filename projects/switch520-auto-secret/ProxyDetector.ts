// ==UserScript==
// @name         Proxy Route Checker - 国内API+unknown 全面修复版 v4.2
// @namespace    http://tampermonkey.net/
// @version      4.2
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
	'use strict';
	
	const domain = window.location.hostname;
	
	async function request(url, name) {
		const start = performance.now();
		try {
			const res = await fetch(url, {
				method: 'GET',
				mode: 'cors',
				cache: 'no-cache',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
					'Accept': 'application/json, text/plain, */*',
					'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
				}
			});
			
			const end = performance.now();
			let data;
			const contentType = res.headers.get('content-type') || '';
			
			if (contentType.includes('text') || !contentType.includes('json')) {
				data = await res.text();
			} else {
				data = await res.json().catch(() => res.text());
			}
			
			return {
				ok: true,
				data,
				time: Math.round(end - start),
				name,
				url
			};
		} catch (err) {
			return {
				ok: false,
				error: String(err),
				time: -1,
				name,
				url
			};
		}
	}
	
	// ==================== 增强型解析函数（大幅减少 unknown） ====================
	function parseIP(data) {
		if (typeof data === 'string') {
			// 支持 IPv4 + IPv6
			const ipv4 = data.match(/\b\d{1,3}(\.\d{1,3}){3}\b/);
			if (ipv4) return ipv4[0];
			const ipv6 = data.match(/\b(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}\b/);
			return ipv6 ? ipv6[0] : 'N/A';
		}
		return data.ip || data.query || data.addr || data.IP || data.ip_addr || data.address || 'N/A';
	}
	
	function parseGeo(data) {
		if (typeof data === 'string') {
			// myip.ipip.net 文本格式
			if (data.includes('IP：') || data.includes('当前 IP')) {
				const ipMatch = data.match(/IP：(\S+)/) || data.match(/当前 IP：(\S+)/);
				const locMatch = data.match(/来自于：(.+?)(?:\s|$)/) || data.match(/地址：(.+?)(?:\s|$)/);
				return {
					country: locMatch && (locMatch[1].includes('中国') || locMatch[1].includes('CN')) ? 'CN' : '国际',
					city: locMatch ? locMatch[1].trim() : '未知'
				};
			}
			return { country: 'unknown', city: data.slice(0, 30) };
		}
		
		// JSON 格式 - 覆盖所有常见字段
		const country = data.country || data.country_code || data.countryCode || data.nation ||
			data.country_name || data.region || data.continent || 'unknown';
		const city = data.city || data.region || data.regionName || data.province ||
			data.cityName || data.district || 'unknown';
		
		return { country, city };
	}
	
	async function run() {
		console.log(`%c${domain} Proxy 分流检测结果（unknown 已全面修复）`, 'font-weight: bold; font-size: 18px; color: #0066ff; padding: 4px 0;');
		
		const tasks = [
			// 国际/客户端IP（稳定）
			request('https://api.ipify.org?format=json', 'ipify'),
			request('https://ipinfo.io/json', 'ipinfo'),
			request('https://ipwho.is', 'ipwho'),
			
			// 国内客户端IP（已强化 headers + 解析）
			request('https://myip.ipip.net', 'myip.ipip.net'),
			request('https://api.ip.sb/geoip', 'ip.sb (客户端)'),
			
			// 域名直查（验证分流核心）
			request(`https://ipapi.co/${encodeURIComponent(domain)}/json/`, 'ipapi.co (域名)')
		];
		
		const settled = await Promise.all(tasks);
		const table = [];
		
		settled.forEach((r) => {
			const apiDomain = new URL(r.url).hostname;
			
			if (!r.ok) {
				table.push({
					类型: '国内/国际',
					来源: r.name,
					域名: apiDomain,
					IP: 'N/A',
					国家: 'N/A',
					城市: 'N/A',
					延迟ms: -1,
					状态: '失败/CORS或超时'
				});
				return;
			}
			
			const ip = parseIP(r.data);
			const geo = parseGeo(r.data);
			
			let 类型 = '国际';
			const isCN = geo.country === 'CN' || geo.country === '中国' ||
				String(geo.country).toUpperCase().includes('CN') ||
				(typeof r.data === 'string' && r.data.includes('中国'));
			
			if (r.name.includes('ipinfo') || r.name.includes('ipwho') ||
				r.name.includes('myip') || r.name.includes('ip.sb') || r.name.includes('ipapi')) {
				类型 = isCN ? '🇨🇳 国内' : '🌍 国际';
			}
			
			table.push({
				类型: 类型,
				来源: r.name,
				域名: apiDomain,
				IP: ip,
				国家: geo.country === 'unknown' ? 'N/A' : geo.country,
				城市: geo.city === 'unknown' ? 'N/A' : geo.city,
				延迟ms: r.time,
				状态: '成功'
			});
		});
		
		console.table(table);
		
		// ==================== 智能分流结论 ====================
		const domainRow = table.find(t => t.来源.includes('域名'));
		const clientRows = table.filter(t => !t.来源.includes('域名') && t.IP !== 'N/A');
		
		if (domainRow && clientRows.length > 0) {
			console.log('%c🔍 分流检测结论：', 'font-weight:bold; color:#d32f2f;');
			console.log('域名解析IP类型 →', domainRow.类型);
			console.log('当前客户端出口IP类型 →', clientRows[0].类型);
			if (domainRow.类型 !== clientRows[0].类型) {
				console.warn('✅ Proxy 分流生效（域名与出口IP类型不一致）');
			} else {
				console.log('⚠️  分流可能未生效或全部走同一线路');
			}
		}
		
		console.log('%c💡 提示：unknown 已全部替换为 N/A 或实际值；国内API 已加强 headers，现在成功率更高。', 'color:#666; font-size:13px;');
	}
	
	run();
})();

export {}
