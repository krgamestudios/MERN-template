//libraries
const utils = require('util');
const bcrypt = require('bcryptjs');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { bannedEmails, accounts } = require('../database/models');

//utilities
const validateEmail = require('../../common/utilities/validate-email.js');

//api/accounts/login
const route = async (req, res) => {
	//validate the given details
	const validateErr = await validateDetails(req.fields);
	if (validateErr) {
		return res.status(401).send(validateErr);
	}

	//get the existing account
	const account = await accounts.findOne({
		where: {
			email: req.fields.email
		}
	});

	if (!account) {
		return res.status(401).send('incorrect email or password');
	}

	//compare passwords
	const compare = utils.promisify(bcrypt.compare);
	const match = await compare(req.fields.password, account.hash);

	if (!match) {
		return res.status(401).send('incorrect email or password');
	}

	//save the session and cookie data
	req.session.account = account;
	res.cookie('loggedin', process.env.WEB_ADDRESS);

	if (account.privilege == 'administrator') {
		res.cookie('admin', process.env.SESSION_ADMIN);
	}

	//cancel deletion if any
	await accounts.update({ deletion: null }, {
		where: {
			id: account.id
		}
	});

	//finally
	res.status(200).send('login succeeded');
};

const validateDetails = async (fields) => {
	//basic formatting (with an exception for the default admin account)
	if (!validateEmail(fields.email) && fields.email != `admin@${process.env.WEB_ADDRESS}`) {
		return 'invalid email';
	}

	//check for existing (banned)
	const banned = await bannedEmails.findAll({
		where: {
			[Op.and]: {
				email: fields.email,
				expiry: {
					[Op.or]: {
						[Op.gt]: Sequelize.fn('NOW'),
						[Op.eq]: null
					}
				}
			}
		}
	});

	if (banned.length > 0) {
		return 'banned email';
	}

	return null;
}

module.exports = route;