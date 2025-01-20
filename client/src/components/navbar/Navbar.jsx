import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const NavLinks = () => (
	<React.Fragment>
		<p>
			<Link to="/" >Home</Link>
		</p>
		<p>
			About
		</p>
		<p>
			Community
		</p>
		<p>
			Contact Us
		</p>
		<p>
			<Link to="/login">Login</Link>
		</p>
	</React.Fragment>
);

const Navbar = () => {
	return (
		<div className="landing-navbar">
			<div className="landing-navbar-logo" >
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
						position:"relative",
						bottom:"15px"

					}}
				>
					ProctorAI
				</span>
				</a>
			</div>
			<div className="landing-navbar-links">
				<NavLinks />
			</div>
		</div>
	);
};

export default Navbar;
