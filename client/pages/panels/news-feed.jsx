import React, { useState, useEffect, useRef } from 'react';
import dateFormat from 'dateformat';

const NewsFeed = props => {
	const [articles, setArticles] = useState([]);
	const aborter = useRef(new AbortController()); //BUGFIX: double-renders = double fetches + react update after unmount

	useEffect(() => {
		//this... um...
		fetch(`${process.env.NEWS_URI}/news`, {
			signal: aborter.current.signal //oh dear
		})
			.then(blob => blob.json())
			.then(json => setArticles(json))
			.catch(e => null) //swallow errors
		;

		return () => aborter.current.abort(); //This is an ugly, ugly solution, but it's the only one that works
	}, []);

	return (
		<div className='panel'>
			<h1 className='text centered'>News Feed</h1>
			{articles.map((article, index) => {
				console.log(article)
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
