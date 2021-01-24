const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: '127.0.0.1',
	dialect: 'mariadb',
	logging: false
});

sequelize.sync();

module.exports = sequelize;