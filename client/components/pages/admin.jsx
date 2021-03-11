import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

import NewsPublisher from '../panels/news-publisher';
import NewsEditor from '../panels/news-editor';

const Admin = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced? (admin only)
	if (!authTokens.accessToken || !authTokens.getPayload().privilege == 'administrator') {
		return <Redirect to='/' />;
	}

	return (
		<div className='page'>
			<h1 className='centered'>Administration</h1>
			<NewsPublisher />
			<NewsEditor />
		</div>
	);
};

export default Admin;