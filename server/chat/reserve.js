const fetch = require('node-fetch');
const FormData = require('form-data');

const route = async (req, res) => {
	//build the fake form data object
	let form = new FormData();
	form.append('username', req.session?.account?.username);

	try {
		//reserve the UUID with the chat server (hop 1)
		const result = await fetch(`http://${process.env.CHAT_URI}/reserve`, { method: 'POST', body: form });

		const json = await result.json();
		res.cookie('pseudonym', json.pseudonym);
		res.status(200).send({ ok: true });
	} catch(e) {
		console.error('Chat server not found');
		res.cookie('pseudonym', '.null');
		res.status(200).send({ ok: false, error: 'Chat server not found' });
	}
};

module.exports = route;