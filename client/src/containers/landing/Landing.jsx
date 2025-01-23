import React, { useState } from 'react';
import { Navbar, CtaButton, CommonInput } from './../../components';
import axios from 'axios';
import infinite from './../../assets/infinite.svg';
import './landing.css';
import { Link } from 'react-router-dom';

const featureList = [
    'Multiple People Detection',
    'Mobile Phone Detection',
    'Desktop Change Detection',
	'Full Screen Check',
    'Devtools Check',
    'Multiple Tabs Check',
];

const Landing = () => {
	const [testCode, setTestCode] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [registrationNumber, setRegistrationNumber] = useState('');
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');

	const handleJoinClick = () => {
		if (!testCode.trim()) {
			alert('Please enter the unique test code to join.');
		} else {
			setIsModalOpen(true);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleSubmit = async () => {


		if (!registrationNumber.trim() || !email.trim() || !name.trim()) {
			alert('Please fill out all the fields.');
			return;
		}

		try {
			const response = await axios.post('http://localhost:5000/api/test-taker', {
				testCode,
				name,
				registrationNumber,
				email,
			});

			if (response.status === 201 || response.status === 200) {
				window.location.href = `/exam?testCode=${testCode}&registrationNumber=${registrationNumber}&email=${email}&name=${name}`;
			}
		} catch (error) {
			if (error.response && error.response.data && error.response.data.message) {
				alert(error.response.data.message);
			} else {
				console.error('Unexpected error:', error);
				alert('An unexpected error occurred.');
			}
		}
	};


	return (
		<React.Fragment>
			<Navbar />

			<div className="section-type landing-page">
				<div className="landing-content">
					<div className="headings">
						<span className="sub-text">Advanced & Automated</span>
						<span className="main-heading gradient-text">
							Proctoring Solution
						</span>
					</div>

					<p className="desc">
						A straightforward framework built for online proctoring
						to create online tests within minutes,{' '}
						<i>effortlessly</i>.
					</p>
				</div>

				<div className="landing-cta">
					<Link to="/login">
						<CtaButton text="Create a test" />
					</Link>

					<p className="desc">OR</p>
					<div className="input-item unique-link">
						<CommonInput
							placeholderText="Unique test code"
							value={testCode}
							onChange={(e) => setTestCode(e.target.value)}
						/>
						<span
							className="join-link"
							onClick={handleJoinClick}
							style={{ cursor: 'pointer' }}
						>
							Join
						</span>
					</div>
				</div>

				<div className="features-content">
					<div className="curr-heading">
						<p className="gradient-text">
							<b>Powerful</b> & Lightweight
						</p>
						<h2 className="title-heading">Features</h2>
					</div>

					<div className="all-features">
						{featureList.map((it, index) => (
							<p key={index} className="single-feature">{it}</p>
						))}
					</div>
				</div>

				<div className="final-features">
					<div className="top-sec">
						<div className="left-text">
							<h3 className="gradient-text">
								Effortlessly integrates with
							</h3>
							<h1 className="title-heading">
								Google Forms or Microsoft Surveys
							</h1>
						</div>
						<div className="infinite">
							<img src={infinite} alt="infinite" />
						</div>

						<div className="right-text">
							<h3 className="gradient-text">The best part?</h3>
							<h1 className="title-heading">
								Live Status on Admin Dashboard
							</h1>
						</div>
					</div>

					<div className="mid-cta final-cta">
						<p className="phew">
							And it’s <b>free</b>.
							<br />
							What are you waiting for?
						</p>
						<Link to="/login">
							<CtaButton text="Get Started" />
						</Link>
					</div>
				</div>
			</div>

			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-box">
						<h2 className="modal-title">Join the Test</h2>
						<div className="modal-inputs">
							<CommonInput
								placeholderText="Unique test code"
								value={testCode}
								readOnly
								className="modal-input"
							/>
							<CommonInput
								placeholderText="Full Name"
								value={name}
								onChange={(e) =>
									setName(e.target.value)
								}
								className="modal-input"
							/>
							<CommonInput
								placeholderText="Registration Number / Roll Number"
								value={registrationNumber}
								onChange={(e) =>
									setRegistrationNumber(e.target.value)
								}
								className="modal-input"
							/>
							<CommonInput
								placeholderText="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="modal-input"
							/>
						</div>
						<div className="modal-actions">
							<button
								className="cancel-btn"
								onClick={handleCloseModal}
							>
								Cancel
							</button>
							<button
								className="submit-btn"
								onClick={handleSubmit}
							>
								Join
							</button>
						</div>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Landing;
