//plugins
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

//libraries
const path = require('path');

//the exported config function
module.exports = ({ production, analyze }) => {
	return {
		mode: production ? "production" : "development",
		entry: path.resolve(__dirname, 'client', 'client.jsx'),
		output: {
			path: path.resolve(__dirname, 'public'),
			publicPath: '/',
			filename: '[name].[chunkhash].js',
			sourceMapFilename: '[name].[chunkhash].js.map'
		},
		devtool: production ? 'source-map' : 'eval-source-map',
		resolve: {
			extensions: ['.js', '.jsx']
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules)/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env', '@babel/preset-react'],
								plugins: ['@babel/plugin-syntax-dynamic-import']
							}
						}
					]
				},
				{
					test: /\.(css)$/,
					use: ['style-loader', 'css-loader']
				},
				{
					test: /\.(md)$/,
					use: [
						{
							loader: 'raw-loader'
						},
					],
				},
			]
		},
		plugins: [
			new DefinePlugin({
				'process.env': {
					'PRODUCTION': production,
					'NEWS_URI': production ? `"${process.env.NEWS_URI}"` : '"https://dev-news.krgamestudios.com"',
					'AUTH_URI': production ? `"${process.env.AUTH_URI}"` : '"https://dev-auth.krgamestudios.com"',
					'CHAT_URI': production ? `"${process.env.CHAT_URI}"` : '"https://dev-chat.krgamestudios.com"',
				}
			}),
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['*', '!content*']
			}),
			new HtmlWebpackPlugin({
				template: './client/template.html',
				minify: {
					collapseWhitespace: production,
					removeComments: production,
					removeAttributeQuotes: production
				}
			}),
			new CompressionPlugin({
				filename: "[path][base].gz[query]",
				algorithm: "gzip",
				test: /\.js$|\.css$/,
				minRatio: 0.8
			}),
			new BundleAnalyzerPlugin({
				analyzerMode: analyze ? 'server' : 'disabled'
			})
		],
		devServer: {
			contentBase: path.resolve(__dirname, 'public'),
			compress: true,
			port: 3001,
			proxy: {
				'/api/': 'http://localhost:3000/'
			},
			overlay: {
				errors: true
			},
			stats: {
				colors: true,
				hash: false,
				version: false,
				timings: false,
				assets: false,
				chunks: false,
				modules: false,
				reasons: false,
				children: false,
				source: false,
				errors: true,
				errorDetails: false,
				warnings: true,
				publicPath: false
			},
			host: '0.0.0.0',
			disableHostCheck: true,
			clientLogLevel: 'silent',
			historyApiFallback: true,
			hot: true,
			injectHot: true
		},
		watchOptions: {
			ignored: /(node_modules)/
		}
	}
};

