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
			const response = await axios.post('https://proctorai2-1.onrender.com/api/signin', {
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
		<div className="auth-layout-wrapper">
			{/* Left Side: Form */}
			<div className="auth-form-section">
				<a href="/" className="auth-brand-logo">
					<img src="/favicon.ico" alt="ProctorAI" />
					<span>ProctorAI</span>
				</a>

				<div className="auth-content-box">
					<h1 className="auth-title">Welcome back</h1>
					<p className="auth-subtitle">Sign in to your admin dashboard to continue</p>

					{showSuccessMessage && (
						<div className="premium-alert">
							<span>
								<strong>Account created!</strong> Please log in to your new account.
							</span>
							<button onClick={() => setShowSuccessMessage(false)} className="premium-alert-close">×</button>
						</div>
					)}

					<form className="premium-form" onSubmit={onLoginClick}>
						<div className="form-field">
							<label>Email address</label>
							<input
								type="email"
								className="premium-input"
								placeholder="admin@institution.edu"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>

						<div className="form-field">
							<label>Password</label>
							<input
								type="password"
								className="premium-input"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>

						<button
							type="submit"
							className="premium-submit-btn"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<div className="spinner-icon"></div>
									Signing in...
								</>
							) : "Sign in to Dashboard"}
						</button>
					</form>

					<div className="auth-switch">
						Don't have an account?
						<span
							className="auth-switch-link"
							onClick={() => navigate('/register')}
							style={{ cursor: 'pointer' }}
						>
							Sign up
						</span>
					</div>
				</div>
			</div>

			{/* Right Side: Visual/Art */}
			<div className="auth-visual-section">
				<div className="abstract-shape shape-1"></div>
				<div className="abstract-shape shape-2"></div>

				<div className="visual-content">
					<h2>Secure. Automated. Effortless.</h2>
					<p>Experience the next generation of online proctoring. Monitor, track, and manage assessments with unparalleled precision using state-of-the-art AI technology.</p>
				</div>
			</div>
		</div>
	);
};

export default Login;