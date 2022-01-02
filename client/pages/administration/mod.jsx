import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import { TokenContext } from '../utilities/token-provider';

import NewsPublisher from './panels/news-publisher';
import NewsEditor from './panels/news-editor';

import ChatReports from './panels/chat-reports';
import BanUser from './panels/ban-user';

const Mod = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced? (admin only)
	if (!authTokens.accessToken || !(authTokens.getPayload().admin || authTokens.getPayload().mod)) {
		return <Redirect to='/' />;
	}

	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page panel'>
				<div className='central panel'>
					<h1 className='text centered'>Moderation Tools</h1>
					<NewsPublisher />
					<br />
					<NewsEditor />
					<br />
					<BanUser />
					<br />
					<ChatReports />
					<Link to='/' className='text centered'>Return Home</Link>
				</div>
			</div>
		</>
	);
};

export default Mod;