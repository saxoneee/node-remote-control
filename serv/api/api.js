var express = require('express'),
	server = express();

module.exports = {
	/**
	 * start the api
	 *
	 * @param  {Number} pPort
	 * @param  {String} pServerApiBasePath
	 */
	init: function(pServerPort, pServerApiBasePath) {
		console.log('tcp api init');

		console.log('configuring routes');

		server.get(pServerApiBasePath + '/init', require('./../routes/init'));
		server.get(pServerApiBasePath + '/login', require('./../routes/login'));

		server.listen(pServerPort, function(){
			console.log(`tcp api listening at http://localhost:${pServerPort}`);
		});


/*
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

		// to remove: 
		// // serve frontends
		// for (var i = 0; i < pFrontendPaths.length; i++) {
		// 	var _frontendPath = path.join(__filename, '..', '..', pFrontendPaths[i]);
		// 	_connect.use(serveStatic(_frontendPath));
		// }

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

		return _server;*/
	}
};
