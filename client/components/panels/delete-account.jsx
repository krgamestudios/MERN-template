import React, { useState } from 'react';

//DOCS: isolated the delete account button into it's own panel, so it can be easily moved as needed
const DeleteAccount = props => {
	const [open, setOpen] = useState(false);

	if (!open) {
		return <button onClick={() => setOpen(true)}>Delete Account</button>
	}

	let passwordElement;

	return (
		<form className='constricted' onSubmit={async evt => {
			evt.preventDefault();
			const password = passwordElement.value;
			passwordElement.value = '';
			await handleSubmit(password);
		}}>
			<div>
				<label htmlFor="password">Password:</label>
				<input type="password" name="password" ref={e => passwordElement = e} />
			</div>

			<button type='submit'>Delete Account</button>
			<button type='cancel' onClick={() => { passwordElement.value = ''; setOpen(false); }}>Cancel</button>
		</form>
	);
};

const handleSubmit = async (password) => {
	//generate a new formdata payload
	let formData = new FormData();

	formData.append('password', password);

	const result = await fetch('/api/accounts/deletion', { method: 'POST', body: formData });

	if (!result.ok) {
		alert(await result.text());
	} else {
		//force logout
		fetch('/api/accounts/logout', { method: 'POST' })
			.then(alert(await result.text()))
			.then(() => window.location.reload(true)) //BUFGIX: force reload of the header element
			.catch(e => console.error(e))
		;
	}
};

export default DeleteAccount;