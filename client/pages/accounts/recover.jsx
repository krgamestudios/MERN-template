import React, { useContext, useRef } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

//utilities
const validateEmail = require('../../../common/utilities/validate-email');

const Recover = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (authTokens.accessToken) {
		return <Redirect to='/' />;
	}

	//refs
	const emailRef = useRef();
	const recoverRef = useRef();

	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<h1 className='text centered'>Forgot Password</h1>
					<form className='constrained' onSubmit={
						async evt => { //on submit
							recoverRef.current.disabled = true;
							evt.preventDefault();
							const [result, redirect] = await handleSubmit(emailRef.current.value);
							if (result) {
								alert(result);
								recoverRef.current.disabled = false;
							}

							//redirect
							if (redirect) {
								props.history.push('/');
							}
						}
					}>
						<input type='email' name='email' placeholder='your@email.com' ref={emailRef} />
						<button type='submit' ref={recoverRef}>Recover Password</button>
					</form>
					<Link to='/' className='text centered'>Return Home</Link>
				</div>
			</div>
		</>
	);
};

const handleSubmit = async (email) => {
	email = email.trim();

	const err = handleValidation(email);

	if (err) {
		return [err];
	}

	//send to the auth server
	const result = await fetch(`${process.env.AUTH_URI}/auth/recover`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			email
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
const handleValidation = (email) => {
	if (!validateEmail(email)) {
		return 'invalid email';
	}

	return null;
};

export default Recover;