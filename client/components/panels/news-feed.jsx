import React, { useState } from 'react';

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
						<h3>{article.author}</h3>
						{ article.edits > 0 ? <p><em>{`${article.edits} edit${article.edits > 1 ? 's': ''}`}</em></p> : null }
						<p>{article.body}</p>
					</div>
				);
			})}
		</div>
	);
};

export default NewsFeed;