const express = require('express');
const router = express.Router();

//reserve the name on the chat server (then get out of the way)
router.post('/reserve', require('./reserve'));

module.exports = router;
