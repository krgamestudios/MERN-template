//libraries
const utils = require('util');
const bcrypt = require('bcryptjs');
var cron = require('node-cron');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { accounts } = require('../database/models');

//api/accounts/deletion
const route = async (req, res) => {
	//make sure the account is logged in
	if (req.cookies['loggedin'] !== process.env.WEB_ADDRESS) {
		return res.status(401).send('invalid session status');
	}

	//compare the user's password
	const compare = utils.promisify(bcrypt.compare);
	const match = await compare(req.fields.password, req.session.account.hash);

	if (!match) {
		return res.status(401).send('incorrect password');
	}

	//set the deletion time (2 days from now)
	const interval = new Date(new Date().setDate(new Date().getDate() + 2)); //wow
	await accounts.update({
		deletion: interval
	},
	{
		where: {
			id: req.session.account.id
		}
	});

	//finally
	return res.status(200).send('account will be deleted in two days - log in to cancel');
};

//actually delete the accounts
cron.schedule('0 * * * *', () => {
	accounts.destroy({
		where: {
			deletion: {
				[Op.lt]: Sequelize.fn('NOW')
			}
		}
	});
});

module.exports = route;