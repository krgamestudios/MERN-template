import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

//utilities
const validateEmail = require('../../../common/utilities/validate-email.js');

const LogIn = props => {
	const [cookies, setCookie] = useCookies();

	//check for logged in redirect
	if (cookies['loggedin']) {
		return <Redirect to='/' />;
	}

	//refs
	let emailElement, passwordElement;

	return (
		<div className='page'>
			<h1 className='centered'>Login</h1>
			<form className='constricted' onSubmit={
				evt => {
					evt.preventDefault();
					handleSubmit(emailElement.value, passwordElement.value)
						.then(([res, ok]) => {
							alert(res);
							if (ok) {
								window.location.reload(true); //BUFGIX: force reload of the header element
							}
						})
						.catch(e => console.error(e))
					;
				}
			}>
				<div>
					<label htmlFor="email">Email:</label>
					<input type="email" name="email" ref={e => emailElement = e} />
				</div>

				<div>
					<label htmlFor="password">Password:</label>
					<input type="password" name="password" ref={e => passwordElement = e} />
				</div>

				<button type='submit'>Login</button>
			</form>
		</div>
	);
};

const handleSubmit = async (email, password) => {
	email = email.trim();

	const err = handleValidation(email, password);

	if (err) {
		return err;
	}

	//generate a new formdata payload
	let formData = new FormData();

	formData.append('email', email);
	formData.append('password', password);

	const result = await fetch('/api/accounts/login', { method: 'POST', body: formData });

	if (result.ok) {
		return [await result.text(), true];
	} else {
		return [await result.text(), false];
	}
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

export default LogIn;
