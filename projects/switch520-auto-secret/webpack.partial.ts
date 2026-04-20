const conf: Configuration = {
	entry : './projects/switch520-auto-secret/index.tsx' ,
	output : {
		path : path.join( process.cwd() , './projects/switch520-auto-secret/dist' ) ,
	} ,
	devServer : {
		port : 12300 ,
		hot:true,
		client:{
			webSocketURL: {
				hostname: 'localhost',
				port: 12300,
				protocol: 'ws'
			}
		}
	} ,
	plugins : [
		
		new UserscriptPlugin({
			headers : {
				name : 'switch520-auto-secret' ,
				version : '7.0.0' ,
				author : 'Kane' ,
				description : '优化多个游戏下载站,包括switch520、switch618、acgxj,steamzg等:二维码转链接|无跳转弹窗浏览|自动填写密码|下载按钮直达下载地址页|去Steam查看游戏' ,
				namespace : 'http://tampermonkey.net/' ,
				icon : 'https://www.switch618.com/wp-content/uploads/2024/05/23154031569.webp',
				license : 'MIT',
				match : [
					"*://dl.xxxxx520.cc/*" ,
					"*://www.xxxxx520.org/*" ,
					"*://acgxj.com/*" ,
					"*://acfb.top/*" ,
					"*://*.steamzg.com/*" ,
					"*://*.gamers520.com/*" ,
					"*://*.switch618.com/*" ,
					"*://*.gamer520.com/*" ,
					"*://download.gamer520.com/*" ,
					"*://download.espartasr.com/*" ,
					"*://download.freer.blog/*" ,
					"*://www.freer.blog/*" ,
					"*://*.xxxxx528.com/*" ,
					"*://www.efemovies.com/*" ,
					"*://www.espartasr.com/*" ,
					"*://www.piclabo.xyz/*" ,
					"*://like.gamer520.com/*" ,
					"*://pan.baidu.com/*" ,
					"*://www.fzgamer.com/*" ,
					"*://fzgamer.com/*" ,
				] ,
				require : [
					'https://unpkg.com/react@18.2.0/umd/react.production.min.js' ,
					'https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js' ,
					'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js' ,
					'https://unpkg.com/mobx@6.13.5/dist/mobx.umd.production.min.js' ,
					'https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.13/dayjs.min.js',
					'https://cdnjs.cloudflare.com/ajax/libs/antd/5.22.7/antd.min.js' ,
				],
				grant:[
					'GM.registerMenuCommand',
					'GM.getValue',
					'GM.setValue',
				],
				resource : {
					antdCSS : 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.22.7/reset.min.css'
				}
			} ,
			proxyScript : {
				baseURL : 'http://127.0.0.1:12300' ,
				filename : '[basename].proxy.user.js' ,
			} ,
		})
	]
};


import { UserscriptPlugin } from 'webpack-userscript';
import { Configuration } from 'webpack';
import path from 'node:path';
import process from 'node:process';

export default conf;
