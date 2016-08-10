var app = app || {};

(function(app) {

	/**
	 * namespaces
	 */
	app.server = {};

	/**
	 * privates
	 */
	var _sockets = {};

	/**
	 * construct
	 */
	$(document).ready(function() {
		var _splashMessage = $('#appLoadingIndicatorLabel');

		_splashMessage.html('load config...');
		$.get('/rest/config', function(pConfig) {
			app.server.config = pConfig;
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
		$.get('/rest/user/login', function(pUser) {
			console.log('logged in as', pUser);

			socket.init(function() {
				pCallback();

				_sockets.swipe = socket.createEventSocket('swipe');
				_sockets.swipe.listen(function(args) {
					$('#mousepad').removeClass('used');
				});

				_sockets.tap = socket.createEventSocket('tap');
				_sockets.tap.listen(function(args) {
					$('#mousepad').removeClass('tapused');
				});

				_sockets.dtap = socket.createEventSocket('dtap');
				_sockets.dtap.listen(function(args) {
					$('#mousepad').removeClass('tapused');
				});

				_sockets.hold = socket.createEventSocket('hold');
				_sockets.hold.listen(function(args) {
					$('#mousepad').removeClass('tapused');
				});
			});
		});
	};

	var _loginCompleted = function() {
		$('#splash').animate({
			opacity: 0
		}, 1000, function() {
			$('#splash').addClass('hidden');
			$('#controls').removeClass('hidden');
			var _noTap = false;
			var _swipeCounter = 0;
			var _cursorStartPosTop = null;
			var _cursorStartPosLeft = null;
			$('#mousepad').swipe({
				swipe: function(a, b, c) {
					_sockets.swipe.fire('end');
					_swipeCounter = 0;
					_cursorStartPosTop = null;
					_cursorStartPosLeft = null;
				},

				swipeStatus: function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection) {
					// don't throw every new position to the server, he will throw up
					_swipeCounter++;
					// if (_swipeCounter % 10 !== 0) {
					if (_swipeCounter % 3 !== 0) {
						return;
					}
					if (phase === 'cancel' || phase === 'start') {
						return;
					}

					$('#mousepad').addClass('used');

					if (event.targetTouches) {
						event = event.targetTouches[0];
					}

					if (event) {
						var posTop = Math.floor(event.clientY);
						var posLeft = Math.floor(event.clientX);

						if (_cursorStartPosTop === null) {
							_cursorStartPosTop = posTop;
							_cursorStartPosLeft = posLeft;
						}

						var _newPosTop = (_cursorStartPosTop - posTop) * -1,
							_newPosLeft = (_cursorStartPosLeft - posLeft) * -1;

						_sockets.swipe.fire({
							top: _newPosTop,
							left: _newPosLeft
						});
					}
				},
				tap: function() {
					if (_noTap === true) {
						_noTap = false;
						return;
					}
					$('#mousepad').addClass('tapused');
					_sockets.tap.fire();
				},
				doubleTap: function() {
					$('#mousepad').addClass('tapused');
					_sockets.dtap.fire();
				},
				hold: function() {
					$('#mousepad').addClass('tapused');
					_noTap = true;
					_sockets.hold.fire();
				},
				threshold: 50
			});
		});
	};
})(app);
