import React, { useState, useContext, useRef } from 'react';

import { TokenContext } from '../../utilities/token-provider';

//DOCS: isolated the delete account button into it's own panel, so it can be easily moved as needed
const DeleteAccount = props => {
	const authTokens = useContext(TokenContext);
	const [open, setOpen] = useState(false);
	const passwordRef = useRef();

	if (!open) {
		return (
			<button onClick={() => setOpen(true)}>Delete Account</button>
		);
	}

	return (
		<div className='panel centered middle'>
			<h2 className='text centered'>Delete Your Account?</h2>
			<form className='constrained' onSubmit={async evt => {
				evt.preventDefault();
				const [err] = await handleSubmit(passwordRef.current.value, authTokens);
				if (err) {
					alert(err);
				}
			}}>
				<input type="password" name="password" placeholder='Password' ref={passwordRef} />

				<button type='submit' style={{backgroundColor: 'red'}}>Delete Account</button>
				<button type='cancel' onClick={() => { passwordRef.current.value = ''; setOpen(false); }}>Cancel</button>
			</form>
		</div>
	);
};

const handleSubmit = async (password, authTokens) => {
	//schedule a deletion
	const result = await authTokens.tokenFetch(`${process.env.AUTH_URI}/auth/account`, {
		method: 'DELETE',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			password
		})
	});

	if (!result.ok) {
		return [`${await result.status}: ${await result.text()}`];
	}

	//force a logout
	const result2 = await authTokens.tokenFetch(`${process.env.AUTH_URI}/auth/logout`, {
		method: 'DELETE',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			token: authTokens.refreshToken
		})
	});

	if (!result2.ok) {
		return [`${await result2.status}: ${await result2.text()}`];
	}

	authTokens.setAccessToken('');
	authTokens.setRefreshToken('');

	return [null];
};

export default DeleteAccount;