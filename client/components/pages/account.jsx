import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import DeleteAccount from '../panels/delete-account';

const Account = props => {
	const [cookies, setCookie] = useCookies();

	//check for logged in redirect
	if (!cookies['loggedin']) {
		return <Redirect to='/' />;
	}

	return (
		<div className='page'>
			<h1 className='centered'>Account</h1>
			<DeleteAccount />
		</div>
	);
};

export default Account;
