var nrc = nrc || {};

(function(main) {
	/**
	 * privates
	 */
	var _swipeCounter = 0;
	var _cursorStartPosTop = null;
	var _cursorStartPosLeft = null;

	var _serverUrl = 'http://localhost:8000/api/v1';

	/**
	 * construct
	 */
	$(document).ready(function() {
		var _splashMessage = $('#appLoadingIndicatorLabel');

		_splashMessage.html('init...');
		$.get(_serverUrl + '/init', function() {
			_splashMessage.html('login...');
			_login(function() {
				_loginCompleted();
			});
		});
	});

	/**
	 * private methods
	 */
	var _login = function(pCallback) {
		$.get(_serverUrl + '/login', function(pUser) {
			main.utils.log('logged in as', pUser);

			pCallback();
		});
	};


	var _loginCompleted = function() {
		$('#loading-msg').attr('hidden', true);
		$('#controls').attr('hidden', false);
		main.control.init();
	};
})(nrc);
