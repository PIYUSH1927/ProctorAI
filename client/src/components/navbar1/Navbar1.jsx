import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './navbar.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const NavLinks = ({ handleLogout }) => (
	<React.Fragment>

		<p style={{fontSize:"20px"}}>
		 <Link to="#logout" onClick={handleLogout}>Logout</Link> 
		</p>
	</React.Fragment>
);

const Navbar = () => {
	const navigate = useNavigate(); 

	const handleLogout = () => {
		try {
		  Cookies.remove('token');

		  localStorage.clear();
		  sessionStorage.clear();
	  
		  if ('caches' in window) {
			caches.keys().then((names) => {
			  names.forEach((name) => caches.delete(name));
			});
		  }

		  window.location.reload(); 
		} catch (error) {
		  console.error('Error during logout:', error);
		  alert('An error occurred during logout. Please try again.');
		}
	  };

	return (
		<div className="landing-navbar" style={{height:"10%"}}>
			<div className="landing-navbar-logo">
				<img
					src="/favicon.ico"
					alt="ProctorAI logo"
					style={{
						width: '55px',
						height: '55px',
						marginRight: '10px',
					}}
				/>
				<a href="/">
				<span
					style={{
						fontSize: '1.8rem',
						fontWeight: 'bold',
						position: 'relative',
						bottom: '15px',
					}}
				>
					ProctorAI
				</span>
				</a>
			</div>
			<div className="landing-navbar-links">
				<NavLinks handleLogout={handleLogout} />
			</div>
		</div>
	);
};

export default Navbar;
