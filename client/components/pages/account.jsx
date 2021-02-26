import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import DeleteAccount from '../panels/delete-account';

const Account = props => {
	const [cookies, setCookie] = useCookies();

	//check for logged in redirect
	if (!cookies['loggedin']) {
		return <Redirect to='/' />;
	}

	//refs
	let contactElement, passwordElement, retypeElement;

	//once before render
	useEffect(() => {
		fetch('/api/accounts')
			.then(blob => blob.json())
			.then(json => {
				contactElement.checked = json.contact;
			})
			.catch(e => console.error(e))
		;
	}, []);

	return (
		<div className='page'>
			<h1 className='centered'>Account</h1>
			<form className='constricted' onSubmit={async evt => {
				evt.preventDefault();
				await update(contactElement.checked, passwordElement.value, retypeElement.value);
				passwordElement.value = retypeElement.value = '';
			}}>
				<div>
					<div>
						<label htmlFor='contact'>Allow Promotional Emails:</label>
						<input type='checkbox' name='contact' ref={e => contactElement = e} />
					</div>

					<div>
						<label htmlFor='password'>Change Password:</label> 
						<input type='password' name='password' ref={e => passwordElement = e} />
					</div>

					<div>
						<label htmlFor='retype'>Retype Password:</label> 
						<input type='password' name='retype' ref={e => retypeElement = e} />
					</div>
				</div>

				<button type='submit'>Update Information</button>
			</form>

			<DeleteAccount className='constricted' />
		</div>
	);
};

const update = async (contact, password, retype) => {
	if (password != retype) {
		alert('Passwords do not match');
	}

	//generate a new formdata payload
	let formData = new FormData();

	formData.append('contact', contact);

	if (password) {
		formData.append('password', password);
	}

	const result = await fetch('/api/accounts', { method: 'PATCH', body: formData });

	if (result.ok) {
		alert(await result.text());
	} else {
		alert(await result.text());
	}
}

export default Account;
