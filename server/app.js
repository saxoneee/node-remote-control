/**
 * run me
 */
require('./base/config');

// read config
try {
	app.config = require('./config.json');
} catch (e) {
	console.log('no config found'); // eslint-disable-line no-console
}

var log = new(require(app.path.base + '/logging'))(__filename);

log.log('running ' + app.info.appName + ' on ' + app.info.platform);

log.info('init server');
var server = require(app.path.base + '/server'),
	socket = require(app.path.base + '/socket');

log.info('init session');
app.base.user = require(app.path.base + '/user');
app.base.session = require(app.path.base + '/session');

log.info('init modules');
app.modules.robot = new(require(app.path.modules + '/robot/robot'))();

// connect to the outside
app.server = server.startup(app.config.serverPort, app.config.frontend);

// initialize socket
app.socket = socket.init(app.server, {
	swipe: function(pEventArgs, pResponder) {
		app.modules.robot.swipe(pEventArgs, pResponder);
	},
	tap: function(pEventArgs, pResponder) {
		app.modules.robot.tap(pEventArgs, pResponder);
	},
	dtap: function(pEventArgs, pResponder) {
		app.modules.robot.dtap(pEventArgs, pResponder);
	},
	rtap: function(pEventArgs, pResponder) {
		app.modules.robot.rtap(pEventArgs, pResponder);
	},
	hold: function(pEventArgs, pResponder) {
		app.modules.robot.hold(pEventArgs, pResponder);
	},
	scroll: function(pEventArgs, pResponder) {
		app.modules.robot.scroll(pEventArgs, pResponder);
	}
});
