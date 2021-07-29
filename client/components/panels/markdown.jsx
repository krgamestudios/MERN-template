import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const Markdown = props => {
	//content?
	let [contentHook, setContentHook] = useState(null);

	//check arguments
	if (!props.content) {
		if (!props.uri) {
			throw 'Markdown requires either content or uri prop';
		}

		//once
		useEffect(() => {
			fetch(props.uri)
				.then(blob => blob.text())
				.then(blob => setContentHook(blob))
				.catch(e => console.error(e))
			;
		}, []);
	} else

	//assume raw info
	if (!contentHook) {
		setContentHook(props.content);
	}

	return (
		<ReactMarkdown rehypePlugins={[rehypeRaw]} props={{...props}}>{contentHook}</ReactMarkdown>
	);
};

export default Markdown;