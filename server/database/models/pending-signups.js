const Sequelize = require('sequelize');
const sequelize = require('..');

module.exports = sequelize.define('pendingSignups', {
	email: {
		type: 'varchar(320)',
		unique: true
	},

	username: {
		type: 'varchar(320)',
		unique: true
	},

	hash: 'varchar(100)', //for passwords

	verify: Sequelize.INTEGER(11)
});
