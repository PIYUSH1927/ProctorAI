import React from 'react';
import './ctabutton.css';

const CtaButton = ({ text = 'Get Started', onClick }) => {
	return (
		<button className="ctabutton" onClick={onClick}>
			{text}
		</button>
	);
};

export default CtaButton;
