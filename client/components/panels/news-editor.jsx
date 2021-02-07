import React, { useState } from 'react';
import Select from 'react-dropdown-select';

//DOCS: props.uri is the address of a live news-server
//DOCS: props.newsKey is the key of the live news-server
const NewsEditor = props => {
	let titleElement, authorElement, bodyElement;
	const [articles, setArticles] = useState(null);
	const [index, setIndex] = useState(null);

	if (!articles) {
		fetch(`${props.uri}/titles?limit=999`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
		})
			.then(a => {
				if (!a.ok) {
					throw `Network error ${a.status}: ${a.statusText} ${a.url}`;
				}
				return a.json();
			})
			.then(a => setArticles(a))
			.catch(e => console.error(e))
		;
	}

	return (
		<div>
			<h2 className='centered'>News Editor</h2>
			<div>
				<label htmlFor='article'>Article: </label>
				<Select
					options={(articles || []).map(article => { return { label: article.title, value: article.index }; })}
					onChange={values => setIndex(fetchSelection(values[0].value, titleElement, authorElement, bodyElement, props.uri))}
				/>
			</div>
			<form onSubmit={async e => {
				e.preventDefault();
				await handleSubmit(index, titleElement.value, authorElement.value, bodyElement.value, props.uri, props.newsKey);
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

				<button type='submit'>Update</button>
			</form>
		</div>
	);
};

const fetchSelection = (index, titleElement, authorElement, bodyElement, uri) => {
	fetch(`${uri}/archive/${index}`, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		})
		.then(blob => blob.json())
		.then(article => {
			titleElement.value = article.title;
			authorElement.value = article.author;
			bodyElement.value = article.body;
		})
		.catch(e => console.error(e))
	;

	return index; //this is admittedly odd
};

const handleSubmit = async (index, title, author, body, uri, newsKey) => {
	title = title.trim();
	author = author.trim();
	body = body.trim();
	uri = uri.trim();
	newsKey = newsKey.trim();

	//fetch POST json data
	const raw = await fetch(
		`${uri}/${index}`,
		{
			method: 'PATCH',
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
			alert(`Updated article index ${index}`);
		} else {
			alert(result.error);
		}
	} else {
		alert(raw.statusText);
	}
};

export default NewsEditor;
