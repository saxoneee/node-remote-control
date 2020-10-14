var nrc = nrc || {};

(function(main) {

	/**
	 * namespaces
	 */
	main.server = {};

	/**
	 * privates
	 */
	var _sockets = {};
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
		$.get(_serverUrl + '/init', function(pConfig) {
			main.server.config = pConfig;
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

			main.socket.init(function() {
				pCallback();

				_sockets.swipe = main.socket.createEventSocket('swipe');
				_sockets.swipe.listen(function() {
					$('#mousepad').removeClass('used');
				});

				_sockets.tap = main.socket.createEventSocket('tap');
				_sockets.tap.listen(function() {
					$('#mousepad').removeClass('tapused');
				});

				_sockets.dtap = main.socket.createEventSocket('dtap');
				_sockets.dtap.listen(function() {
					$('#mousepad').removeClass('tapused');
				});

				_sockets.rtap = main.socket.createEventSocket('rtap');
				_sockets.rtap.listen(function() {
					// $('#mousepadcontrols-right').removeClass('tapused');
				});

				_sockets.hold = main.socket.createEventSocket('hold');
				_sockets.hold.listen(function() {
					$('#mousepad').removeClass('tapused');
				});

				_sockets.scroll = main.socket.createEventSocket('scroll');
				_sockets.scroll.listen(function() {
					// $('#mousepadcontrols-right').removeClass('tapused');
				});
			});
		});
	};

	var _swipeHandler = function(pScrollDirection) {
		return function(event, phase) {
			var _direction = null;
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

				switch (pScrollDirection) {
					case 'vertical':
						_sockets.scroll.fire({
							top: _newPosTop,
							left: _newPosLeft,
							direction: pScrollDirection
						});
						break;
					case 'horizontal':
						if (posLeft > _newPosLeft) {
							_direction = 'right';
						} else {
							_direction = 'left';
						}
						_sockets.scroll.fire({
							top: _newPosTop,
							left: _newPosLeft,
							direction: _direction
						});
						break;
					default:
						_sockets.swipe.fire({
							top: _newPosTop,
							left: _newPosLeft
						});
				}
			}
		};
	};

	var _loginCompleted = function() {
		$('#loading-msg').attr('hidden', true);
		$('#controls').attr('hidden', false);
		var _noTap = false;
		$('#mousepad').swipe({
			swipe: function() {
				_sockets.swipe.fire('end');
				_swipeCounter = 0;
				_cursorStartPosTop = null;
				_cursorStartPosLeft = null;
			},

			swipeStatus: _swipeHandler(),
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
				// $('#mousepad').addClass('tapused');
				// _noTap = true;
				// _sockets.hold.fire();
			},
			threshold: 50
		});

		$('#mousepadcontrols-right').click(function() {
			_sockets.rtap.fire();
		});

		$('#mousepadcontrols-left').click(function() {
			_sockets.tap.fire();
		});

		$('#mousepadcontrols-wheel').swipe({
			swipe: function() {
				_sockets.swipe.fire('end');
				_swipeCounter = 0;
				_cursorStartPosTop = null;
				_cursorStartPosLeft = null;
			},
			swipeStatus: _swipeHandler('vertical')
		});
	};
})(nrc);
