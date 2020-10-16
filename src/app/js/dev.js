window.dev = {
    initLog: function(){
        $('body').append('<pre id="log" style="position:absolute;top:0;left:0;z-index:99999;width:80%;background:#fff;padding:10px;opacity:0.8;overflow:scroll; color:#000;"></pre>');

        console.debug = function(){
            var _msg = '';
            for(var _i = 0; _i < arguments.length; _i++){
                var _line = arguments[_i];
                if(['string'].indexOf(typeof _line)){
                    _line = JSON.stringify(_line);
                }
                _msg += JSON.stringify(_line) + ' ';
            }
            $('#log').append(_msg + "\n");

        }
    }
};