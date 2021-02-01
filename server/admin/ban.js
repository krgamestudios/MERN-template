const { Op } = require('sequelize');
const { bannedEmails, accounts } = require('../database/models');

const route = async (req, res) => {
	//fetch the account based on the email or username
	const account = await accounts.findOne({
		attrubutes: ['username', 'email'],
		where: {
			[Op.or]: {
				username: {
					[Op.eq]: req.fields.username,
				},
				email: {
					[Op.eq]: req.fields.email
				}
			}
		}
	});

	//just in case
	if (account && account.privilege == 'administrator') {
		return res.status(401).send('Couldn\'t ban an admin');
	}

	//need either an email or an account
	if (!account && !req.fields.email) {
		return res.status(401).send('Couldn\'t determine the ban info');
	}

	//apply the ban
	await bannedEmails.upsert({
		email: (account || req.fields).email,
		reason: req.fields.reason ? req.fields.reason : null,
		expiry: req.fields.expiry ? new Date(Date.parse(req.fields.expiry)) : null
	});

	return res.status(200).send(`Email ${(account || req.fields).email} banned (username ${account ? account.username : 'not found'})`);
};

module.exports = route;