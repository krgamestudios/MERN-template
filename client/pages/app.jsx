//react
import React, { useContext } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { TokenContext } from './utilities/token-provider';

//library components
import LazyRoute from './utilities/lazy-route';
import MarkdownPage from './utilities/markdown-page';

//styling
import '../styles/styles.css';

//common components
import Footer from './panels/footer';
import PopupChat from './panels/popup-chat';

const App = props => {
	const authTokens = useContext(TokenContext);

	//default render
	return (
		<BrowserRouter>
				<Switch>
					<LazyRoute exact path='/' component={() => import('./homepage')} />

					<LazyRoute path='/signup' component={() => import('./accounts/signup')} />
					<LazyRoute path='/login' component={() => import('./accounts/login')} />
					<LazyRoute path='/account' component={() => import('./accounts/account')} />
					<LazyRoute path='/dashboard' component={() => import('./dashboard')} />

					<LazyRoute path='/recover' component={() => import('./accounts/recover')} />
					<LazyRoute path='/reset' component={() => import('./accounts/reset')} />

					<LazyRoute path='/admin' component={() => import('./administration/admin')} />
					<LazyRoute path='/mod' component={() => import('./administration/mod')} />

					<LazyRoute path='/privacypolicy' component={async () => () => <MarkdownPage content={require('../markdown/privacy-policy.md').default} />} />
					<LazyRoute path='/credits' component={async () => () => <MarkdownPage content={require('../markdown/credits.md').default} />} />

					<LazyRoute path='*' component={() => import('./not-found')} />
				</Switch>
				{ authTokens.accessToken ? <PopupChat /> : <></> }
				<Footer />
		</BrowserRouter>
	);
};

export default App;
