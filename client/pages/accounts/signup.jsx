import React, { useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

//utilities
const validateEmail = require('../../../common/utilities/validate-email');
const validateUsername = require('../../../common/utilities/validate-username');

const Signup = props => {
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
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<h1 className='text centered'>Signup</h1>
					<form className='constrained' onSubmit={
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

						<input type='email' name='email' placeholder='your@email.com' ref={emailRef} />
						<input type='text' name='username' placeholder='Username' ref={usernameRef} />
						<input type='password' name='password' placeholder='********' ref={passwordRef} />
						<input type='password' name='retype' placeholder='********' ref={retypeRef} />

						<span>
							<label htmlFor='contact'>Allow Emails:</label>
							<input type='checkbox' name='contact' ref={contactRef} defaultChecked='true' />
						</span>

						<button type='submit' ref={signupRef}>Signup</button>
					</form>
					<Link to='/recover' className='text centered'>Forgot Password?</Link>
					<Link to='/' className='text centered'>Return Home</Link>
				</div>
			</div>
		</>
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
			'Content-Type': 'application/json'
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

export default Signup;