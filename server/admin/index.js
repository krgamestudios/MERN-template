const express = require('express');
const router = express.Router();

//middleware
router.use((req, res, next) => {
	//make sure the account is an admin
	if (req.cookies['admin'] !== process.env.SESSION_ADMIN) { //TODO: Eew not good.
		return res.status(401).send('invalid admin status');
	} else {
		next();
	}
});

//basic account ban management
router.get('/banned', require('./banned'));
router.post('/ban', require('./ban'));
router.post('/unban', require('./unban'));

module.exports = router;