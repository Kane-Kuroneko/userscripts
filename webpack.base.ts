const { ProvidePlugin } = webpack;
const conf: Configuration = {
	output : {
		publicPath : '/' ,
	} ,
	resolve : {
		extensions : [ '.ts' , '.tsx' , '.js' , '.jsx' , '.json' ] ,
		alias : {
			'#generic-svc' : path.resolve('./generic-services')
		} ,
	} ,
	externals : {
		'lodash' : '_' ,
		'react' : 'React' ,
		'react-dom' : 'ReactDOM' ,
		'antd' : 'antd' ,
		'mobx' : 'mobx' ,
		'dayjs' : 'dayjs' ,
	} ,
	devtool : false ,
	module : {
		rules : [
			{
				test : /(j|t)sx?$/i ,
				use : "babel-loader" ,
				exclude : /node_modules/ ,
			} ,
			{
				test : /\.css$/i ,
				use : [
					'style-loader' ,
					'css-loader' ,
				] ,
			} ,
			{
				test : /\.less$/i ,
				use : [
					'style-loader' ,
					'css-loader' ,
					{
						loader : 'less-loader' ,
						options : {
							lessOptions : {
								javascriptEnabled : true ,
							} ,
						} ,
					} ,
				] ,
			} ,
		] ,
	} ,
	plugins : [
		new webpack.ProvidePlugin( {
			React : [ 'react' ] ,
			ReactDOM : [ 'react-dom' ] ,
			dayjs : [ 'dayjs' ] ,
			
		} ) ,
		new webpack.DefinePlugin( {
			'window.React' : 'React' ,  // 显式替换 React
			'window.ReactDOM' : 'ReactDOM' ,  // 显式替换 ReactDOM
		} ) ,
	] ,
};

import webpack from 'webpack';
import { Configuration } from 'webpack/types';
import path from 'node:path';

export default conf;
