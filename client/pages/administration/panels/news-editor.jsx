import React, { useState, useEffect, useContext, useRef } from 'react';
import Select from 'react-dropdown-select';

import { TokenContext } from '../../utilities/token-provider';

const NewsEditor = props => {
	//context
	const authTokens = useContext(TokenContext);

	//refs
	const titleRef = useRef();
	const authorRef = useRef();
	const bodyRef = useRef();

	//state
	const [articles, setArticles] = useState([]);
	const [index, setIndex] = useState(null);

	//run once
	useEffect(async () => {
		const result = await fetch(`${process.env.NEWS_URI}/news/metadata?limit=999`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
		});

		if (!result.ok) {
			const err = `${result.status}: ${await result.text()}`;
			console.log(err);
			alert(err);
		} else {
			setArticles(await result.json());
		}
	}, []);

	return (
		<div className='panel'>
			<h2 className='text centered'>News Editor</h2>
			<Select
				options={articles.map(article => { return { label: article.title, value: article.index }; })}
				onChange={async values => {
					//fetch this article
					const index = values[0].value;

					const result = await fetch(`${process.env.NEWS_URI}/news/archive/${index}`, {
						headers: {
							'Access-Control-Allow-Origin': '*'
						}
					});

					if (!result.ok) {
						const err = `${result.status}: ${await result.text()}`;
						console.log(err);
						alert(err);
					} else {
						const article = await result.json();
						titleRef.current.value = article.title;
						authorRef.current.value = article.author;
						bodyRef.current.value = article.body;
						setIndex(index);
				}
				}}
				placeholder='Select Article'
			/>

			<form className='constrained' onSubmit={async evt => {
				//onSubmit
				evt.preventDefault();
				const [err] = await handleSubmit(titleRef.current.value, authorRef.current.value, bodyRef.current.value, index, authTokens.tokenFetch);
				if (err) {
					alert(err);
				} else {
					titleRef.current.value = authorRef.current.value = bodyRef.current.value = '';
					alert(`Edited as article index ${index}`);
				}
			}}>
				<input type='text' name='title' placeholder='Title' ref={titleRef} />
				<input type='text' name='author' placeholder='Author' ref={authorRef} />
				<textarea name='body' rows='10' cols='150' placeholder='Body of the article goes here...' ref={bodyRef} />

				<button type='submit'>Update</button>
				<button type='button' onClick={async evt => {
					//onDelete
					const [err, result] = await handleDelete(index, authTokens.tokenFetch);

					if (err) {
						alert(err);
						return;
					}

					if (result) {
						titleRef.current.value = authorRef.current.value = bodyRef.current.value = '';
						alert(`Article deleted`);
					}
				}}>Delete</button>
			</form>
		</div>
	);
};

const handleSubmit = async (title, author, body, index, tokenFetch) => {
	title = title.trim();
	author = author.trim();
	body = body.trim();

	//fetch POST json data
	const result = await tokenFetch(`${process.env.NEWS_URI}/news/${index}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({
			title,
			author,
			body
		})
	});

	if (!result.ok) {
		return [`${result.status}: ${await result.text()}`];
	}

	return [null];
};

const handleDelete = async (index, tokenFetch) => {
	const conf = confirm('Are you sure you want to delete this article?');

	if (conf) {
		const result = await tokenFetch(`${process.env.NEWS_URI}/news/${index}`, {
			method: 'DELETE'
		});

		if (!result.ok) {
			const err = `${result.status}: ${await result.text()}`;
			return [err, false];
		}
	}

	return [null, conf];
};

export default NewsEditor;