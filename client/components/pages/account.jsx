import React, { useEffect, useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

import DeleteAccount from '../panels/delete-account';

const Account = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (!authTokens.accessToken) {
		return <Redirect to='/' />;
	}

	//refs
	const passwordRef = useRef();
	const retypeRef = useRef();
	const contactRef = useRef();

	//grab the user's info
	useEffect(() => {
		authTokens.tokenFetch(`${process.env.AUTH_URI}/auth/account`, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		})
			.then(blob => blob.json())
			.then(json => contactRef.current.checked = json.contact)
			.catch(e => console.error(e))
		;
	}, []);

	//render the thing
	return (
		<div className='page'>
			<h1 className='centered'>Account</h1>
			<form className='constrained' onSubmit={async evt => {
				evt.preventDefault();
				const [err] = await update(passwordRef.current.value, retypeRef.current.value, contactRef.current.checked, authTokens.tokenFetch);

				if (err) {
					alert(err);
					return;
				}

				alert('Details updated');
				passwordRef.current.value = retypeRef.current.value = '';
			}}>
				<div>
					<div>
						<label htmlFor='password'>Change Password:</label> 
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
				</div>

				<button type='submit'>Update Information</button>
			</form>

			<DeleteAccount className='constrained' />
		</div>
	);
};

const update = async (password, retype, contact, tokenFetch) => {
	if (password != retype) {
		return ['Passwords do not match'];
	}

	if (password && password.length < 8) {
		return ['Password is too short'];
	}

	const result = await tokenFetch(`${process.env.AUTH_URI}/auth/account`, {
		method: 'PATCH',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			password: password ? password : null,
			contact
		})
	});

	if (!result.ok) {
		return [`${await result.status}: ${await result.text()}`];
	} else {
		return [null];
	}
}

export default Account;