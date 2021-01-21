const express = require('express');
const router = express.Router();

//basic account management
router.post('/signup', require('./signup'));

module.exports = router;
