const [ projectName ] = process.argv.slice( 2 );


const RepoRoot = process.cwd();

import(pathToFileURL( path.join( RepoRoot , 'projects' , projectName , 'webpack.partial.ts' ) ).href).
then( async ( { default : partialConf } ) => {
	
	const conf = merge( baseConf , devConf , partialConf );
	const {compiler,stats} = await runWebpack( conf );
	const devServer = new WebpackDevServer(conf.devServer,compiler);
	await devServer.start();
	console.log(`dev-server启动成功 , 从此链接安装tamperMonkey代理脚本: http://127.0.0.1:${conf.devServer.port}/main.proxy.user.js`);
} ).catch( e => {
	console.error('dev-server启动失败');
	console.error( e );
} );


function runWebpack(config) {
	return new Promise<{stats:Stats,compiler:Compiler}>((resolve, reject) => {
		const compiler = webpack(config, (err, stats) => {
			if (err || stats.hasErrors()) {
				reject(err || stats.toString());
			} else {
				resolve({stats,compiler});
			}
		});
	});
}

import WebpackDevServer from 'webpack-dev-server';
import { Compiler , Stats , webpack } from 'webpack';
import baseConf from '../webpack.base';
import devConf from '../webpack.dev';
import { merge } from 'webpack-merge';
import { pathToFileURL } from 'url';
import process from 'process';
import path from 'path';
