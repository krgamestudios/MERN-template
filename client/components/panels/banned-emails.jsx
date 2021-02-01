import React, { useState, useEffect } from 'react';

const BannedEmails = props => {
	const [data, setData] = useState(null);
	let usernameElement, emailElement, expiryElement, reasonElement;
	let unbanElement;

	fetch('/api/admin/banned', { method: 'GET' })
		.then(banned => banned.json())
		.then(banned => !data ? setData(banned) : null)
		.catch(e => console.error(e))
	;

	return (
		<div>
			<h2>Banned Accounts</h2>
			<table>
				<thead>
					<tr>
						<th>Username</th>
						<th>Email</th>
						<th>Privilege</th>
						<th>Expiry</th>
						<th>Reason</th>
					</tr>
				</thead>
				<tbody>
					{(data || []).map((entry, index) =>
					<tr key={index}>
						<td>{entry.username}</td>
						<td>{entry.email}</td>
						<td>{entry.privilege}</td>
						<td>{entry.expiry ? (new Date(entry.expiry)).toISOString() : null}</td>
						<td>{entry.reason}</td>
					</tr>
					)}
				</tbody>
			</table>

			<h2>Ban</h2>
			<form onSubmit={async e => { e.preventDefault(); await handleBan(usernameElement.value, emailElement.value, expiryElement.value, reasonElement.value); }}>
				<div>
					<label htmlFor='username'>Username: </label>
					<input type='text' name='username' ref={e => usernameElement = e} />
				</div>

				<div>
					<label htmlFor='email'>Email: </label>
					<input type='email' name='email' ref={e => emailElement = e} />
				</div>

				<div>
					<label htmlFor='expiry'>Expiry: </label>
					<input type='date' name='expiry' ref={e => expiryElement = e} />
				</div>

				<div>
					<label htmlFor='reason'>Reason: </label>
					<textarea rows='4' cols='50' name='reason' ref={e => reasonElement = e} />
				</div>

				<button type='submit'>Drop The Banhammer</button>
			</form>

			<h2>Unban</h2>
			<form onSubmit={async e => { e.preventDefault(); await handleUnban(unbanElement.value); }}>
				<div>
					<label htmlFor='entry'>Unban User: </label>
					<input type='text' name='entry' ref={e => unbanElement = e} />
				</div>

				<button type='submit'>Release From Horny Jail</button>
			</form>
		</div>
	);
};

const handleBan = async (username, email, expiry, reason) => {
	username = username.trim();
	email = email.trim();
	reason = reason.trim();

	//generate a new formdata payload
	let formData = new FormData();

	formData.append('username', username);
	formData.append('email', email);
	formData.append('expiry', expiry);
	formData.append('reason', reason);

	const result = await fetch('/api/admin/ban', { method: 'POST', body: formData });

	alert(await result.text());
};

const handleUnban = async (entry) => {
	entry = entry.trim();

	let formData = new FormData();

	formData.append('entry', entry);

	const result = await fetch('/api/admin/unban', { method: 'POST', body: formData });

	alert(await result.text());
};

export default BannedEmails;