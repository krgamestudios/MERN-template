const Sequelize = require('sequelize');
const sequelize = require('..');

module.exports = sequelize.define('bannedEmails', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},

	email: {
		type: 'varchar(320)',
		unique: true
	},

	reason: Sequelize.TEXT,

	expiry: {
		type: 'DATETIME',
		allowNull: true,
		defaultValue: null
	}
});
