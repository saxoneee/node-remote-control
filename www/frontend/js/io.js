var socket = {
	/**
	 * Instanz von socket io
	 *
	 * @type {Object}
	 */
	io: null,

	/**
	 * flag, ob Verbindung clientseitig aufgebaut wurde
	 *
	 * @type {Boolean}
	 */
	_ioConnected: false,

	_interfaces: {},

	/**
	 * clientseitig Verbindung aufbauen
	 *
	 * @param  {Function} pConnectionCallback
	 */
	init: function(pConnectionCallback) {
		var _me = this;

		if (_me.initialized) {
			return;
		}
		_me.initialized = true;

		_me.connectionCallback = pConnectionCallback;
		_me.io = io('/ampjs');

		console.debug('io', 'init');
		// auf Verbindung warten
		_me.io.on('connect', function(pSocket) {
			console.debug('io', 'connection established');

			pConnectionCallback();
		});

		_me.io.on('disconnect', function() {
			console.log('io', 'disconnection');
		});
	},

	/**
	 * Auf ein Event vom Server hören und die Antwort weiter verarbeiten. Die Listener
	 * hören für immer.
	 *
	 * @param  {String} pEvent    Name des Events
	 * @param  {Function} pCallback Funktion, die bei Empfang ausgeführt werden soll
	 * @param  {Object} pScope    optionaler Scope
	 */
	_listen: function(pEventName, pEventResponseName, pCallback, pScope) {
		var _me = this;

		_me.io.on(pEventResponseName, function(pEventData) {
			console.debug('io', 'fetch "' + pEventName + '"', pEventData);

			// Context des Callbacks bei Bedarf an Objekt binden
			if (pScope !== null && pScope !== undefined) {
				pCallback.call(pScope, pEventData);
			} else {
				pCallback(pEventData);
			}
		});
	},

	/**
	 * Event an Server feuern
	 * @param  {[type]} pEvent     [description]
	 * @param  {[type]} pEventArgs [description]
	 * @return {[type]}            [description]
	 */
	_fire: function(pEvent, pEventArgs) {
		var _me = this;
		_me.io.emit(pEvent, pEventArgs);
	},

	/**
	 * Schnittstelle erzeugen und zurückgeben
	 * @param  {String} pEventName
	 * @param  {String} pEventScope Bereich
	 * @return {Object} eventInterface
	 */
	createEventSocket: function(pEventName, pEventScope) {
		var _me = this,
			_interface = null;

		if (!pEventScope) {
			pEventScope = utils.createUUID();
		}

		var _interfaceName = pEventName + pEventScope;

		if (!_me._interfaces[_interfaceName]) { // neu erzeugen
			var _responseEventName = pEventName + '[' + pEventScope + ']';

			// console.debug('svc:', 'interface created', 'event: ' + pEventName, 'eventresponser: ' + _responseEventName);

			_interface = {
				eventName: pEventName,
				responseEventName: _responseEventName,
				eventScope: pEventScope,

				// Request zum Server senden
				fire: function(pData, pListener) {
					console.debug('io', 'fire "' + pEventName + '"', {
						args: pData,
						responseEventName: _responseEventName
					});
					_me._fire(pEventName, {
						args: pData,
						response: _responseEventName
					});
				},

				// Antwort abwarten
				listen: function(pCallback, pScope) {
					console.debug('svc: listen to "' + pEventName + '"');
					_me._listen(pEventName, _responseEventName, pCallback, pScope);
					return _interface;
				}
			};
			_me._interfaces[_interfaceName] = _interface;
		} else { // Interface besteht bereits
			_interface = _me._interfaces[_interfaceName];
		}

		return _interface;
	}
};