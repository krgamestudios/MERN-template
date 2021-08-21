import React from 'react';
import { Route } from 'react-router-dom';
import loadable from '@loadable/component';

const LazyRoute = props => {
	const { component, ...lazyProps } = props;

	const lazyComponent = loadable(component);

	return <Route {...lazyProps} component={lazyComponent} />
};

export default LazyRoute;
