var cookie = {
	cookieMap: {},
	parseCookies: function(pRawCookies) {
		var _me = this;

		if (typeof pRawCookies !== 'string') {
			return;
		}

		var _rawCookieList = pRawCookies.split(';');

		for (var i = 0; i < _rawCookieList.length; i++) {
			var _singleRawCookie = _rawCookieList[i];
			var _equalsPos = _singleRawCookie.indexOf('=');

			var _key = _singleRawCookie.substr(0, _equalsPos);
			var _value = _singleRawCookie.substr(_equalsPos + 1);

			_me.cookieMap[_key.trim()] = decodeURIComponent(_value.trim());
		}
	},

	getCookie: function(pName) {
		return this.cookieMap[pName];
	}
};

module.exports = cookie;
