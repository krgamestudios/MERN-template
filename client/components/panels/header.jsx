import React from 'react';
import { Link } from 'react-router-dom';

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
	//TODO: update API
	await fetch('/api/accounts/logout', { method: 'POST' })
		.catch(e => console.error(e))
	;
};

const Header = () => {
	let Options = Visitor;

	return (
		<header>
			<h1><Link to='/'>MERN Template</Link></h1>
			<Options />
		</header>
	);
};

export default Header;
