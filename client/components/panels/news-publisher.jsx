import React from 'react';

const NewsPublisher = props => {
	let titleElement, authorElement, bodyElement;

	return (
		<div>
			<h2 className='centered'>News Publisher</h2>
			<form onSubmit={async e => {
				e.preventDefault();
				await handleSubmit(titleElement.value, authorElement.value, bodyElement.value, props.uri, props.newsKey);
				titleElement.value = authorElement.value = bodyElement.value = '';
			}}>
				<div>
					<label htmlFor='title'>Title: </label>
					<input type='text' name='title' ref={ e => titleElement = e } />
				</div>

				<div>
					<label htmlFor='author'>Author: </label>
					<input type='text' name='author' ref={ e => authorElement = e } />
				</div>

				<div>
					<label htmlFor='body'>Body: </label>
					<textarea name='body' rows='10' cols='150' ref={ e => bodyElement = e } />
				</div>

				<button type='submit'>Publish</button>
			</form>
		</div>
	);
};

const handleSubmit = async (title, author, body, uri, newsKey) => {
	title = title.trim();
	author = author.trim();
	body = body.trim();
	uri = uri.trim();
	newsKey = newsKey.trim();

	//fetch POST json data
	const raw = await fetch(
		uri,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({ title: title, author: author, body: body, key: newsKey })
		}
	);

	if (raw.ok) {
		const result = await raw.json();

		if (result.ok) {
			alert(`Published article index ${result.index}`);
		} else {
			alert(result.error);
		}
	} else {
		alert(raw.statusText);
	}
};

export default NewsPublisher;