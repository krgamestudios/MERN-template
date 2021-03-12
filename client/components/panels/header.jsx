import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

const Visitor = () => {
	return (
		<div>
			<Link to='/signup'>Sign Up</Link>
			<span> - </span>
			<Link to='/login'>Log In</Link>
		</div>
	);
};

const Member = () => {
	const authTokens = useContext(TokenContext);

	return (
		<div>
			<Link to='/account'>Account</Link>
			<span> - </span>

			{ authTokens.getPayload().privilege == 'administrator' ?
				<span>
					<Link to='/admin'>Admin</Link>
					<span> - </span>
				</span>:
				<span />
			}

			{ /* Logout button logs you out of the server too */ }
			<Link to='/' onClick={async () => {
				const result = await authTokens.tokenFetch(`${process.env.AUTH_URI}/logout`, { //NOTE: this gets overwritten as a bugfix
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*'
					},
					body: JSON.stringify({
						token: authTokens.refreshToken
					})
				});

				//any problems?
				if (!result.ok) {
					console.error(await result.text());
				} else {
					authTokens.setAccessToken('');
					authTokens.setRefreshToken('');
				}
			}}>Log out</Link>
		</div>
	);
};

const Header = () => {
	const authTokens = useContext(TokenContext);

	return (
		<header>
			<h1><Link to='/'>MERN Template</Link></h1>
			{ authTokens.accessToken ? <Member /> : <Visitor /> }
		</header>
	);
};

export default Header;
