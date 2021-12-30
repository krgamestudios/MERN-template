//plugins
const { DefinePlugin } = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

//libraries
const path = require('path');

//the exported config function
module.exports = ({ production, development, local, analyze }) => {
	return {
		mode: production ? "production" : "development",
		entry: path.resolve(__dirname, 'client', 'client.jsx'),
		output: {
			path: path.resolve(__dirname, 'public'),
			publicPath: '/',
			filename: '[name].[chunkhash].js',
			sourceMapFilename: '[name].[chunkhash].js.map'
		},
		devtool: production ? false : 'eval-source-map',
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
			]
		},
		plugins: [
			new DefinePlugin({
				'process.env': {
					'PRODUCTION': production,
					'NEWS_URI': production ? `"${process.env.NEWS_URI}"` : development ? '"https://dev-news.krgamestudios.com"' : '"http://localhost:3100"',
					'AUTH_URI': production ? `"${process.env.AUTH_URI}"` : development ? '"https://dev-auth.krgamestudios.com"' : '"http://localhost:3200"',
					'CHAT_URI': production ? `"${process.env.CHAT_URI}"` : development ? '"https://dev-chat.krgamestudios.com"' : '"http://localhost:3300"',
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
			hot: true,
			host: 'localhost',
			port: 3001,
			client: {
				overlay: {
					errors: true,
					warnings: true,
				},
			},

			watchFiles: {
				options: {
					ignored: ['node_modules/**']
				}
			},

			proxy: {
				'/api': {
					target: 'http://localhost:3000'
				}
			},

			static: '/public',

			historyApiFallback: true
		}
	}
};
