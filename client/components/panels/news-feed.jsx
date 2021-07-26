import React, { useState, useEffect, useRef } from 'react';
import dateFormat from 'dateformat';

const NewsFeed = props => {
	const [articles, setArticles] = useState([]);
	const aborter = useRef(new AbortController()); //BUGFIX: double-renders = double fetches + react update after unmount

	useEffect(() => {
		//this... um...
		fetch(`${process.env.NEWS_URI}/news`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			signal: aborter.current.signal //oh dear
		})
			.then(blob => blob.json())
			.then(json => setArticles(json))
			.catch(e => null) //swallow errors
		;

		return () => aborter.current.abort(); //This is an ugly, ugly solution, but it's the only one that works
	}, []);

	return (
		<div>
			<h1 className='centered'>News Feed</h1>
			{(articles || []).map((article, index) => {
				//BUGFIX: check for empty data
				if (!article.title) {
					return article.title = '';
				}

				if (!article.author) {
					return article.author = '';
				}

				if (!article.body) {
					return article.body = '';
				}

				//render
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
