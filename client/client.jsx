//polyfills
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './pages/app';
import TokenProvider from './pages/utilities/token-provider';

ReactDOM.render(
	<TokenProvider>
		<App />
	</TokenProvider>,
	document.querySelector('#root')
);
