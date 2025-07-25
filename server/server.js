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

//handle compressed files (middleware)
app.get('/{*any}.js', (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	res.set('Content-Type', 'text/javascript');
	next();
});

app.get('/{*any}.css', (req, res, next) => {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	res.set('Content-Type', 'text/css');
	next();
});

//database connection
const database = require('./database');

//send static files
app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

//fallback to the index file
app.get('/{*any}', (req, res) => {
	res.sendFile(path.resolve(__dirname, '..', 'public' , 'index.html'));
});

//startup
server.listen(process.env.WEB_PORT || 3000, async (err) => {
	await database.sync();
	console.log(`listening to localhost:${process.env.WEB_PORT || 3000}`);
	console.log(`database located at ${process.env.DB_HOSTNAME || '<default>'}:${process.env.DB_PORTNAME || '<default>'}`);
});
