import React, { useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

//utilities
const validateEmail = require('../../../common/utilities/validate-email');

const Recover = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (authTokens.accessToken) {
		return <Redirect to='/' />;
	}

	//refs
	const emailRef = useRef();
	const recoverRef = useRef();

	return (
		<div className='page'>
			<h1 className='centered'>Recover Password</h1>
			<form className='constricted' onSubmit={
				async evt => { //on submit
					recoverRef.current.disabled = true;
					evt.preventDefault();
					const [result, redirect] = await handleSubmit(emailRef.current.value);
					if (result) {
						alert(result);
						recoverRef.current.disabled = false;
					}

					//redirect
					if (redirect) {
						props.history.push('/');
					}
				}
			}>
				<div>
					<label htmlFor='email'>Enter Your Email:</label>
					<input type='email' name='email' ref={emailRef} />
				</div>

				<button type='submit' ref={recoverRef}>Recover Password</button>
			</form>
		</div>
	);
};

const handleSubmit = async (email) => {
	email = email.trim();

	const err = handleValidation(email);

	if (err) {
		return [err];
	}

	//send to the auth server
	const result = await fetch(`${process.env.AUTH_URI}/auth/recover`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			email
		})
	});

	if (!result.ok) {
		const err = `${result.status}: ${await result.text()}`;
		console.error(err);
		return [err, false];
	}

	return [await result.text(), true];
};

//returns an error message, or null on success
const handleValidation = (email) => {
	if (!validateEmail(email)) {
		return 'invalid email';
	}

	return null;
};

export default Recover;