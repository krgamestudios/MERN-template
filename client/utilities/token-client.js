import decode from 'jwt-decode';
import Cookies from 'universal-cookie';

export async function setToken(access, refresh) {
	const cookies = new Cookies();
	cookies.set('access', access, { path: '/' });
	cookies.set('refresh', refresh, { path: '/' });
};

export async function getToken() {
	const cookies = new Cookies();

	try {
		const access = cookies.get('access');
		const refresh = cookies.get('refresh');

		if (!access || !refresh) {
			return null;
		}

		//if expired, refresh
		if (new Date(decode(access).exp * 1000) < Date.now()) {
			const result = await fetch(`${process.env.AUTH_URI}/token`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*'
				},
				body: JSON.stringify({
					token: refresh
				})
			});

			const authTokens = await result.json();

			await setToken(authTokens.accessToken, authTokens.refreshToken);

			return authTokens.accessToken;
		} else {
			return access;
		}
	}
	catch (e) {
		console.error(e);
		return null;
	}
};

export async function getRefreshToken() {
	const cookies = new Cookies();

	const refresh = cookies.get('refresh');

	return refresh || null;
};

export async function clearToken() {
	const cookies = new Cookies();

	cookies.remove('access');
	cookies.remove('refresh');
}