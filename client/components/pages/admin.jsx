import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

//import BannedEmails from '../panels/banned-emails';
import NewsPublisher from '../panels/news-publisher';

const Admin = props => {
	const [cookies, setCookie] = useCookies();

	//check for logged in redirect
	if (!cookies['admin']) {
		return <Redirect to='/' />;
	}

	return (
		<div className='page'>
			<h1 className='centered'>Administration</h1>
			<NewsPublisher uri={process.env.NEWS_URI} newsKey={process.env.NEWS_KEY} />
		</div>
	);
};

export default Admin;
