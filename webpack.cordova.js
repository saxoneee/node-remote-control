var path = require('path'),
    WebpackShellPlugin = require('webpack-shell-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin'),
    RemoveWebpackPlugin = require('remove-webpack-plugin');

var _wwwDir = path.join(__dirname, 'src', 'www'),
    _tmpDir = path.join(__dirname, '.tmp','cordova'),
    _tmpSrcDir = path.join(_tmpDir, 'www');
console.log(path.join(_tmpDir, 'main.js'));
module.exports = {
	entry: './index.js',
	output: {
		path: _tmpDir,
	},

    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: '.tmp/styles/',
                to: _tmpSrcDir + '/styles'
            },{
                from: _wwwDir,
                to: _tmpSrcDir
            },{
                from: 'bower',
                to: _tmpSrcDir
            },{
                from: path.join(__dirname, 'config.xml'),
                to: _tmpDir
            },{
                from: path.join(__dirname, 'package.json'),
                to: _tmpDir
            }]
        }),
        new RemoveWebpackPlugin([
            path.join(_tmpDir, 'main.js')
        ]),
		new WebpackShellPlugin({
			onBuildEnd: 'cd .tmp/cordova && npm run _prepare'
		})
	]
};
