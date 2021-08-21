import React, { useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

const validateEmail = require('../../../common/utilities/validate-email');

const Login = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (authTokens.accessToken) {
		return <Redirect to='/' />;
	}

	//refs
	const emailRef = useRef();
	const passwordRef = useRef();

	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<div className='panel'>
						<h1 className='text centered'>Login</h1>
						<form className='constrained' onSubmit={
							async evt => {
								//on submit
								evt.preventDefault();
								const [err, newTokens] = await handleSubmit(emailRef.current.value, passwordRef.current.value);
								if (err) {
									alert(err);
								}

								//save auth tokens and redirect
								if (newTokens) {
									authTokens.setAccessToken(newTokens.accessToken);
									authTokens.setRefreshToken(newTokens.refreshToken);

									props.history.push('/');
								}
							}
						}>
							<input type='email' name='email' placeholder='your@email.com' ref={emailRef} />
							<input type='password' name='password' placeholder='********' ref={passwordRef} />
							<button type='submit'>Login</button>
						</form>
						<Link to='/recover' className='text centered'>Forgot Password?</Link>
						<Link to='/' className='text centered'>Return Home</Link>
					</div>
				</div>
			</div>
		</>
	);
};

//DOCS: returns two values: err and authTokens
const handleSubmit = async (email, password) => {
	email = email.trim();

	const err = handleValidation(email, password);

	if (err) {
		return [err, false];
	}

	//send to the auth server
	const result = await fetch(`${process.env.AUTH_URI}/auth/login`, {
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

	//handle errors
	if (!result.ok) {
		const err = `${result.status}: ${await result.text()}`;
		console.error(err);
		return [err, false];
	}

	//return the new auth tokens
	const newTokens = await result.json();
	return [null, newTokens];
};

//returns an error message, or null on success
const handleValidation = (email, password) => {
	if (!validateEmail(email)) {
		return 'invalid email';
	}

	if (password.length < 8) {
		return 'invalid password (Must be at least 8 characters long)';
	}

	return null;
};


export default Login;