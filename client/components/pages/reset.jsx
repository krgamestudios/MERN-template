import React, { useContext, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';

import { TokenContext } from '../utilities/token-provider';

const Reset = props => {
	//context
	const authTokens = useContext(TokenContext);

	//query
	query = queryString.parse(props.location.search);

	//misplaced?
	if (authTokens.accessToken || !query.email || !query.token) {
		return <Redirect to='/' />;
	}

	//refs
	const passwordRef = useRef();
	const retypeRef = useRef();
	const resetRef = useRef();

	//render the thing
	return (
		<div className='page'>
			<h1 className='centered'>Reset Password</h1>
			<form className='constricted' onSubmit={async evt => {
				evt.preventDefault();
				const [err] = await update(passwordRef.current.value, retypeRef.current.value, query);

				if (err) {
					alert(err);
					return;
				}

				alert('Details updated');

				//redirect
				if (redirect) {
					props.history.push('/');
				}
			}}>
				<div>
					<div>
						<label htmlFor='password'>Enter New Password:</label> 
						<input type='password' name='password' ref={passwordRef} />
					</div>

					<div>
						<label htmlFor='retype'>Retype New Password:</label> 
						<input type='password' name='retype' ref={retypeRef} />
					</div>
				</div>

				<button type='submit'>Update Information</button>
			</form>

			<DeleteAccount className='constricted' />
		</div>
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
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			password: password ? password : null,
		})
	});

	if (!result.ok) {
		return [`${await result.status}: ${await result.text()}`];
	} else {
		return [null];
	}
}

export default Reset;