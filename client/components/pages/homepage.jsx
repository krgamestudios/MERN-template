import React from 'react';

import NewsFeed from '../panels/news-feed';

const HomePage = props => {
	return (
		<div className='page'>
			<p>This is the MERN template homepage.</p>
			<NewsFeed />
		</div>
	);
};

export default HomePage;
