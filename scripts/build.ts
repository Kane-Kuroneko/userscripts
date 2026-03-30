const [ projectName ] = process.argv.slice( 2 );


const RepoRoot = process.cwd();

import(pathToFileURL( path.join( RepoRoot , 'projects' , projectName , 'webpack.partial.ts' ) ).href).
then( async ( { default : partialConf } ) => {
	
	const conf = merge( baseConf , prodConf , partialConf );
	const {compiler,stats} = await runWebpack( conf );
	console.log((chalk.green)(`${projectName}打包完成,成果在dist目录下,正在监听变动以重打包`));
} ).catch( e => {
	console.error((chalk.red)('打包失败'));
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


import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import { Compiler , Stats , webpack } from 'webpack';
import baseConf from '../webpack.base';
import prodConf from '../webpack.prod';
import { merge } from 'webpack-merge';
import { pathToFileURL } from 'url';
import process from 'process';
import path from 'path';
