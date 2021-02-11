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
	let contactElement;

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
				await update(contactElement.checked);
			}}>
				<div>
					<label htmlFor='contact'>Allow Promotional Emails:</label>
					<input type='checkbox' name='contact' ref={e => contactElement = e} />
				</div>

				<button type='submit'>Update Information</button>
			</form>

			<DeleteAccount className='constricted' />
		</div>
	);
};

const update = async (contact) => {
	//generate a new formdata payload
	let formData = new FormData();

	formData.append('contact', contact);

	const result = await fetch('/api/accounts', { method: 'PATCH', body: formData });

	if (result.ok) {
		alert(await result.text());
	} else {
		alert(await result.text());
	}
}

export default Account;
