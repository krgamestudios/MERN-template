//react
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

//library components
import LazyRoute from './lazy-route';

//styling
//TODO: styling import

//common components
//TODO: header
//TODO: footer

const App = props => {
	return (
		<BrowserRouter>
				<Switch>
					<LazyRoute exact path='/' component={() => import('./pages/homepage')} />
				</Switch>
		</BrowserRouter>
	);
};

export default App;
