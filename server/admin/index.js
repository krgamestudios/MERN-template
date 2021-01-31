const express = require('express');
const router = express.Router();

//basic account management
router.post('/banned', require('./banned'));
//router.post('/ban', require('./ban'));
//router.post('/unban', require('./unban'));

module.exports = router;
