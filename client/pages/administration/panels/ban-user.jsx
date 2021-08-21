import React, { useRef, useContext } from 'react';

import { TokenContext } from '../../utilities/token-provider';

const BanUser = props => {
	//context
	const authTokens = useContext(TokenContext);

	//ref
	const usernameRef = useRef();

	return (
		<div className='panel'>
			<h2 className='text centered'>Permanently Ban User</h2>
			<form className='constrained'>
				<input type='text' name='username' placeholder='Username' ref={usernameRef} />

				<button type='button' onClick={async evt => {
					evt.preventDefault();
					const yes = confirm('Permanently ban this user from the website?');

					if (!yes) {
						return;
					}

					const [err, result] = await handleButtonPress(usernameRef.current.value, authTokens.tokenFetch);

					if (err) {
						alert(err);
					}

					if (result) {
						usernameRef.current.value = '';
					}
				}}>Submit</button>
			</form>
		</div>
	);
};

const handleButtonPress = async (username, tokenFetch) => {
	const result = await tokenFetch(`${process.env.AUTH_URI}/admin/banuser`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			username
		})
	});

	if (!result.ok) {
		const err = `${result.status}: ${await result.text()}`;
		console.log(err);
		return [err, false];
	}

	return [null, true];
};

export default BanUser;
