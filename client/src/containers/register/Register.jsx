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
			const response = await axios.post('http://localhost:5000/api/register', data, {
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
		<div className="user-register" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Navbar />
			<h1 className="title-heading" style={{ marginTop: '100px', fontSize: '2rem', fontFamily: "'Poppins', sans-serif", textDecoration: "Underline" }}>
				Register
			</h1>
			<div
				className="register-form"
				style={{
					padding: '35px',
					borderRadius: '12px',
					border: '1px solid #ddd',
					width: '600px',
					boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
				}}
			>
				<form className="input-fields" onSubmit={handleSubmit}>
					<div style={{ marginBottom: '15px', position: "relative", right: "10px" }}>
						<input
							type="email"
							name="email"
							placeholder="Email ID"
							value={formData.email}
							onChange={handleChange}
							style={{
								width: '140%',
								padding: '12px',
								border: '1px solid #ccc',
								borderRadius: '8px',
								fontSize: '14px',
								fontFamily: "'Poppins', sans-serif",
								outline: 'none',
							}}
							disabled={isLoading}
							required
						/>
					</div>
					<div style={{ marginBottom: '15px', position: "relative", right: "10px" }}>
						<input
							type="text"
							name="fullName"
							placeholder="Full Name"
							value={formData.fullName}
							onChange={handleChange}
							style={{
								width: '140%',
								padding: '12px',
								border: '1px solid #ccc',
								borderRadius: '8px',
								fontSize: '14px',
								fontFamily: "'Poppins', sans-serif",
								outline: 'none',
							}}
							disabled={isLoading}
							required
						/>
					</div>
					<div style={{ marginBottom: '20px', position: "relative", right: "10px" }}>
						<input
							type="password"
							name="password"
							placeholder="Password"
							value={formData.password}
							onChange={handleChange}
							style={{
								width: '140%',
								padding: '12px',
								border: '1px solid #ccc',
								borderRadius: '8px',
								fontSize: '14px',
								fontFamily: "'Poppins', sans-serif",
								outline: 'none',
							}}
							disabled={isLoading}
							required
						/>
					</div>
					<div style={{ position: 'relative' }}>
						<CtaButton
							text={isLoading ? "Registering..." : "Register"}
							type="submit"
							style={{
								width: '100%',
								padding: '12px',
								fontSize: '16px',
								fontWeight: 'bold',
								borderRadius: '8px',
								fontFamily: "'Poppins', sans-serif",
							}}
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
						fontSize: '14px',
						fontFamily: "'Poppins', sans-serif",
						marginTop: '15px'
					}}
				>
					Already have an account?{' '}
					<span
						style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}
						onClick={() => navigate('/login')}
					>
						Login
					</span>
				</p>
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

export default Register;