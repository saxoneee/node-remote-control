var log = new(require(app.path.base + '/logging'))(__filename);

var users = {},
	counter = 0;

module.exports = {
	/**
	 * autologin for now
	 */
	login: function(pSession, pCallback) {
		var user = this.getUser(pSession);
		log.log('login', user.name + '(' + user.level + ')');

		pCallback(user);
	},

	getUser: function(pSession) {
		if (!users[pSession]) {
			users[pSession] = {
				name: 'user' + counter,
				level: 10
			};
			counter++;

		}

		return users[pSession];
	}
};
