//plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

//libraries
const path = require('path');

//the exported config function
module.exports = ({ production, analyzer }) => {

	return {
		mode: production ? "production" : "development",
		entry: path.resolve(__dirname, 'client', 'client.jsx'),
		output: {
			path: path.resolve(__dirname, 'public'),
			filename: '[name].[chunkhash].js',
			sourceMapFilename: '[name].[chunkhash].js.map'
		},
		devtool: 'source-map',
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
								plugins: ['react-loadable/babel', '@babel/plugin-syntax-dynamic-import']
							}
						}
					]
				}
			]
		},
		plugins: [
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: ['*', '!content*']
			}),
			new HtmlWebpackPlugin({
				template: "./client/template.html",
				minify: {
					collapseWhitespace: production,
					removeComments: production,
					removeAttributeQuotes: production
				}
			}),
			new BundleAnalyzerPlugin({
				analyzerMode: analyzer ? 'server' : 'disabled'
			})
		]
	};
};
