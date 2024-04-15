const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOSTNAME,
	port: process.env.DB_PORTNAME,
	dialect: 'mariadb',
	timezone: process.env.DB_TIMEZONE,
	logging: process.env.DB_LOGGING ? console.log : false
});

module.exports = sequelize;