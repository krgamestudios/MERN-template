import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../../utilities/token-provider';
import dateFormat from 'dateformat';

const ChatReports = props => {
	const [reports, setReports] = useState([]);

	const authTokens = useContext(TokenContext);

	useEffect(async () => {
		const result = await authTokens.tokenFetch(`${process.env.CHAT_URI}/admin/reports`);

		if (!result.ok) {
			const err = `${result.status}: ${await result.text()}`;
			console.log(err);
			alert(err);
		} else {
			setReports(await result.json());
		}
	}, []);

	return (
		<div className='panel' style={{minWidth: '100%'}}>
			<h2 className='text centered'>Chat Reports</h2>
			<table>
				<thead>
					<tr>
						<th>Date</th>
						<th>Username</th>
						<th className='mobile hide'>Room Name</th>
						<th>Content</th>
						<th>Reported By</th>
						<th className='mobile hide'>Delete</th>
					</tr>
				</thead>
				<tbody>
					{reports.map((report, index) => (
						<tr key={index}>
							<td className='text centered'>{dateFormat(report.chatlog.createdAt, 'yyyy-mm-dd, H:MM:ss')}</td>
							<td className='text centered'>{report.chatlog.username}</td>
							<td className='text mobile hide centered'>{report.chatlog.room}</td>
							<td className='text centered'>{report.chatlog.text}</td>
							<td className='text centered'>{report.reporter.join(', ')}</td>
							<td className='text mobile hide centered'><button onClick={() => deleteReportsFor(report.chatlogIndex, authTokens.tokenFetch, setReports)}>Delete</button></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const deleteReportsFor = (chatlogIndex, tokenFetch, setReports) => {
	tokenFetch(`${process.env.CHAT_URI}/admin/reports`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ chatlogIndex })
	});

	setReports(reports => reports.filter(report => report.chatlogIndex != chatlogIndex));
};

export default ChatReports;