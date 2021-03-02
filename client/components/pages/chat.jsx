import React from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Chat from '../panels/chat';

//Temporary chat page
const ChatPage = props => {
	const [cookies, setCookie] = useCookies();

	//check for logged in redirect
	if (!cookies['loggedin']) {
		return <Redirect to='/' />;
	}

	return (
		<div className='page'>
			<Chat uri={process.env.CHAT_URI} />
		</div>
	);
};

export default ChatPage;