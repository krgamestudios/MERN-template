import React, { useContext, useRef } from 'react';

import { TokenContext } from '../../utilities/token-provider';

const NewsPublisher = props => {
	//context
	const authTokens = useContext(TokenContext);

	//refs
	const titleRef = useRef();
	const authorRef = useRef();
	const bodyRef = useRef();

	return (
		<div className='panel'>
			<h2 className='text centered'>News Publisher</h2>
			<form className='constrained' onSubmit={async evt => {
				//on submit
				evt.preventDefault();
				const [err, index] = await handleSubmit(titleRef.current.value, authorRef.current.value, bodyRef.current.value, authTokens.tokenFetch);
				if (err) {
					alert(err);
				} else {
					titleRef.current.value = authorRef.current.value = bodyRef.current.value = ''; //TODO: null bug here?
					alert(`Published as article index ${index}`);
				}
			}}>
				<input type='text' name='title' placeholder='Title' ref={titleRef} />
				<input type='text' name='author' placeholder='Author' ref={authorRef} />
				<textarea name='body' rows='10' cols='150' placeholder='Body of the article goes here...' ref={bodyRef} />

				<button type='submit'>Publish</button>
			</form>
		</div>
	);
};

const handleSubmit = async (title, author, body, tokenFetch) => {
	title = title.trim();
	author = author.trim();
	body = body.trim();

	//fetch POST json data
	const result = await tokenFetch(
		`${process.env.NEWS_URI}/news`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				title,
				author,
				body
			})
		}
	);

	if (!result.ok) {
		return [`${result.status}: ${await result.text()}`];
	}

	const json = await result.json();

	return [null, json.index];
};

export default NewsPublisher;