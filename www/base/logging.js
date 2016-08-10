// https://gist.github.com/spmason/1670196
/*eslint no-console: ["error", { allow: ["info", "log", "warn", "error", "debug"] }] */
var util = require('util'),
	winston = require('winston'),
	logger = new winston.Logger(),
	production = (process.env.NODE_ENV || '').toLowerCase() === 'production',
	initialized = false;

var initLogger = function() {
	if (initialized === true) {
		return;
	}

	// // make stack accessible
	// Object.defineProperty(global, '__stack', {
	// 	get: function() {
	// 		var orig = Error.prepareStackTrace;
	// 		Error.prepareStackTrace = function(_, stack) {
	// 			return stack;
	// 		};
	// 		var err = new Error;
	// 		Error.captureStackTrace(err, arguments.callee);
	// 		var stack = err.stack;
	// 		Error.prepareStackTrace = orig;
	// 		return stack;
	// 	}
	// });

	// // make linenumber of logging accessible
	// Object.defineProperty(global, '__line', {
	// 	get: function() {
	// 		if (__stack && __stack[2]) {
	// 			return __stack[2].getLineNumber();
	// 		}
	// 		return -1;
	// 	}
	// });

	// Override the built-in console methods with winston hooks
	switch ((process.env.NODE_ENV || '').toLowerCase()) {
		case 'production':
			production = true;
			if (production) {
				// disabling eslint-error for now
			}
			logger.add(winston.transports.File, {
				filename: app.config.log + '/application.log',
				handleExceptions: true,
				exitOnError: false,
				level: 'warn'
			});
			break;

		case 'test':
			// Don't set up the logger overrides
			return;
		default:

			logger.add(winston.transports.Console, {
				colorize: true,
				timestamp: timestamp,
				level: app.config.debugLogLevel
			});
			break;
	}

	initialized = true;

	logger.info('logging init');
};

var timestamp = function() {
	var _date = new Date(),
		_return = '',
		_month = (_date.getMonth() + 1) + '',
		_day = _date.getDate() + '',
		_hours = _date.getHours() + '',
		_minutes = _date.getMinutes() + '',
		_seconds = _date.getSeconds() + '';

	_return += _date.getFullYear();
	_return += '.';
	_return += (_month.length > 1) ? _month : '0' + _month;
	_return += '.';
	_return += (_day.length > 1) ? _day : '0' + _day;
	_return += ' ';
	_return += (_hours.length > 1) ? _hours : '0' + _hours;
	_return += ':';
	_return += (_minutes.length > 1) ? _minutes : '0' + _minutes;
	_return += ':';
	_return += (_seconds.length > 1) ? _seconds : '0' + _seconds;

	return _return;
};

var formatArgs = function(args) {
	return [util.format.apply(util.format, Array.prototype.slice.call(args))];
};

module.exports = function(pFilename) {

	initLogger();

	// log the filepath, if given as first argument
	if (typeof pFilename === 'string' && pFilename.indexOf(app.path.root) === 0) {
		// not the full path, from server root should be enough
		// not the first slash, could be confusing
		pFilename = '[' + pFilename.substr(app.path.root.length + 1) + /*':' + __line +*/ ']';
	}

	return {
		log: function() {
			logger.info.apply(logger, formatArgs(arguments).concat([pFilename]));
		},
		info: function() {
			logger.info.apply(logger, formatArgs(arguments).concat([pFilename]));
		},
		warn: function() {
			logger.warn.apply(logger, formatArgs(arguments).concat([pFilename]));
		},
		error: function() {
			logger.error.apply(logger, formatArgs(arguments).concat([pFilename]));
		},
		debug: function() {
			logger.debug.apply(logger, formatArgs(arguments).concat([pFilename]));
		}
	};
};
