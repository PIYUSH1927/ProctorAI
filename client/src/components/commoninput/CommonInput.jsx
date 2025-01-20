import React from 'react';
import './commoninput.css';

const CommonInput = ({ placeholderText = 'Input', value, onChange, type = 'text' }) => {
	return (
		<input
			placeholder={placeholderText}
			value={value}
			onChange={onChange}
			type={type}
		/>
	);
};

export default CommonInput;
