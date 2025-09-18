import React from 'react';
import { Link } from 'react-router';

const Static = props => {
	return (
		<div className='page central'>
			<header>
				<h1 className="text centered">Privacy Policy</h1>

				<Link className='text centered' to='/'>Return Home</Link>
			</header>
		</div>
	);
};

export default Static;
