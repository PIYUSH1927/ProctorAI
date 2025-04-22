import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import { CommonInput, CtaButton } from '../../components';
import axios from 'axios';
import './login.css';
import Cookies from 'js-cookie';

const inputField = ['Email ID', 'Password'];

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		if (query.get('registered') === 'success') {
			setShowSuccessMessage(true);
			const timer = setTimeout(() => {
				setShowSuccessMessage(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [location]);

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
		setIsLoading(true);
		
		const loginSuccess = await handleLogin();
		
		if (loginSuccess) {
			navigate('/dashboard');
			window.location.href = '/dashboard';
		} else {
			setIsLoading(false);
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

				{showSuccessMessage && (
					<div style={{
						backgroundColor: '#d4edda',
						color: '#155724',
						padding: '10px 20px',
						borderRadius: '8px',
						border: '1px solid #c3e6cb',
						fontSize: '14px',
						fontFamily: "'Poppins', sans-serif",
						display: 'flex',
						alignItems: 'center',
						margin:"0px",
						marginBottom:"-20px",
						marginTop:"-10px"
					}}>
						<span>
							<strong>Account created successfully!</strong> Please log in with your credentials to access your account.
						</span>
						<button 
							onClick={() => setShowSuccessMessage(false)}
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								fontSize: '18px',
								color: '#155724'
							}}
						>
							×
						</button>
					</div>
				)}

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
								disabled={isLoading}
							/>
						))}
						<div style={{ position: 'relative', right: '30px' }}>
							<CtaButton 
								text={isLoading ? "Logging in..." : "Login"} 
								type="button" 
								onClick={onLoginClick} 
								disabled={isLoading}
							/>
							{isLoading && (
								<div className="spinner" style={{
									width: '20px',
									height: '20px',
									border: '3px solid rgba(0, 0, 0, 0.1)',
									borderRadius: '50%',
									borderTop: '3px solid #007BFF',
									animation: 'spin 1s linear infinite',
									position: 'absolute',
									right: '-30px',
									top: '50%',
									transform: 'translateY(-50%)'
								}}></div>
							)}
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
		
			<style>
				{`
					@keyframes spin {
						0% { transform: rotate(0deg); }
						100% { transform: rotate(360deg); }
					}
				`}
			</style>
		</div>
	);
};

export default Login;