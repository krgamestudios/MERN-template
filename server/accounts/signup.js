//libraries
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { bannedEmails, accounts, pendingSignups } = require('../database/models');

//utilities
const validateEmail = require('../../common/utilities/validate-email.js');
const validateUsername = require('../../common/utilities/validate-username.js');
const sequelize = require('../database');

//api/accounts/signup
const route = async (req, res) => {
	//validate the given details
	const validateErr = await validateDetails(req.fields);
	if (validateErr) {
		return res.status(401).send(validateErr);
	}

	//generate the password hash
	const salt = await bcrypt.genSalt(11);
	const hash = await bcrypt.hash(req.fields.password, salt);

	//generate the validation field
	const verify = Math.floor(Math.random() * 2000000000);

	//register signup
	const signupErr = await registerPendingSignup(req.fields, hash, verify);
	if (signupErr) {
		return res.status(500).send(signupErr);
	}

	//send the validation email
	const emailErr = await sendValidationEmail(req.fields.email, verify);
	if (emailErr) {
		return res.status(500).send(emailErr);
	}

	//finally
	res.status(200).send("Validation email sent!");
	return null;
}

const validateDetails = async (fields) => {
	//basic formatting
	if (!validateEmail(fields.email)) {
		return 'invalid email';
	}

	if (!validateUsername(fields.username)) {
		return 'invalid username';
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

	//check for existing email
	const email = await accounts.findOne({
		where: {
			email: fields.email
		}
	});

	if (email) {
		return 'email already exists';
	}

	//check for existing username
	const username = await accounts.findOne({
		where: {
			username: fields.username
		}
	});

	if (username) {
		return 'username already exists';
	}

	return null;
};

const registerPendingSignup = async (fields, hash, verify) => {
	const record = await pendingSignups.upsert({
		email: fields.email,
		username: fields.username,
		hash: hash,
		verify: verify
	});

	return null;
};

const sendValidationEmail = async (email, verify) => {
	const addr = `${process.env.WEB_PROTOCOL}://${process.env.WEB_ADDRESS}/api/verify?verify=${verify}`;
	const msg = `Hello! Please visit the following address to verify your account: ${addr}`;

	//what exactly is a transport?
	let transporter = nodemailer.createTransport({
		host: process.env.MAIL_SMTP,
		port: 465,
		secure: true,
		auth: {
		  user: process.env.MAIL_USERNAME,
		  pass: process.env.MAIL_PASSWORD
		},
	});
	
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: `signup@${process.env.WEB_ADDRESS}`, //WARNING: google overwrites this
		to: email,
		subject: 'Email Validation',
		text: msg
	});

	if (info.accepted[0] != email) {
		return 'validation email failed';
	}

	return null;
};

module.exports = route;

