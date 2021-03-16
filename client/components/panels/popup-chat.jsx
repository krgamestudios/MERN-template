import React, { useState, useRef } from 'react';
//import { io } from 'socket.io-client';

import '../../styles/popup-chat.css';

//const socket = io(`${process.env.CHAT_URI}/chat`);

const PopupChat = props => {
	const [open, setOpen] = useState(false);
	const [chatlog, setChatlog] = useState([
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '},
		{ username: 'foo', text: 'bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar bar '}
	]);

	const inputRef = useRef();

	if (!open) {
		return (
			<div className='chat'>
				<button type='button' className='open' onClick={() => handleOpen(setOpen)}>Open Chat</button>
			</div>
		);
	}

	return (
		<div className='chat'>
			<div className='log'>
				<ul className='scrollable'>
					{chatlog.map((line, index) => <li key={index} className='line'><span className='username'>{line.username}: </span><span className='text'>{line.text}</span></li>)}
				</ul>
			</div>
			<input type='text' className='input' placeholder='message' ref={inputRef}></input>
			<button type='button' className='send' onClick={() => handleSend(inputRef)}>Send</button>
			<button type='button' className='close' onClick={() => handleClose(setOpen)}>Close Chat</button>
		</div>
	);
};

const handleOpen = setOpen => {
	setOpen(true);

	//TODO
};

const handleClose = setOpen => {
	setOpen(false);

	//TODO
};

const handleSend = inputRef => {
	//TODO

	inputRef.current.value = '';
};

export default PopupChat;