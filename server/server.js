//environment variables
require('dotenv').config();

//create the server
const express = require('express');
const app = express();
const server = require('http').Server(app);

//libraries used here
const path = require('path');
const formidable = require('express-formidable');

app.use(formidable());

//account management
app.use('/api/accounts', require('./accounts'));

//send static files
app.use('/', express.static(path.resolve(__dirname, 'public')));

//fallback to the index file
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public' , 'index.html'));
});

//startup
server.listen(process.env.WEB_PORT || 3000, (err) => {
	console.log(`listening to localhost:${process.env.WEB_PORT || 3000}`);
});
