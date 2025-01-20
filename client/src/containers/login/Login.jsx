import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import { CommonInput, CtaButton } from '../../components';
import axios from 'axios';
import './login.css';
import Cookies from 'js-cookie';

const inputField = ['Email ID', 'Password'];

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const response = await axios.post('http://localhost:5000/api/signin', {
				email,
				password,
			});

			const { token, userId } = response.data;

			if (response.status === 200) {
				localStorage.setItem('token', response.data.token);
				Cookies.set('token', response.data.token, { expires: 7, secure: true, sameSite: 'Strict' });
				Cookies.set('userId', userId, { expires: 1 });

				return true;
			}
		} catch (error) {
			console.error('Login failed:', error);
			alert('Invalid email or password');

			return false;
		}
	};


	const onLoginClick = async (e) => {
		e.preventDefault();
		const loginSuccess = await handleLogin();
		if (loginSuccess) {
			navigate('/dashboard');
			window.location.href = '/dashboard';
		}
	};

	return (
		<div className="user-login">
			<Navbar />
			<div className="login-form" style={{ marginTop: '100px' }}>
				<h1
					className="title-heading"
					style={{
						position: 'relative',
						top: '20px',
						textDecoration: 'Underline',
					}}
				>
					Admin Login
				</h1>

				<div
					style={{
						borderRadius: '12px',
						border: '1px solid #ddd',
						boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
						padding: '50px',
					}}
				>
					<form className="input-fields" style={{ position: "relative", left: "25px" }} >
						{inputField.map((item, index) => (
							<CommonInput
								key={index}
								placeholderText={item}
								onChange={(e) =>
									index === 0 ? setEmail(e.target.value) : setPassword(e.target.value)
								}
								value={index === 0 ? email : password}
								type={index === 0 ? "text" : "password"}
							/>
						))}
						<div style={{ position: 'relative', right: '30px' }}>
							<CtaButton text="Login" type="button" onClick={onLoginClick} />
						</div>
					</form>
					<p
						style={{
							textAlign: 'center',
							fontSize: '16px',
							fontFamily: "'Poppins', sans-serif",
							marginTop: '10px',
							position: "relative",
							right: "3px"
						}}
					>
						<br />
						New User?{' '}
						<span
							style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}
							onClick={() => navigate('/register')}
						>
							Register
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
