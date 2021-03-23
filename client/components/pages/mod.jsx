import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { TokenContext } from '../utilities/token-provider';

const Mod = props => {
	//context
	const authTokens = useContext(TokenContext);

	//misplaced? (admin only)
	if (!authTokens.accessToken || !(authTokens.getPayload().admin || authTokens.getPayload().mod)) {
		return <Redirect to='/' />;
	}

	return (
		<div className='page'>
			<h1 className='centered'>Moderation Tools</h1>
		</div>
	);
};

export default Mod;