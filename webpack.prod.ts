const { DefinePlugin } = webpack;
const conf : Configuration = {
	mode : 'production' ,
	devtool : false ,
	plugins : [
		new DefinePlugin({
			__DEV__ : JSON.stringify(false),
		}),
	],
	optimization : {
		minimize : false,
	},
};

import webpack from 'webpack';
import { Configuration } from 'webpack/types';

export default conf;
