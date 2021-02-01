const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { bannedEmails, accounts } = require('../database/models');
var cron = require('node-cron');

const route = async (req, res) => {
	console.log(req.fields.entry)
	//get the account, if one is found
	const account = await accounts.findOne({
		where: {
			[Op.or]: {
				email: {
					[Op.eq]: req.fields.entry
				},
				username: {
					[Op.eq]: req.fields.entry
				}
			}
		},
	});

	//accept either email or username
	const affectedRows = await bannedEmails.destroy({
		where: {
			email: {
				[Op.eq]: account?.email || req.fields.entry || ''
			}
		}
	});

	return res.status(200).send(`${affectedRows} emails unbanned`);
};

//delete any expired bans
cron.schedule('0 * * * *', () => {
	bannedEmails.destroy({
		where: {
			expiry: {
				[Op.lt]: Sequelize.fn('NOW'),
				[Op.not]: null
			}
		}
	});
});

module.exports = route;