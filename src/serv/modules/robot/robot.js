// var log = new(require(app.path.base + '/logging'))(__filename);

var robot = require('robotjs');

module.exports = function() {
	console.log('init robot');

	var _cursorStartPosTop = null,
		_cursorStartPosLeft = null;

	return {
		tap: function() {
			robot.mouseClick('left');
		},
		dtap: function() {
			robot.mouseClick('left', true);
		},
		rtap: function() {
			robot.mouseClick('right');
		},


		swipe: function(pEventArgs, pResponder) {
			if (_cursorStartPosTop === null) {
				var _mousePos = robot.getMousePos();
				_cursorStartPosTop = _mousePos.y;
				_cursorStartPosLeft = _mousePos.x;
			}
			if (pEventArgs === 'end') {
				_cursorStartPosTop = null;
				_cursorStartPosLeft = null;
			} else {
				var _newPosTop = _cursorStartPosTop + pEventArgs.top,
					_newPosLeft = _cursorStartPosLeft + pEventArgs.left;

				robot.moveMouse(_newPosLeft, _newPosTop);
			}
			pResponder(pEventArgs);
		},
		hold: function(pEventArgs, pResponder) {
			robot.mouseClick('right');
			pResponder();
		},
		scroll: function(pEventArgs, pResponder) {
			var _direction, _distance;
			switch (pEventArgs.direction) {
				case 'vertical':
					if (pEventArgs.top < 0) {
						_direction = 'up';
					} else {
						_direction = 'down';
					}
					_distance = Math.abs(pEventArgs.top);
					break;
				case 'horizontal':
					if (pEventArgs.left < 0) {
						_direction = 'left';
					} else {
						_direction = 'right';
					}
					_distance = Math.abs(pEventArgs.left);
					break;
			}
			robot.scrollMouse(_distance, _direction);
			pResponder();
		}
	};
};
