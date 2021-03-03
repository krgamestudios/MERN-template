const fetch = require('node-fetch');
const FormData = require('form-data');

const route = async (req, res) => {
	if (!req.session.account) {
		return status(403).send('No account detected');
	}

	//build the fake form data object
	let form = new FormData();
	form.append('username', req.session?.account?.username);
	form.append('key', process.env.CHAT_KEY);

	try {
		//reserve the UUID with the chat server (hop 1)
		const result = await fetch(`http${process.env.PRODUCTION ? 's' : ''}://${process.env.CHAT_URI}/reserve`, { method: 'POST', body: form });

		if (result.status == 200) {
			const json = await result.json();
			res.cookie('pseudonym', json.pseudonym);
			res.status(200).send({ ok: true });
		} else {
			throw await result.text();
		}
	} catch(e) {
		console.error(`Chat server error: ${e}`);
		res.cookie('pseudonym', '.null');
		res.status(200).send({ ok: false, error: `Chat server error ${e}` });
	}
};

module.exports = route;