import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

import NewsPublisher from '../panels/news-publisher';
import NewsEditor from '../panels/news-editor';

import GrantAdmin from '../panels/grant-admin';
import GrantMod from '../panels/grant-mod';

const Admin = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced? (admin only)
	if (!authTokens.accessToken || !authTokens.getPayload().admin) {
		return <Redirect to='/' />;
	}

	return (
		<div className='page'>
			<h1 className='centered'>Administration Tools</h1>
			<NewsPublisher />
			<NewsEditor />
			<GrantAdmin />
			<GrantMod />
		</div>
	);
};

export default Admin;