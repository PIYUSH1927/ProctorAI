import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { CtaButton } from '../../components';
import './register.css';
import axios from 'axios';

const Register = () => {
	const [formData, setFormData] = useState({
		email: '',
		fullName: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		const data = {
			email: formData.email,
			fullName: formData.fullName,
			password: formData.password,
		};

		try {
			const response = await axios.post('https://proctorai2-1.onrender.com/api/register', data, {
				headers: { 'Content-Type': 'application/json' },
			});
			navigate('/login?registered=success');
		} catch (error) {
			console.error('Registration failed:', error);
			alert('Something went wrong during registration!');
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
					<h1 className="auth-title">Create an account</h1>
					<p className="auth-subtitle">Start running secure tests in minutes</p>

					<form className="premium-form" onSubmit={handleSubmit}>
						<div className="form-field">
							<label>Email address</label>
							<input
								type="email"
								name="email"
								className="premium-input"
								placeholder="admin@institution.edu"
								value={formData.email}
								onChange={handleChange}
								disabled={isLoading}
								required
							/>
						</div>

						<div className="form-field">
							<label>Full name</label>
							<input
								type="text"
								name="fullName"
								className="premium-input"
								placeholder="Dr. Jane Smith"
								value={formData.fullName}
								onChange={handleChange}
								disabled={isLoading}
								required
							/>
						</div>

						<div className="form-field">
							<label>Password</label>
							<input
								type="password"
								name="password"
								className="premium-input"
								placeholder="Create a strong password"
								value={formData.password}
								onChange={handleChange}
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
									Creating account...
								</>
							) : "Create Account"}
						</button>
					</form>

					<div className="auth-switch">
						Already have an account?
						<span
							className="auth-switch-link"
							onClick={() => navigate('/login')}
							style={{ cursor: 'pointer' }}
						>
							Sign in
						</span>
					</div>
				</div>
			</div>

			{/* Right Side: Visual/Art */}
			<div className="auth-visual-section">
				<div className="abstract-shape shape-1" style={{ background: 'rgba(56, 189, 248, 0.15)' }}></div>
				<div className="abstract-shape shape-2" style={{ background: 'rgba(37, 99, 235, 0.3)', top: '10%', right: '10%' }}></div>

				<div className="visual-content">
					<h2>Built for modern assessments.</h2>
					<p>Join thousands of educators relying on ProctorAI to maintain academic integrity seamlessly, securely, and completely free of charge.</p>
				</div>
			</div>
		</div>
	);
};

export default Register;