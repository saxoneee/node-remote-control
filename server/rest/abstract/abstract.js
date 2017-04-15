/**
 * abstract restwrapper
 */

var log = new(require(app.path.base + '/logging'))(__filename);

module.exports = function(requestHandler) {
	return function(req, res) {
		var _url = req.url,
			_urlParts = _url.split('?'),
			_urlFolderParts = _urlParts[0].split('/'),
			_urlParams = null;

		if (_urlParts[1]) {
			var _urlParamsList = _urlParts[1].split('&');
			_urlParams = {};

			for (var _i = 0; _i < _urlParamsList.length; _i++) {
				var _param = _urlParamsList[_i].split('=');
				_urlParams[_param[0]] = _param[1];
			}
		}
		log.debug('incoming rest-request', _url);
		var _session = app.base.session.getSession(req),
			_user = app.base.user.getUser(_session);

		requestHandler(_urlFolderParts, _urlParams, _session, _user, function(pReturnData, pReturnCode, pReturnMime) {
			if (!pReturnData) {
				pReturnData = '';
			}
			if (!pReturnCode) {
				pReturnCode = 200;
			}
			if (!pReturnMime) {
				if (pReturnCode > 200) {
					pReturnMime = 'text/plain';
				} else {
					pReturnMime = 'application/json';
				}

			}

			res.writeHead(pReturnCode, {
				'content-type': pReturnMime
			});

			res.end(pReturnData);
		});
	};
};
