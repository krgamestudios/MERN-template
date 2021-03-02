//react
import React, { useState } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { useCookies } from 'react-cookie';

//library components
import LazyRoute from './lazy-route';
import Markdown from './panels/markdown';

//styling
//TODO: styling import

//common components
import Header from './panels/header.jsx';
import Footer from './panels/footer.jsx';

const App = props => {
	//handle cookies prompt
	const [cookies, setCookie] = useCookies();

	if (!cookies['accept-cookies']) {
		const accept = confirm('This website uses cookies to operate correctly. By clicking "ok", you agree to accept said cookies.');

		if (accept) {
			setCookie('accept-cookies', true);
		} else {
			return (
				<div>
					<p>This website won't operate correctly without cookies.</p>
					<button onClick={() => window.location.reload()}>Reload Page</button>
				</div>
			);
		}
	}

	//default render
	return (
		<BrowserRouter>
				<Header />
				<Switch>
					<LazyRoute exact path='/' component={() => import('./pages/homepage')} />

					<LazyRoute path='/signup' component={() => import('./pages/signup')} />
					<LazyRoute path='/login' component={() => import('./pages/login')} />
					<LazyRoute path='/account' component={() => import('./pages/account')} />
					<LazyRoute path='/chat' component={() => import('./pages/chat')} />

					<LazyRoute path='/admin' component={() => import('./pages/admin')} />

					<LazyRoute path='/privacypolicy' component={async () => () => <Markdown content={require('../markdown/privacy-policy.md').default} />} />
					<LazyRoute path='/credits' component={async () => () => <Markdown content={require('../markdown/credits.md').default} />} />

					<LazyRoute path='*' component={() => import('./pages/not-found')} />
				</Switch>
				<Footer />
		</BrowserRouter>
	);
};

export default App;
