import React, { useState, useEffect, createContext } from 'react';
import decode from 'jwt-decode';

export const TokenContext = createContext();

//DOCS: tokenFetch() and tokenCallback() are actually closures here

const TokenProvider = props => {
	//state to be used
	const [accessToken, setAccessToken] = useState('');

	//force a logout under certain conditions
	const forceLogout = () => {
		localStorage.removeItem("accessToken");
		setAccessToken("");
	};

	//make the access token persist between reloads
	useEffect(() => {
		setAccessToken(localStorage.getItem("accessToken") || '');
	}, []);

	//update the stored copies
	useEffect(() => {
		localStorage.setItem("accessToken", accessToken);
	}, [accessToken]);

	//wrap the default fetch function
	const tokenFetch = async (url, options) => {
		//use this?
		let bearer = accessToken;

		//if expired (10 minutes, normally)
		const expired = new Date(decode(accessToken).exp * 1000) < Date.now();

		if (expired) {
			//BUGFIX: if logging out, just skip over the refresh token
			if (url === `${process.env.AUTH_URI}/auth/logout`) {
				return fetch(url, {
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${bearer}`
					},
					credentials: 'include'
				});
			}

			//ping the auth server for a new access token
			const response = await fetch(`${process.env.AUTH_URI}/auth/token`, {
				method: 'POST',
				credentials: 'include'
			});

			//any errors, throw them
			if (!response.ok) {
				if (response.status == 403) {
					forceLogout();
				}
				throw `${response.status}: ${await response.text()}`;
			}

			//save the new auth stuff (setting bearer as well)
			const newAuth = await response.json();

			setAccessToken(newAuth.accessToken);
			bearer = newAuth.accessToken;
		}

		//finally, delegate to fetch
		return fetch(url, {
			...(options || {}),
			headers: {
				...(options || { headers: {} }).headers,
				'Authorization': `Bearer ${bearer}`
			},
			credentials: 'include'
		});
	};

	//access the refreshed token via callback
	const tokenCallback = async (cb) => {
		//if expired (10 minutes, normally)
		const expired = new Date(decode(accessToken).exp * 1000) < Date.now();

		if (expired) {
			//ping the auth server for a new token
			const response = await fetch(`${process.env.AUTH_URI}/auth/token`, {
				method: 'POST',
				credentials: 'include'
			});

			//any errors, throw them
			if (!response.ok) {
				if (response.status == 403) {
					forceLogout();
				}
				throw `${response.status}: ${await response.text()}`;
			}

			//save the new auth stuff (setting bearer as well)
			const newAuth = await response.json();

			setAccessToken(newAuth.accessToken);

			//finally
			return cb(newAuth.accessToken);
		} else {
			return cb(accessToken);
		}
	};

	return (
		<TokenContext.Provider value={{ accessToken, setAccessToken, tokenFetch, tokenCallback, getPayload: () => decode(accessToken) }}>
			{props.children}
		</TokenContext.Provider>
	)
};

export default TokenProvider;
