import React from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';

const Loading = props => {
	if (props.error) {
		return <p>{props.error}</p>;
	}

	if (props.timedOut) {
		return (
			<div className='page'>
				<p>Page Timed Out</p>
			</div>
		);
	}

	if (props.pastDelay) {
		return (
			<div className='page'>
				<p>Page Loading...</p>
			</div>
		);
	}

	return null;
};

const LazyRoute = lazyProps => {
	const component = Loadable({
		loader: lazyProps.component,
		loading: Loading,
		timeout: 10000
	});

	return <Route {...lazyProps} component={component} />
};

export default LazyRoute;
