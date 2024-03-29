import React, { useContext, useRef } from 'react';
import { Link } from 'react-router-dom';

import { TokenContext } from '../../utilities/token-provider';

//TODO: make this an ACTUAL BUTTON
const Logout = () => {
	const authTokens = useContext(TokenContext);

	return (
		<>
			{ /* Logout logs you out of the server too */ }
			<Link to='/' onClick={async () => {
				const result = await authTokens.tokenFetch(`${process.env.AUTH_URI}/auth/logout`, { //NOTE: this gets overwritten as a bugfix
					method: 'DELETE'
				});

				//any problems?
				if (!result.ok) {
					console.error(await result.text());
				} else {
					authTokens.setAccessToken('');
				}
			}}>Logout</Link>
		</>
	);
};

export default Logout;