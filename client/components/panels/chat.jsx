import React from 'react';
import { useCookies } from 'react-cookie';

const Chat = props => {
	requestPseudonym();

	return (
		<div className='chat'>
			<p>Chat URI: {props.uri}</p>
			<p>Chat Paragraph TODO</p>
		</div>
	);
};

const requestPseudonym = () => {
	const [cookies, setCookie] = useCookies();

	//if your username hasn't been reserved
	if (!cookies['pseudonym']) {
		fetch('/api/chat/reserve', { method: 'POST' })
			.then(msg => msg.json())
			.then(json => {
				if (!json.ok) { //I don't like doing this
					console.error(json.error);
				}
			})
			.catch(e => console.error(e))
		;
	}
};

export default Chat;