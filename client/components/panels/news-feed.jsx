import React, { useState } from 'react';
import dateFormat from 'dateformat';

//DOCS: props.uri is the address of a live news-server
const NewsFeed = props => {
	const [articles, setArticles] = useState(null);

	if (!articles) {
		fetch(props.uri, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
		})
			.then(blob => blob.json())
			.then(a => setArticles(a))
			.catch(e => console.error(e))
		;
	}

	return (
		<div>
			<h1 className='centered'>News Feed</h1>
			{(articles || []).map((article, index) => {
				return (
					<div key={index}>
						<hr />
						<h2>{article.title}</h2>
						<p>Written by <strong>{article.author}</strong>, {
							article.edits > 0 ?
							<span>Last Updated {dateFormat(articles.updatedAt, 'fullDate')} ({`${article.edits} edit${article.edits > 1 ? 's': ''}`})</span> :
							<span>Published {dateFormat(articles.createdAt, 'fullDate')}</span>
						}</p>
						<p style={{whiteSpace: 'pre-wrap'}}>{article.body}</p>
					</div>
				);
			})}
		</div>
	);
};

export default NewsFeed;
