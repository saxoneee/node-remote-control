var path = require('path'),
    WebpackShellPlugin = require('webpack-shell-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin');

var _wwwDir = path.join(__dirname, 'src', 'www'),
    _destDir = path.join(__dirname, 'www');

module.exports = {
	entry: './index.js',
	output: {
		path: _destDir,
	},

    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: '.tmp/styles/',
                to: _destDir + '/styles'
            },{
                from: _wwwDir,
                to: _destDir
            },{
                from: 'bower',
                to: _destDir
            }]
        }),
		new WebpackShellPlugin({
			onBuildEnd: '"./node_modules/.bin/cordova" run'
        })
	]
};
