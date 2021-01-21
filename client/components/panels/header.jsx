import React from 'react';

const Visitor = () => {
	return (
		<div>
			<a href='/signup'>Sign Up</a>
			<a href='/login'>Log In</a>
		</div>
	);
};

const Member = () => {
	return (
		<div>
			<a href='/account'>Account</a>
			<a href='/logout'>Log out</a>
		</div>
	);
};

const Header = () => {
	return (
		<header>
			<h1><a href='/'>MERN Template</a></h1>
			<Visitor />
		</header>
	);
};

export default Header;
