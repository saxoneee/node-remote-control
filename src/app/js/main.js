var nrc = nrc || {};

(function(main) {
	main.cfg = {
		serverUrl: null // set in __construct
	};

	/**
	 * __construct
	 */
	$(document).ready(function() {
		// window.dev.initLog();
		_splash('init...');
	
		$.get('/cfg/cfg.json').done(function(pCfg){
			$.extend(main.cfg, pCfg);
			main.cfg.serverUrl = main.cfg.server + main.cfg.serverApiPath;
			
			_initApp();
		}).fail(function(){
			console.error(arguments);
			_splash('could not get config');
		});
	
	});

	/**
	 * initialize app after getting config.json
	 */
	var _initApp = function(){
		$.get(main.cfg.serverUrl + '/init', function() {
			_splash('login...');
			_login();
		});
	}

	/**
	 * login
	 */
	var _login = function() {
		$.get(main.cfg.serverUrl + '/login').done(function(pUser) {
			_splash('logged in as ' + pUser);

			$('#splash h1, #splash .loading').attr('hidden', true);
			$('#controls').attr('hidden', false);
			main.control.init();
		}).fail(function(){
			_splash('could not login');
		});
	};

	/**
	 * set message in header
	 * 
	 * @param {string} pMsg 
	 */
	var _splash = function(pMsg){
		$('#appLoadingIndicatorLabel').html(pMsg);
	}
})(nrc);
