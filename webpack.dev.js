var path = require('path'),
	WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
	},

	devServer: {
		contentBase: [
			path.join(__dirname, 'src', 'www'),
			path.join(__dirname, 'bower'),
			path.join(__dirname, '.tmp'),
		],
		port: 8000,
		proxy: [{
			path: '/api/v1',
			target: 'http://localhost:8008',
			changeOrigin: true
		}]
	},

	plugins: [
		new WebpackShellPlugin({
			onBuildStart: 'node-sass src/www/styles/remote-control.scss .tmp/styles/remote-control.css',
			onBuildEnd: 'node ./src/serv/app.js'
		})
	]
};
