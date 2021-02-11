const express = require('express');
const router = express.Router();

//basic account management
router.get('/', require('./query'));
router.patch('/', require('./update'));

//signup -> login -> logout
router.post('/signup', require('./signup'));
router.get('/validation', require('./validation'));
router.post('/login', require('./login'));
router.post('/logout', require('./logout'));

//account deletion
router.delete('/deletion', require('./deletion'));

module.exports = router;
