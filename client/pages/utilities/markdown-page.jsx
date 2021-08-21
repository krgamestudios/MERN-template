import React from 'react';
import { Link } from 'react-router-dom';

import ApplyToBody from '../utilities/apply-to-body';

import MarkdownPanel from './markdown-panel';

const MarkdownPage = props => {
	return (
		<>
			<ApplyToBody className='dashboard' />
			<div className='page'>
				<div className='central panel'>
					<MarkdownPanel uri={props.uri} content={props.content} />
					<Link to='/' className='text centered'>Return Home</Link>
				</div>
			</div>
		</>
	)
};

export default MarkdownPage;