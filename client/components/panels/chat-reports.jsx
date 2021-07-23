import React, { useState, useEffect, useContext } from 'react';
import { TokenContext } from '../utilities/token-provider';
import dateFormat from 'dateformat';

const ChatReports = props => {
	const [reports, setReports] = useState([]);

	const authTokens = useContext(TokenContext);

	useEffect(async () => {
		const result = await authTokens.tokenFetch(`${process.env.CHAT_URI}/admin/reports`, {
			method: 'GET',
			headers: {
				'Access-Control-Allow-Origin': '*'
			}
		});

		if (!result.ok) {
			const err = `${result.status}: ${await result.text()}`;
			console.log(err);
			alert(err);
		} else {
			setReports(await result.json());
		}
	}, []);

	return (
		<table>
			<thead>
				<tr>
					<th>Date</th> 
					<th>Username</th>
					<th>Room Name</th>
					<th>Content</th>
					<th>Reported By</th>
				</tr>
			</thead>
			<tbody>
				{reports.map((report, index) => (
					<tr key={index}>
						<td>{dateFormat(report.chatlog.createdAt, 'yyyy-mm-dd, H:MM:ss')}</td>
						<td>{report.chatlog.username}</td>
						<td>{report.chatlog.room}</td>
						<td>{report.chatlog.text}</td>
						<td>{report.reporter.join(', ')}</td>
						<td><button onClick={() => deleteReportsFor(report.chatlogIndex, authTokens.tokenFetch, setReports)}>Delete</button></td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

const deleteReportsFor = (chatlogIndex, tokenFetch, setReports) => {
	tokenFetch(`${process.env.CHAT_URI}/admin/reports`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({ chatlogIndex })
	});

	setReports(reports => reports.filter(report => report.chatlogIndex != chatlogIndex));
};

export default ChatReports;