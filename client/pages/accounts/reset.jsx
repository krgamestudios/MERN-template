import React, { useContext, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

const Reset = props => {
	//params
	const [params, setParams] = useSearchParams(); //the URLSearchParams API

	//history
	const navigate = useNavigate();

	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (authTokens.accessToken || !params.has('email') || !params.has('token')) {
		navigate("/");
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
						const [err, redirect] = await update(passwordRef.current.value, retypeRef.current.value, params);

						if (err) {
							alert(err);
							return;
						}

						alert('Details updated'); //TODO: replace with a message from the auth server

						//redirect
						if (redirect) {
							navigate("/");
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

const update = async (password, retype, params) => {
	if (password != retype) {
		return ['Passwords do not match'];
	}

	if (password && password.length < 8) {
		return ['Password is too short'];
	}

	const result = await fetch(`${process.env.AUTH_URI}/auth/reset?email=${params.get('email')}&token=${params.get('token')}`, {
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