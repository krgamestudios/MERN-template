import React from 'react';
import { Link } from 'react-router';

const Static = props => {
	return (
		<div className='page central'>
			<header>
				<h1 className='text centered'>Credits</h1>
			</header>
			<h2 className='text centered'>MERN-template</h2>
			<p>The <a href='https://github.com/krgamestudios/MERN-template'>MERN-template</a> developed by Kayne Ruse, KR Game Studios</p>

			<Link className='text centered' to='/'>Return Home</Link>
		</div>
	);
};

export default Static;
