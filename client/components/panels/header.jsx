import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { getToken, getRefreshToken, clearToken } from '../../utilities/token-client';

const Visitor = () => {
	return (
		<div>
			<Link to='/signup'>Sign Up</Link>
			<em> - </em>
			<Link to='/login'>Log In</Link>
		</div>
	);
};

const Member = () => {
	return (
		<div>
			<Link to='/account'>Account</Link>
			<em> - </em>
			<Link to='/' onClick={logout}>Log out</Link>
		</div>
	);
};

const logout = async () => {
	console.log('loging out')
	const token = getToken();

	//send to the auth server
	const result = await fetch(`${process.env.AUTH_URI}/logout`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify({
			token: getRefreshToken()
		})
	});

	if (result.ok) {
		await clearToken();
	} else {
		console.error(await result.text());
	}
};

const Header = () => {
	const [tok, setTok] = useState(null);

	getToken()
		.then(token => setTok(token))
		.catch(e => console.error(e))
	;

	return (
		<header>
			<h1><Link to='/'>MERN Template</Link></h1>
			{ tok ? <Member /> : <Visitor /> }
		</header>
	);
};

export default Header;
