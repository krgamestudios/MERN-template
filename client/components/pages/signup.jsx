import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

//utilities
const validateEmail = require('../../../common/utilities/validate-email.js');
const validateUsername = require('../../../common/utilities/validate-username.js');

const SignUp = props => {
	const [cookies, setCookie] = useCookies(['loggedin']);

	//check for logged in redirect
	if (cookies['loggedin']) {
		return <Redirect to='/' />;
	}

	//refs
	let emailElement, usernameElement, passwordElement, retypeElement;

	return (
		<div className='page'>
			<h1 className='middle centered'>Signup</h1>
			<form className='constricted' onSubmit={
				evt => {
					evt.preventDefault();
					handleSubmit(emailElement.value, usernameElement.value, passwordElement.value, retypeElement.value)
						.then(res => res ? alert(res) : null)
						.then(() => emailElement.value = usernameElement.value = passwordElement.value = retypeElement.value = '') //clear input
						.then(() => props.history.push('/'))
						.catch(e => console.error(e))
					;
				}
			}>
				<div>
					<label htmlFor="email">Email:</label>
					<input type="email" name="email" ref={e => emailElement = e} />
				</div>

				<div>
					<label htmlFor="username">Username:</label>
					<input type="text" name="username" ref={e => usernameElement = e} />
				</div>

				<div>
					<label htmlFor="password">Password:</label>
					<input type="password" name="password" ref={e => passwordElement = e} />
				</div>

				<div>
					<label htmlFor="retype">Retype Password:</label>
					<input type="password" name="retype" ref={e => retypeElement = e} />
				</div>

				<button type='submit'>Signup</button>
			</form>
		</div>
	);
};

const handleSubmit = async (email, username, password, retype) => {
	email = email.trim();
	username = username.trim();

	const err = handleValidation(email, username, password, retype);
	
	if (err) {
		return err;
	}

	//generate a new formdata payload
	let formData = new FormData();

	formData.append('email', email);
	formData.append('username', username);
	formData.append('password', password);

	const result = await fetch('/api/accounts/signup', { method: 'POST', body: formData });

	if (result.ok) {
		return result.text();
	} else {
		return result.text();
	}
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
