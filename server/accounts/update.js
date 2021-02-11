const { accounts } = require('../database/models');

const route = async (req, res) => {
	if (!req.session.account.id) {
		return res.status(500).send('missing account data');
	}

	//update the account
	await accounts.update({
		contact: req.fields.contact
	}, {
		where: {
			id: req.session.account.id
		}
	});

	//update the reference
	req.session.account = (await accounts.findOne({
		where: {
			id: req.session.account.id
		}
	})).dataValues;

	//respond with an OK
	res.status(200).send('Information updated');
};

module.exports = route;