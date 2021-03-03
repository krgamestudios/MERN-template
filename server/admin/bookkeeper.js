//DOCS: this whole file is just a big bugfix
//DOCS: ensure that there is at least one administration account
const bcrypt = require('bcryptjs');
const sequelize = require('../database');
const { accounts } = require('../database/models');

const defaultAdminAccount = async () => {
	await sequelize.sync(); //this whole file is just one big BUGFIX

	const admin = await accounts.findOne({
		where: {
			privilege: 'administrator'
		}
	});

	if (admin == null) {
		await accounts.create({
			privilege: 'administrator',
			email: `admin@${process.env.WEB_ADDRESS}`,
			username: `admin`,
			hash: await bcrypt.hash('password', await bcrypt.genSalt(11))
		});

		console.log(`Created default admin account (email: admin@${process.env.WEB_ADDRESS}; password: password)`);
	}
};

module.exports = defaultAdminAccount;
