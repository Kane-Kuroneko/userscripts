const { DefinePlugin } = webpack;
const dev : Configuration & {devServer?:DevServerConfiguration} = {
	mode : 'development' ,
	devtool : 'cheap-source-map' ,
	devServer : {
		allowedHosts : 'all',
		hot:false,
		devMiddleware : {
			writeToDisk:true
		},
		client : {
			reconnect : true
		},
	},
	plugins : [
		new DefinePlugin({
			__DEV__ : JSON.stringify(true),
		}),
	],
};


import webpack from 'webpack';
import { Configuration } from 'webpack/types';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server/types/lib/Server';

export default dev;
