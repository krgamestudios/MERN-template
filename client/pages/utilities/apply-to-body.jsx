import React, { useEffect } from 'react';

//applies the classname of 'body'
const ApplyToBody = (props) => {
	
	useEffect(()  => {
		document.body.classList.add(props.className);
	
		return () => {
			document.body.classList.remove(props.className);
		};
	}, []);

	return (
		<></>
	);
};

export default ApplyToBody;