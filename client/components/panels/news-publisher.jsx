import React, { useContext, useRef } from 'react';

import { TokenContext } from '../utilities/token-provider';

const NewsPublisher = props => {
	//context
	const authTokens = useContext(TokenContext);

	//refs
	const titleRef = useRef();
	const authorRef = useRef();
	const bodyRef = useRef();

	return (
		<div>
			<h2 className='centered'>News Publisher</h2>
			<form onSubmit={async evt => {
				//on submit
				evt.preventDefault();
				const [err, index] = await handleSubmit(titleRef.current.value, authorRef.current.value, bodyRef.current.value, authTokens.tokenFetch);
				if (err) {
					alert(err);
				} else {
					titleRef.current.value = authorRef.current.value = bodyRef.current.value = '';
					alert(`Published as article index ${index}`);
				}
			}}>
				<div>
					<label htmlFor='title'>Title: </label>
					<input type='text' name='title' ref={titleRef} />
				</div>

				<div>
					<label htmlFor='author'>Author: </label>
					<input type='text' name='author' ref={authorRef} />
				</div>

				<div>
					<label htmlFor='body'>Body: </label>
					<textarea name='body' rows='10' cols='150' ref={bodyRef} />
				</div>

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