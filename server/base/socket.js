/**
 * Serverseitige Administration der Client-Server-Kommunikation
 *
 */
var log = new(require(app.path.base + '/logging'))(__filename);

/**
 * socket-instance
 *
 * @type {Object}
 */
var broadcastSocket = null;
var userSocketColl = {};
var eventHandler = {};

/**
 * Erweiterung des Event-Handlers um einen Callback, um optional an den Client zu antworten.
 * Außerdem wird die EventId als dritter Parameter übergeben, damit alternative Eventnamen genutzt werden können
 *
 * @param  {Object} pSocket    Verbindung
 * @param  {String} pEventName    Name des Events
 * @param  {Function} pEventHandler Methode, die durch das Event aufgerufen wird
 * @return {Function} erweiterter Event-Handler
 */
var extendEventHandler = function(pClientSocket, pEventName, pEventHandler) {
	var _eventHandler = function(pEventData) {
		log.log('event in: ', pEventName);
		/**
		 * Eventname mit Unique-Id, erzeugt vom Client
		 *
		 * @type {String}
		 */
		var _respondEventName = pEventData.response,
			/**
			 * Argumente des Events
			 *
			 * @type {Object}
			 */
			_eventArgs = pEventData.args,

			/**
			 * Id, die an den respondEventName angehängt wird
			 * @type {[type]}
			 */
			_eventId = null,

			_matches = _respondEventName.match(/\[(.*)\]$/);

		if (_matches !== null && _matches[1].length > 0) {
			_eventId = _matches[1];
		}
		/**
		 * Event-Antwort-Funktion
		 *
		 * @param  {Object} pReturnArgs an den Client zurückzugebende Argumente
		 * @param  {Boolean} [pBroadcast] optionale Angabe, ob die Antwort an einen Client oder an alle gehen soll
		 * @param  {String} [pAlternativeEventName] optionaler alternativer Event-Name, auf den der Client hört
		 */
		var _respondCallback = function(pReturnArgs, pBroadcast, pAlternativeEventName) {
			var _eventName = _respondEventName;
			var _eventScope = _eventName.replace(/.*(\[.*\])/, '$1');

			if (typeof pAlternativeEventName === 'string' && pAlternativeEventName.length > 0) {
				_eventName = pAlternativeEventName + _eventScope;
				log.debug('alternative responseEventName', _eventName);
			}

			var _eventNameLog = _eventName.replace(/\[.*\]/, '');

			// an eine Verbindung
			if (!pBroadcast) {
				log.log('private out: ', _eventNameLog);
				pClientSocket.emit(_eventName, pReturnArgs);
			} else { // an alle
				log.log('broadcast out: ', _eventNameLog);
				broadcastSocket.emit(_eventName, pReturnArgs);
			}
		};

		// Ausführung des Handlers
		// Beim Binden von Events ist auf diese Parameter zu achten
		pEventHandler(_eventArgs, _respondCallback, _eventId);
	};

	return _eventHandler;
};

/**
 * [attachEventHandler description]
 * @param  {[type]} pSocket       [description]
 * @param  {[type]} pEventHandler [description]
 * @return {[type]}               [description]
 */
var attachEventHandler = function(pSocket, pEventHandler) {
	// Standard-Events des Sockets binden
	pSocket.on('disconnect', function() {
		log.log('someone has left the building');
		pSocket = null;
	});

	var _counter = 0;
	for (var _eventName in pEventHandler) {
		var _eventHandler = extendEventHandler(pSocket, _eventName, pEventHandler[_eventName]);
		pSocket.on(_eventName, _eventHandler);
		_counter++;
	}

	log.log('attached ' + _counter + ' event handler');
};

var registerUserSocket = function(pSocket, pSessionId) {
	pSocket.on('ampsession', function(pAmpSessionEvent) {
		pSocket.emit(pAmpSessionEvent.response, true);
	});
	attachEventHandler(pSocket, eventHandler);

	if (pSessionId && userSocketColl[pSessionId]) {
		log.log('welcome back');
	} else {
		log.log('hello');
		userSocketColl[pSessionId] = pSocket;
	}

	return pSocket;
};

module.exports = {
	/**
	 * Initialisierung
	 * Bei jeder neuen Verbindung werden alle definierten Event Handler an dieses Socket gebunden
	 *
	 * @param  {Object} pServer
	 * @param  {Object} pEventHandler key-value-object {eventName: eventHandler}
	 */
	init: function(pServer, pEventHandler) {
		log.log('init socket');
		var _server = require('socket.io')(pServer);
		// _server = new _socketIo(pServer);

		broadcastSocket = _server.of('/ampjs');
		eventHandler = pEventHandler;

		log.log('bind connection handler');
		// Event-Handler für neue Client-Verbindungen
		broadcastSocket.on('connection', function(pUserSocket) {
			var _session = app.base.session.getSession(pUserSocket.request);

			registerUserSocket(pUserSocket, _session);
		});

		log.log('waiting for connections');
	}
};