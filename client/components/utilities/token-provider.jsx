import React, { useState, useEffect, createContext } from 'react';
import decode from 'jwt-decode';

export const TokenContext = createContext();

const TokenProvider = props => {
	const [accessToken, setAccessToken] = useState('');
	const [refreshToken, setRefreshToken] = useState('');

	//make the access and refresh tokens persist between reloads
	useEffect(() => {
		setAccessToken(localStorage.getItem("accessToken") || '');
		setRefreshToken(localStorage.getItem("refreshToken") || '');
	}, [])

	useEffect(() => {
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
	}, [accessToken, refreshToken]);

	//wrap the default fetch function
	const tokenFetch = async (url, options) => {
		//use this?
		let bearer = accessToken;

		//if expired (10 minutes, normally)
		const expired = new Date(decode(accessToken).exp * 1000) < Date.now();

		if (expired) {
			//ping the auth server for a new token
			const response = await fetch(`${process.env.AUTH_URI}/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					token: refreshToken
				})
			});

			//any errors, throw them
			if (!response.ok) {
				throw `${response.status}: ${await response.text()}`;
			}

			//save the new auth stuff (setting bearer as well)
			const newAuth = await response.json();

			setAccessToken(newAuth.accessToken);
			setRefreshToken(newAuth.refreshToken);
			bearer = newAuth.accessToken;

			//BUGFIX: logging out correctly requires the new refresh token
			if (url == `${process.env.AUTH_URI}/logout`) {
				return fetch(`${process.env.AUTH_URI}/logout`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Authorization': `Bearer ${bearer}`
					},
					body: JSON.stringify({
						token: newAuth.refreshToken
					})
				});
			}
		}

		//finally, delegate to fetch
		return fetch(url, {
			...options,
			headers: {
				...options.headers,
				'Authorization': `Bearer ${bearer}`
			}
		});
	};

	return (
		<TokenContext.Provider value={{ accessToken, refreshToken, setAccessToken, setRefreshToken, tokenFetch, getPayload: () => decode(accessToken) }}>
			{props.children}
		</TokenContext.Provider>
	)
};

export default TokenProvider;
