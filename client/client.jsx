import ReactDOM from 'react-dom/client';

import App from './pages/app';
import TokenProvider from './pages/utilities/token-provider';

ReactDOM
	.createRoot(document.getElementById('root'))
	.render(
		<TokenProvider>
			<App />
		</TokenProvider>
	)
;
