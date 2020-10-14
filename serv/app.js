var process = require('process');

var cfg = null;

// read config
try {
	cfg = require('./config.json');
} catch (e) {
	console.log('no config found'); // eslint-disable-line no-console
	process.exit(1);
}

var api = require('./api/api');
api.init(cfg.serverPort, cfg.serverApiPath);
