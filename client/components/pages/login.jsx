import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { setToken, getToken } from '../../utilities/token-client';

const LogIn = props => {
	//if logged in
	const [tok, setTok] = useState(null);

	getToken()
		.then(token => setTok(token))
		.catch(e => console.error(e))
	;

	if (tok) {
		return <Redirect to='/' />;
	}

	//refs
	const emailRef = useRef();
	const passwordRef = useRef();

	return (
		<div className='page'>
			<h1 className='centered'>Login</h1>
			<form className='constricted' onSubmit={
				async evt => {
					//on submit
					evt.preventDefault();
					const [result, redirect] = await handleSubmit(emailRef.current.value, passwordRef.current.value);
					if (result) {
						alert(result);
					}

					//redirect
					if (redirect) {
						props.history.push('/');
					}
				}
			}>
				<div>
					<label htmlFor="email">Email:</label>
					<input type="email" name="email" ref={emailRef} />
				</div>

				<div>
					<label htmlFor="password">Password:</label>
					<input type="password" name="password" ref={passwordRef} />
				</div>

				<button type='submit'>Login</button>
			</form>
		</div>
	);
};

//DOCS: returns two values: response and OK
const handleSubmit = async (email, password) => {
	email = email.trim(); //TODO: validate email on login

	//send to the auth server
	const result = await fetch(`${process.env.AUTH_URI}/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			email,
			password,
		})
	});

	if (!result.ok) {
		const err = `${result.status}: ${await result.text()}`;
		console.error(err);
		return [err, false];
	}

	//save the auth tokens
	const authTokens = await result.json();

	await setToken(authTokens.accessToken, authTokens.refreshToken);

	return [null, true];
};

export default LogIn;