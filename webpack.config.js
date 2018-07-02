const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './components/index.js',
	output: {
		filename: '[name].js',
		path: path.resolve('./dist'),
		libraryTarget: 'commonjs-module',
	},
	externals: [nodeExternals()],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: 'babel-loader',
				exclude: [/node_modules/],
			},
			{
				test: /\.less$/,
				oneOf: [
					{
						test: /\.m\.less$/,
						use: ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: [
								{
									loader: 'css-loader',
									options: {
										importLoaders: 2,
										modules: true,
										localIdentName: '[name]__[local].[hash:base64:8]',
									},
								},
								'postcss-loader',
								'less-loader',
							],
						}),
					},
					{
						use: ExtractTextPlugin.extract({ use: ['css-loader?url=false', 'less-loader'] }),
					},
				],
			},
		],
	},
	plugins: [new ExtractTextPlugin({ filename: 'styles.css' })],
};
