import React, { useState, useEffect, useRef, useContext } from 'react';
import { TokenContext } from '../utilities/token-provider';
import { io } from 'socket.io-client';

import '../../styles/popup-chat.css';

//TODO: I very much need to move this out of global state
const socket = io(`${process.env.CHAT_URI}/chat`);

const PopupChat = props => {
	const [open, setOpen] = useState(false);
	const [chatlog, setChatlog] = useState([{ emphasis: true, text: 'If chat doesn\'t load, reload the page' }]);

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
		pushChatlog({ createdAt: (new Date(Date.now())).toISOString(), username: username, text: inputRef.current.value });
	}

	inputRef.current.value = '';
};

//render each line
const processLine = (line, index, accessToken) => {
	//utility functions
	const isValidDate = d => {
		return d instanceof Date && !isNaN(d);
	};

	const isToday = d => {
		const now = new Date(Date.now());
		return d.getDate() == now.getDate() && d.getMonth() == now.getMonth() && d.getFullYear() == now.getFullYear();
	};

	//parse the date
	const date = new Date(line.createdAt);

	//split it up so we can format each field individually
	const month = `${date.getMonth() + 1}`;
	const day = `${date.getDate()}`;
	const hours = `${date.getHours()}`;
	const minutes = `${date.getMinutes()}`.padStart(2, '0');

	//combine into the final timestamp
	const timestamp = !isValidDate(date) ? '' : isToday(date) ? `${hours}:${minutes}` : `${month}/${day}`;

	//generate the content string
	let content = <div className='content row'>{timestamp.length > 0 ? <span className='timestamp col'>{timestamp}</span> : null }<span className='inner col'>{line.username ? <span className='username'>{line.username}: </span> : ''}{line.text ? <span className='text'>{line.text}</span> : ''}</span></div>;

	//decorators
	if (line.emphasis) {
		content = <em>{content}</em>;
	}

	if (line.strong) {
		content = <strong>{content}</strong>;
	}


	return <li key={index} className='line table noCollapse'>{content}<a className='report' onClick={() => processReport(line, accessToken)}>!!!</a></li>;
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