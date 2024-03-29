import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

import GrantAdmin from './panels/grant-admin';
import GrantMod from './panels/grant-mod';

const Admin = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced? (admin only)
	if (!authTokens.accessToken || !authTokens.getPayload().admin) {
		return <Navigate to='/' />;
	}

	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page panel'>
				<div className='central panel'>
					<h1 className='text centered'>Administration Tools</h1>
					<br />
					<GrantAdmin />
					<br />
					<GrantMod />
					<Link to='/' className='text centered'>Return Home</Link>
				</div>
			</div>
		</>
	);
};

export default Admin;