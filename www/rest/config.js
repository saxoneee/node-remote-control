/**
 * serve configdata via rest-url
 */

var log = new(require(app.path.base + '/logging'))(__filename);
var path = require('path');

var restService = require(app.path.rest + '/abstract/abstract');

module.exports = new restService(function(pUrl, pUrlParams, pSession, pUser, pResponder) {
	var _data = {};

	_data.pathSeparator = path.sep;

	log.debug('serve config');
	pResponder(JSON.stringify(_data));
});
