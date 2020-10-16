(function(main) {

	var _doAction = function(pArgs){
		$.get(main.cfg.serverUrl + '/control', pArgs);
	}
	
	var _swipeHandler = function(pScrollDirection) {
		return function(event, phase) {
console.log('swipehandler', pScrollDirection);
			return;
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

	var control = {
		init: function(){
			console.log('control init');
			

			var _x = 0;
			$('#mousepadcontrols-right').swipe({
				tap: function(){
					_doAction({type: 'rtap'});
				}
			});
			
			$('#mousepadcontrols-left').swipe({
				tap: function(){
					_doAction({type: 'tap'});
				},
				doubleTap: function(){
					_doAction({type: 'dtap'});
				}
			});
	
			$('#mousepad').swipe({
				swipe: function() {
					console.log('swipe end');
				},
	
				swipeStatus: _swipeHandler(),
				tap: function() {
					console.log('tap');
				},
				doubleTap: function() {
					console.log('dtap');
				},
				hold: function() {
					console.log('hold');
				},
				threshold: 5
			});

			$('#mousepadcontrols-wheel').swipe({
				swipe: function() {
					console.log('wheel swipe end');
					// _sockets.swipe.fire('end');
					// _swipeCounter = 0;
					// _cursorStartPosTop = null;
					// _cursorStartPosLeft = null;
				},
				swipeStatus: _swipeHandler('vertical')
			});
		}
	};

	main.control = control;
})(nrc);
