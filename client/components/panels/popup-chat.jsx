import React, { useState, useEffect, useRef, useContext } from 'react';
import { TokenContext } from '../utilities/token-provider';
import { io } from 'socket.io-client';

import '../../styles/popup-chat.css';

const socket = io(`${process.env.CHAT_URI}/chat`);

const PopupChat = props => {
	const [open, setOpen] = useState(false);
	const [chatlog, setChatlog] = useState([]);

	const inputRef = useRef();
	const sendRef = useRef();
	const endRef = useRef();

	const authTokens = useContext(TokenContext);

	const pushChatlog = line => setChatlog(prevChatlog => [...prevChatlog, line]);

	useEffect(() => {
		socket.on('message', message => pushChatlog(message));
		socket.on('backlog', messages => setChatlog(prev => [...prev, ...messages]));
		socket.on('disconnect', reason => pushChatlog({ emphasis: true, text: 'Lost connection' }));
	}, []);

	useEffect(() => {
		if (open) {
			endRef.current.scrollIntoView();
		}
	}, [chatlog, open]);

	if (!open) {
		return (
			<div className='chat'>
				<button type='button' className='open' onClick={() => authTokens.tokenCallback(accessToken => handleOpen(setOpen, accessToken))}>Open Chat</button>
			</div>
		);
	}

	return (
		<div className='chat'>
			<div className='log'>
				<ul className='scrollable'>
					{chatlog.map((line, index) => processLine(line, index, authTokens.accessToken))}
					<li ref={endRef} />
				</ul>
			</div>
			<input type='text' className='input' placeholder='message' onKeyPress={evt => evt.key == 'Enter' ? sendRef.current.click() : ''} ref={inputRef} />
			<button type='button' className='send' onClick={() => authTokens.tokenCallback(accessToken => handleSend(inputRef, pushChatlog, authTokens.getPayload().username, accessToken))} ref={sendRef}>Send</button>
			<button type='button' className='close' onClick={() => handleClose(setOpen)}>Close Chat</button>
		</div>
	);
};

//handlers
const handleOpen = (setOpen, accessToken) => {
	setOpen(true);

	socket.emit('open chat', {
		accessToken
	});
};

const handleClose = setOpen => {
	setOpen(false);
};

const handleSend = (inputRef, pushChatlog, username, accessToken) => {
	if (inputRef.current.value == '') {
		return;
	}

	socket.emit('message', {
		accessToken,
		text: inputRef.current.value
	});

	if (!inputRef.current.value.startsWith('/')) {
		pushChatlog({ username: username, text: inputRef.current.value });
	}

	inputRef.current.value = '';
};

//render each line
const processLine = (line, index, accessToken) => {
	let content = <div className='content'>{line.username ? <span className='username'>{line.username}: </span> : ''}{line.text ? <span className='text'>{line.text}</span> : ''}</div>;

	//decorators
	if (line.emphasis) {
		content = <em>{content}</em>;
	}

	if (line.strong) {
		content = <strong>{content}</strong>;
	}

	return <li key={index} className='line'>{content}<div className='report'><a onClick={() => processReport(line, accessToken)} style={{ display: line.index && !line.notification ? 'flex' : 'none' }}>!!!</a></div></li>;
};

const processReport = (line, accessToken) => {
	const yes = confirm('Report this message?');

	if (yes) {
		socket.emit('report', {
			accessToken,
			index: line.index
		});
	}
};

export default PopupChat;