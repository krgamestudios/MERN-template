//polyfills
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import TokenProvider from './components/utilities/token-provider';

ReactDOM.render(
	<TokenProvider>
		<App />
	</TokenProvider>,
	document.querySelector('#root')
);
