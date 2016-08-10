/**
 * serve user stuff via rest-url
 *
 * example: http://127.0.0.1/user/login
 */

var log = new(require(app.path.base + '/logging'))(__filename);

var restService = require(app.path.rest + '/abstract/abstract');

module.exports = new restService(function(pUrl, pUrlParams, pSession, pUser, pResponder) {
	var _type = pUrl[1];

	switch (_type) {
		case 'login':
			app.base.user.login(pSession, function(pUser) {
				pResponder(JSON.stringify(pUser));
			});

			break;
		default:
			pResponder(null, 404);
	}
});
