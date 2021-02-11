const { pendingSignups, accounts } = require('../database/models');

//api/accounts/validation
const route = async (req, res) => {
	//get the existing pending signup
	const info = await pendingSignups.findOne({
		where: {
			username: req.query.username
		}
	});

	//check the given info
	if (!info) {
		return res.status(401).send('validation failed');
	}

	if (info.token != req.query.token) {
		return res.status(401).send('tokens do not match');
	}

	//delete the pending signup
	pendingSignups.destroy({
		where: {
			username: req.query.username
		}
	});

	//move data to the accounts table
	accounts.create({
		email: info.email,
		username: info.username,
		hash: info.hash,
		contact: info.contact
	});

	//finally
	res.status(200).send('Validation succeeded!');
};

module.exports = route;