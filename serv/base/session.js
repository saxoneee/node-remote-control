var log = new(require(app.path.base + '/logging'))(__filename);

var stringUtils = require(app.path.utils + '/string');
var cookieUtils = require(app.path.utils + '/cookie');

var sessionModule = {
	getSession: function(pRequest) {
		cookieUtils.parseCookies(pRequest.headers.cookie);
		var _sessionId = cookieUtils.getCookie(app.info.appName + '-session');
		if (!_sessionId) {
			_sessionId = stringUtils.createUUID();
			log.log('new session: ' + _sessionId);
		}

		return _sessionId;
	}
};

module.exports = sessionModule;
