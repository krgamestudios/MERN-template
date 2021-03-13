import React, { useState, useRef, useContext } from 'react';
import Select from 'react-dropdown-select';

import { TokenContext } from '../utilities/token-provider';

const PrivilegeEditor = props => {
	//context
	const authTokens = useContext(TokenContext);

	//state
	const [privilege, setPrivilege] = useState('normal');

	//ref
	const usernameRef = useRef();

	return (
		<div>
			<h2 className='centered'>Privilege Editor</h2>
			<form onSubmit={async evt => {
				evt.preventDefault();
				const [err, result] = await handleSubmit(usernameRef.current.value, privilege, authTokens.tokenFetch);

				if (err) {
					alert(err);
				}

				if (result) {
					alert('Privilege set');
					usernameRef.current.value = '';
				}
			}}>
				<div>
					<label htmlFor='username'>Username:</label>
					<input type='text' name='username' ref={usernameRef} />
				</div>

				<Select
					options={[{ label: 'administrator', value: 1 }, { label: 'moderator', value: 2 }, { label: 'alpha', value: 3 }, { label: 'beta', value: 4 }, { label: 'gamma', value: 5 }, { label: 'normal', value: 6 }]}
					onChange={values => setPrivilege(values[0].label)}
				/>

				<button type='submit'>Change</button>
			</form>
		</div>
	);
};

const handleSubmit = async (username, privilege, tokenFetch) => {
	const result = await tokenFetch(`${process.env.AUTH_URI}/admin/privilege`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			username,
			privilege
		})
	});

	if (!result.ok) {
		const err = `${result.status}: ${await result.text()}`;
		console.log(err);
		return [err, false];
	}

	return [null, true];
};

export default PrivilegeEditor;
