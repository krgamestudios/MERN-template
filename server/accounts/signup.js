//libraries
const util = require('util');
const bcrypt = require('bcryptjs');
const sendmail = require('sendmail')({silent: true});

//utilities
const validateEmail = require('../../common/utilities/validate-email.js');
const validateUsername = require('../../common/utilities/validate-username.js');

//api/accounts/signup
const route = (req, res) => {
	res.status(200).send("The server has received your information.");
}

module.exports = route;

