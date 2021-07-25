import React, { useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

//utilities
const validateEmail = require('../../../common/utilities/validate-email');
const validateUsername = require('../../../common/utilities/validate-username');

const SignUp = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (authTokens.accessToken) {
		return <Redirect to='/' />;
	}

	//refs
	const emailRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const retypeRef = useRef();
	const contactRef = useRef();
	const signupRef = useRef();

	return (
		<div className='page'>
			<h1 className='centered'>Signup</h1>
			<form className='constricted' onSubmit={
				async evt => { //on submit
					signupRef.current.disabled = true;
					evt.preventDefault();
					const [result, redirect] = await handleSubmit(emailRef.current.value, usernameRef.current.value, passwordRef.current.value, retypeRef.current.value, contactRef.current.checked);
					if (result) {
						alert(result);
						signupRef.current.disabled = false;
					}

					//redirect
					if (redirect) {
						props.history.push('/');
					}
				}
			}>
				<div>
					<label htmlFor='email'>Email:</label>
					<input type='email' name='email' ref={emailRef} />
				</div>

				<div>
					<label htmlFor='username'>Username:</label>
					<input type='text' name='username' ref={usernameRef} />
				</div>

				<div>
					<label htmlFor='password'>Password:</label>
					<input type='password' name='password' ref={passwordRef} />
				</div>

				<div>
					<label htmlFor='retype'>Retype Password:</label>
					<input type='password' name='retype' ref={retypeRef} />
				</div>

				<div>
					<label htmlFor='contact'>Allow Promotional Emails:</label>
					<input type='checkbox' name='contact' ref={contactRef} />
				</div>

				<button type='submit' ref={signupRef}>Signup</button>
			</form>
		</div>
	);
};

const handleSubmit = async (email, username, password, retype, contact) => {
	email = email.trim();
	username = username.trim();

	const err = handleValidation(email, username, password, retype);

	if (err) {
		return [err];
	}

	//send to the auth server
	const result = await fetch(`${process.env.AUTH_URI}/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			email,
			username,
			password,
			contact
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
const handleValidation = (email, username, password, retype) => {
	if (!validateEmail(email)) {
		return 'invalid email';
	}

	if (!validateUsername(username)) {
		return 'invalid username';
	}

	if (password.length < 8) {
		return 'invalid password (Must be at least 8 characters long)';
	}

	if (password !== retype) {
		return 'passwords do not match';
	}

	return null;
};

export default SignUp;