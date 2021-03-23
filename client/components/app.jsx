//react
import React, { useContext } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { TokenContext } from './utilities/token-provider';

//library components
import LazyRoute from './utilities/lazy-route';
import Markdown from './panels/markdown';

//styling
//import a styling template here

//common components
import Header from './panels/header';
import Footer from './panels/footer';
import PopupChat from './panels/popup-chat';

const App = props => {
	const authTokens = useContext(TokenContext);

	//default render
	return (
		<BrowserRouter>
				<Header />
				<Switch>
					<LazyRoute exact path='/' component={() => import('./pages/homepage')} />

					<LazyRoute path='/signup' component={() => import('./pages/signup')} />
					<LazyRoute path='/login' component={() => import('./pages/login')} />
					<LazyRoute path='/account' component={() => import('./pages/account')} />

					<LazyRoute path='/admin' component={() => import('./pages/admin')} />

					<LazyRoute path='/privacypolicy' component={async () => () => <Markdown content={require('../markdown/privacy-policy.md').default} />} />
					<LazyRoute path='/credits' component={async () => () => <Markdown content={require('../markdown/credits.md').default} />} />

					<LazyRoute path='*' component={() => import('./pages/not-found')} />
				</Switch>
				{ authTokens.accessToken ? <PopupChat /> : <></> }
				<Footer />
		</BrowserRouter>
	);
};

export default App;
