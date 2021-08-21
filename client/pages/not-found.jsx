import React from 'react';
import { Link } from 'react-router-dom';

import ApplyToBody from './utilities/apply-to-body';

const NotFound = props => {
	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel centered middle'>
					<h1 className='text centered'>Page Not Found</h1>
					<br />
					<Link className='text centered' to='/'>Return Home</Link>
				</div>
			</div>
		</>
	);
};

export default NotFound;
