//react
import React, { useContext, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TokenContext } from './utilities/token-provider';

//styling
import '../styles/styles.css';

//common components
import Footer from './panels/footer';
import PopupChat from './panels/popup-chat';

//lazy wrappers
const Homepage = lazy(() => import('./homepage'));
const Signup = lazy(() => import('./accounts/signup'));
const Login = lazy(() => import('./accounts/login'));
const Account = lazy(() => import('./accounts/account'));
const Dashboard = lazy(() => import('./dashboard'));
const Recover = lazy(() => import('./accounts/recover'));
const Reset = lazy(() => import('./accounts/reset'));
const Admin = lazy(() => import('./administration/admin'));
const Mod = lazy(() => import('./administration/mod'));
const PrivacyPolicy = lazy(() => import('./static/privacy-policy'));
const Credits = lazy(() => import('./static/credits'));
const NotFound = lazy(() => import('./not-found'));

const App = props => {
	const authTokens = useContext(TokenContext);

	//default render
	return (
		<BrowserRouter>
			<Suspense>
				<Routes>
					<Route exact path='/' element={<Homepage />} />

					<Route path='/signup' element={<Signup />} />
					<Route path='/login' element={<Login />} />
					<Route path='/account' element={<Account />} />
					<Route path='/dashboard' element={<Dashboard />} />

					<Route path='/recover' element={<Recover />} />
					<Route path='/reset' element={<Reset />} />

					<Route path='/admin' element={<Admin />} />
					<Route path='/mod' element={<Mod />} />

					<Route path='/privacypolicy' element={<PrivacyPolicy />} />
					<Route path='/credits' element={<Credits />} />

					<Route path='*' element={<NotFound />} />
				</Routes>
			</Suspense>
			{ authTokens.accessToken ? <PopupChat /> : <></> }
			<Footer />
		</BrowserRouter>
	);
};

export default App;
