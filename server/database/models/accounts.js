const Sequelize = require('sequelize');
const sequelize = require('..');

module.exports = sequelize.define('accounts', {
	id: {
		type: Sequelize.INTEGER(11),
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		unique: true
	},

	privilege: {
		type: Sequelize.ENUM,
		values: ['administrator', 'moderator', 'alpha', 'beta', 'gamma', 'normal'],
		defaultValue: 'normal'
	},

	email: {
		type: 'varchar(320)',
		unique: true
	},

	username: {
		type: 'varchar(320)',
		unique: true
	},

	hash: 'varchar(100)', //for passwords

	deletion: {
		type: 'DATETIME',
		allowNull: true,
		defaultValue: null
	}
});
