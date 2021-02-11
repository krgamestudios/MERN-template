const express = require('express');
const router = express.Router();

//middleware
router.use((req, res, next) => {
	//make sure the account is an admin
	if (req.cookies['admin'] !== process.env.SESSION_ADMIN) {
		return res.status(401).send('invalid admin status');
	} else {
		next();
	}
});

//basic account ban management
router.get('/banned', require('./banned'));
router.post('/ban', require('./ban'));
router.post('/unban', require('./unban'));

//DOCS: ensure that there is at least one administration account
const bcrypt = require('bcryptjs');
const { accounts } = require('../database/models');

(async () => {
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
})();

module.exports = router;