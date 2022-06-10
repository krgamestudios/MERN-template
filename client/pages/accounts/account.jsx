import React, { useEffect, useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

import DeleteAccount from './panels/delete-account';

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
		authTokens.tokenFetch(`${process.env.AUTH_URI}/auth/account`)
			.then(blob => blob.json())
			.then(json => contactRef.current.checked = json.contact)
			.catch(e => console.error(e))
		;
	}, []);

	//render the thing
	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<div className='panel'>
						<h1 className='text centered'>Account</h1>
						<div className='panel'>
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
								<input type='password' name='password' placeholder='New Password' ref={passwordRef} />
								<input type='password' name='retype'  placeholder='Retype New Password' ref={retypeRef} />

								<span>
									<label htmlFor='contact'>Allow Promotional Emails:</label>
									<input type='checkbox' name='contact' ref={contactRef} />
								</span>

								<button type='submit'>Update Information</button>
							</form>
							<DeleteAccount />
						</div>
						<Link to='/' className='text centered'>Return Home</Link>\
					</div>
				</div>
			</div>
		</>
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