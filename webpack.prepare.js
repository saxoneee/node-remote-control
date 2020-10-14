var path = require('path'),
	WebpackShellPlugin = require('webpack-shell-plugin');
	
module.exports = {
	// entry: './index.js',
	// output: {
	// 	path: path.resolve(__dirname, 'build'),
	// },

	plugins: [
		new WebpackShellPlugin({
			onBuildStart: 'mkdir -p www && cordova prepare'
		})
	]
};
