//polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';

import App from './components/app';

ReactDOM.render(
	<CookiesProvider>
		<App />
	</CookiesProvider>,
	document.querySelector('#root')
);
