import React from 'react';
import { useCookies } from 'react-cookie';

const Visitor = () => {
	return (
		<div>
			<a href='/signup'>Sign Up</a>
			<em> - </em>
			<a href='/login'>Log In</a>
		</div>
	);
};

const Member = () => {
	return (
		<div>
			<a href='/account'>Account</a>
			<em> - </em>
			<a href='/' onClick={logout}>Log out</a>
		</div>
	);
};

const logout = async () => {
	await fetch('/api/accounts/logout', { method: 'POST' })
		.catch(e => console.error(e))
	;
};

const Header = () => {
	const [cookies, setCookie] = useCookies(['loggedin']);

	let Options;

	//check for logged in/out status
	if (cookies['loggedin']) {
		Options = Member;
	} else {
		Options = Visitor;
	}

	return (
		<header>
			<h1><a href='/'>MERN Template</a></h1>
			<Options />
		</header>
	);
};

export default Header;
