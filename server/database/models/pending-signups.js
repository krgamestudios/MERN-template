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

	contact: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},

	token: Sequelize.INTEGER(11)
});
