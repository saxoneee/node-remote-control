var process = require('process');

var api = require('./api/api');

var cfg = null;

// read config
try {
	cfg = require('./config.json');
} catch (e) {
	console.log('no config found'); // eslint-disable-line no-console
	process.exit(1);
}

api.init(cfg.serverPort, cfg.serverApiPath);