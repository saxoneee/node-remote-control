var url = require('url');

var urlHelper = {
    parseUrlParams: function(pUrl){
        var _oUrl = url.parse(pUrl),
            _oParams = {};

        if(_oUrl.query){
            var _aQuery = _oUrl.query.split('&');
            for(var _sParam in _aQuery){
                var _aParam = _aQuery[_sParam].split('=');

                _oParams[_aParam[0]] = _aParam[1];
            }
        }

        return _oParams;
    }
};

module.exports = urlHelper;