/**
 * Modul zum Starten eines Servers
 */
var log = new(require(app.path.base + '/logging'))(__filename);

var connect = require('connect'),
	http = require('http'),
	serveStatic = require('serve-static'),
	path = require('path');

var configApi = require(app.path.rest + '/config'),
	userApi = require(app.path.rest + '/user');

module.exports = {
	/**
	 * start the server
	 *
	 * @param  {Number} pPort Port, auf den gehört wird
	 * @param  {Function} pCallback Callback nach Start
	 * @return {[type]}           [description]
	 */
	startup: function(pPort, pFrontendPaths, pCallback) {
		log.log('server startup');

		var _connect = connect();

		// cookie middleware for sessions
		_connect.use(function(request, response, next) {
			var _sessionId = app.base.session.getSession(request);
			response.setHeader('Set-Cookie', [app.info.appName + '-session=' + encodeURIComponent(_sessionId)]);
			next();
		});

		log.log('apply rest services');
		// rest apis
		_connect.use('/rest/config', configApi);
		_connect.use('/rest/user', userApi);

		// serve frontends
		for (var i = 0; i < pFrontendPaths.length; i++) {
			var _frontendPath = path.join(__filename, '..', '..', pFrontendPaths[i]);
			_connect.use(serveStatic(_frontendPath));
		}

		var _server = http.createServer(_connect).listen(pPort);

		_server.on('error', function(pError) {
			log.warn('node server has a problem: ', pError);
		});

		_server.on('listening', function() {
			log.log('server running at http://127.0.0.1:' + pPort);

			// weitere Ausführung nur, wenns tut
			if (pCallback) {
				pCallback();
			}
		});

		return _server;
	}
};
