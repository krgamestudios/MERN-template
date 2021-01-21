//react
import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';

//library components
import LazyRoute from './lazy-route';

//styling
//TODO: styling import

//common components
import Header from './panels/header.jsx';
import Footer from './panels/footer.jsx';

const App = props => {
	return (
		<BrowserRouter>
				<Header />
				<Switch>
					<LazyRoute exact path='/' component={() => import('./pages/homepage')} />
					
					<LazyRoute path='/signup' component={() => import('./pages/signup')} />
					<LazyRoute path='/login' component={() => import('./pages/login')} />
					<LazyRoute path='/account' component={() => import('./pages/account')} />
					
					<LazyRoute path='*' component={() => import('./pages/not-found')} />
				</Switch>
				<Footer />
		</BrowserRouter>
	);
};

export default App;
