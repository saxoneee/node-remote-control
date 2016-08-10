/**
 * global configuration
 */
global.app = {};

var path = require('path'),
	os = require('os'),
	root = path.join(__dirname, '..');

app.info = {
	appName: 'remote-control',
	platform: os.platform()
};

/**
 * global paths
 */
app.path = {
	root: root,
	server: root,
	base: path.join(root, 'base'),
	rest: path.join(root, 'rest'),
	modules: path.join(root, 'modules'),
	utils: path.join(root, 'utils'),
	logs: path.join(root, 'log')
};

/**
 * ref to server
 */
app.server = null;

/**
 * logging-module
 */
app.logging = null;

/**
 * namespace for modules
 */
app.modules = {};

/**
 * namespace for base classes
 */
app.base = {};
