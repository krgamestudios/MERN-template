import React, { useState, useEffect } from 'react';
import dateFormat from 'dateformat';

//DOCS: props.uri is the address of a live news-server
const NewsFeed = props => {
	const [articles, setArticles] = useState([]);

	useEffect(async () => {
		const result = await fetch(`${process.env.NEWS_URI}/news`, {
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
		<div>
			<h1 className='centered'>News Feed</h1>
			{articles.map((article, index) => {
				return (
					<div key={index}>
						<hr />
						<h2>{article.title}</h2>
						<p>Written by <strong>{article.author}</strong>, {
							article.edits > 0 ?
							<span>Last Updated {dateFormat(article.updatedAt, 'fullDate')} ({`${article.edits} edit${article.edits > 1 ? 's': ''}`})</span> :
							<span>Published {dateFormat(article.createdAt, 'fullDate')}</span>
						}</p>
						<p style={{whiteSpace: 'pre-wrap'}}>{article.body}</p>
					</div>
				);
			})}
		</div>
	);
};

export default NewsFeed;
