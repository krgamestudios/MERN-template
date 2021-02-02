import React, { useState } from 'react';
import dateFormat from 'dateformat';

//DOCS: props.uri is the address of a live news-server
const NewsFeed = props => {
	const [articles, setArticles] = useState(null);

	if (!articles) {
		fetch(props.uri, { method: 'GET' })
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
			<h2 className='centered'>News Feed</h2>
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
						<p>{article.body}</p>
					</div>
				);
			})}
		</div>
	);
};

export default NewsFeed;