import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import './about.css';

const About = () => {
    return (
        <div className="premium-page">
            <Navbar />

            <div className="about-hero">
                <span className="premium-badge">About Us</span>
                <h1 className="hero-title">Redefining the standard of online assessments.</h1>
                <p className="hero-subtitle">We build technology that helps institutions maintain academic integrity without compromising the student experience.</p>
            </div>

            <div className="mission-container">
                <div className="mission-box">
                    <h2>Our Mission</h2>
                    <p className="mission-text">
                        We are dedicated to safeguarding the integrity of online education. ProctorAI is a state-of-the-art automated proctoring platform that integrates seamlessly with Google and Microsoft Forms to deliver real-time environmental monitoring. By combining advanced multiple-person detection, mobile device recognition, and strict browser behavior analysis, we empower educators to confidently administer secure assessments and track participation through a comprehensive administrative dashboard.
                    </p>
                </div>
            </div>

            <div className="about-features-section">
                <div className="features-header">
                    <h2>Engineered for trust.</h2>
                </div>
                <div className="premium-features-grid">
                    <div className="premium-feature-card">
                        <div className="feature-icon-wrapper">A</div>
                        <h3>Advanced AI</h3>
                        <p>Utilizing state-of-the-art machine learning models for multiple person detection, object recognition, and behavior analysis.</p>
                    </div>
                    <div className="premium-feature-card">
                        <div className="feature-icon-wrapper">I</div>
                        <h3>Seamless Integration</h3>
                        <p>Designed to work flawlessly alongside your existing tools, providing real-time insights without disrupting the testing experience.</p>
                    </div>
                    <div className="premium-feature-card">
                        <div className="feature-icon-wrapper">S</div>
                        <h3>Uncompromising Security</h3>
                        <p>Ensuring the integrity of every assessment with comprehensive environmental checks, including browser behavior and screen monitoring.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
