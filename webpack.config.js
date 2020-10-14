var path = require('path');

module.exports = {
	entry: './index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
	},

	devServer: {
		contentBase: [
			path.join(__dirname, 'src', 'www'),
			path.join(__dirname, 'bower'),
			path.join(__dirname, '.tmp'),
		],
		port: 8000
	}
};
