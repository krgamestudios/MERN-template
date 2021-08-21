import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from './utilities/apply-to-body';

import { TokenContext } from './utilities/token-provider';

import MarkdownPanel from './utilities/markdown-panel';
import Logout from './accounts/panels/logout';

const Dashboard = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (!authTokens.accessToken) {
		return <Redirect to='/' />;
	}

	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<Link to='/account'>Account</Link>
					{ authTokens.getPayload().admin ? <Link to='/admin' className='text centered'>Admin</Link> : <></> }
					{ authTokens.getPayload().mod ? <Link to='/mod' className='text centered'>Mod</Link> : <></> }
					<Logout />
				</div>
			</div>
		</>
	);
};

export default Dashboard;
