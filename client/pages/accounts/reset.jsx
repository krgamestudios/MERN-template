import React, { useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import queryString from 'query-string';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

const Reset = props => {
	//context
	const authTokens = useContext(TokenContext);

	//query
	const query = queryString.parse(props.location.search);

	//misplaced?
	if (authTokens.accessToken || !query.email || !query.token) {
		return <Redirect to='/' />;
	}

	//refs
	const passwordRef = useRef();
	const retypeRef = useRef();

	//render the thing
	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<h1 className='text centered'>Reset Password</h1>
					<form className='constrained' onSubmit={async evt => {
						evt.preventDefault();
						const [err, redirect] = await update(passwordRef.current.value, retypeRef.current.value, query);

						if (err) {
							alert(err);
							return;
						}

						alert('Details updated'); //TODO: replace with a message from the auth server

						//redirect
						if (redirect) {
							props.history.push('/');
						}
					}}>
						<input type='password' name='password' placeholder='New Password' ref={passwordRef} />
						<input type='password' name='retype' placeholder='Retype New Password' ref={retypeRef} />
						<button type='submit'>Update Information</button>
					</form>
					<Link to='/' className='text centered'>Return Home</Link>
				</div>
			</div>
		</>
	);
};

const update = async (password, retype, query) => {
	if (password != retype) {
		return ['Passwords do not match'];
	}

	if (password && password.length < 8) {
		return ['Password is too short'];
	}

	const result = await fetch(`${process.env.AUTH_URI}/auth/reset?email=${query.email}&token=${query.token}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			password: password ? password : null,
		})
	});

	if (!result.ok) {
		return [`${await result.status}: ${await result.text()}`];
	} else {
		return [null, true];
	}
}

export default Reset;