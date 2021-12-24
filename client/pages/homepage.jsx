import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import ApplyToBody from './utilities/apply-to-body';

import { TokenContext } from './utilities/token-provider';

import NewsFeed from './panels/news-feed';

const HomePage = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced?
	if (authTokens.accessToken) {
		return <Redirect to='/dashboard' />;
	}

	return (
		<>
			<ApplyToBody className='homepage' />
			<div className='page'>
				<div className='panel above'>
					<header>
						<h1 className='text centered'>MERN Template</h1>
						<h2 className='text centered'>This is the MERN-template</h2>
					</header>

					<div className='panel centered middle'>
						<Link to='/signup'><button>Sign Up</button></Link>
						<Link to='/login'><button>Login</button></Link>
					</div>
				</div>

				<div className='panel below'>
					<div className='central'>
						<NewsFeed />
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
