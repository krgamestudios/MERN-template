const { accounts } = require('../database/models');

const route = async (req, res) => {
	if (!req.session.account || !req.session.account.id) {
		res.status(401).send('Unknown account');
	}

	//update the reference
	req.session.account = (await accounts.findOne({
		where: {
			id: req.session.account.id
		}
	})).dataValues;

	//respond with the private-facing data
	res.status(200).json({
		contact: req.session.account.contact
	});
};

module.exports = route;