//environment variables
require('dotenv').config();

//libraries
const path = require('path');

//create the server
const express = require('express');
const app = express();
const server = require('http').Server(app);

//config
app.use(express.json());

//database connection
const database = require('./database');

//send static files
app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

//fallback to the index file
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'public' , 'index.html'));
});

//startup
server.listen(process.env.WEB_PORT || 3000, async (err) => {
	await database.sync();
	console.log(`listening to localhost:${process.env.WEB_PORT || 3000}`);
});
