import React, { useState, useContext, useRef } from 'react';

import { TokenContext } from '../utilities/token-provider';

//DOCS: isolated the delete account button into it's own panel, so it can be easily moved as needed
const DeleteAccount = props => {
	const authTokens = useContext(TokenContext);
	const [open, setOpen] = useState(false);
	const passwordRef = useRef();

	if (!open) {
		return <button onClick={() => setOpen(true)} className={props.className}>Delete Account</button>
	}

	return (
		<form className={props.className} onSubmit={async evt => {
			evt.preventDefault();
			const [err] = await handleSubmit(passwordRef.current.value, authTokens);
			if (err) {
				alert(err);
			}
		}}>
			<div>
				<label htmlFor="password">Password:</label>
				<input type="password" name="password" ref={passwordRef} />
			</div>

			<button type='submit'>Delete Account</button>
			<button type='cancel' onClick={() => { passwordRef.current.value = ''; setOpen(false); }}>Cancel</button>
		</form>
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