import React from 'react';

import NewsFeed from '../panels/news-feed';

const HomePage = props => {
	//TODO: move the URIs into the config files
	return (
		<div className='page'>
			<p>This is the MERN template homepage.</p>
			<NewsFeed uri='http://dev-news.eggtrainer.com:3100/news' />
		</div>
	);
};

export default HomePage;
