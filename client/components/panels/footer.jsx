import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer>
			<p className='centered'>MERN template designed by <a href='https://krgamestudios.com'>Kayne Ruse, KR Game Studios</a> - <Link to='/privacypolicy'>Privacy Policy</Link> - <Link to='/credits'>Credits</Link></p>
		</footer>
	);
};

export default Footer;
