import React, { useRef, useContext } from 'react';

import { TokenContext } from '../../utilities/token-provider';

const GrantAdmin = props => {
	//context
	const authTokens = useContext(TokenContext);

	//ref
	const usernameRef = useRef();

	return (
		<div className='panel'>
			<h2 className='text centered'>Grant Admin Privileges</h2>
			<form className='constrained'>
				<input type='text' name='username' placeholder='Username' ref={usernameRef} />

				<button type='button' onClick={async evt => {
					evt.preventDefault();
					const [err, result] = await handleButtonPress(usernameRef.current.value, authTokens.tokenFetch, 'POST');

					if (err) {
						alert(err);
					}

					if (result) {
						alert('admin set');
						usernameRef.current.value = '';
					}
				}}>Submit</button>

				<button type='button' onClick={async evt => {
					evt.preventDefault();
					const [err, result] = await handleButtonPress(usernameRef.current.value, authTokens.tokenFetch, 'DELETE');

					if (err) {
						alert(err);
					}

					if (result) {
						alert('admin removed');
						usernameRef.current.value = '';
					}
				}}>Remove</button>
			</form>
		</div>
	);
};

const handleButtonPress = async (username, tokenFetch, method) => {
	const result = await tokenFetch(`${process.env.AUTH_URI}/admin/admin`, {
		method: method,
		headers: {
			'Content-Type': 'application/json'
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

export default GrantAdmin;
