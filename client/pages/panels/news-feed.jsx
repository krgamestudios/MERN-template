import React, { useState, useEffect } from 'react';
import dateFormat from 'dateformat';

const NewsFeed = props => {
	const [articles, setArticles] = useState([]);

	useEffect(() => {
		let isMounted = true;
		fetch(`${process.env.NEWS_URI}/news`)
			.then(blob => blob.json())
			.then(json => {
				if (isMounted) {
					setArticles(json);
				}
			})
			.catch(console.error);

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<div className='panel'>
			<h1 className='text centered'>News Feed</h1>
			{articles.map((article, index) => {
				return (
					<div key={index} className='panel'>
						<hr />
						<h2>{article.title}</h2>
						<br />
						<p><em>Written by <strong>{article.author}</strong>, {
							article.edits > 0 ?
							<span>Last Updated {dateFormat(article.updatedAt, 'fullDate')} ({`${article.edits} edit${article.edits > 1 ? 's': ''}`})</span> :
							<span>Published {dateFormat(article.createdAt, 'fullDate')}</span>
						}</em></p>
						<br />
						<div dangerouslySetInnerHTML={{ __html: article.rendered }} />
					</div>
				);
			})}
		</div>
	);
};

export default NewsFeed;