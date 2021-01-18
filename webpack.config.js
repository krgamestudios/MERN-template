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
		entry: path.resolve(__dirname, 'client', 'client.js'),
		output: {
			path: path.resolve(__dirname, 'public'),
			filename: '[name].[chunkhash].js'
		},
		resolve: {
			extensions: ['.js', '.jsx']
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
