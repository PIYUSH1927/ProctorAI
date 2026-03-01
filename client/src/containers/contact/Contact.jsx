import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import { CommonInput, CtaButton } from '../../components';
import './contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('Message sent successfully! We will get back to you soon.');
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
    };
    return (
        <div className="premium-page">
            <Navbar />

            <div className="contact-hero">
                <span className="premium-badge">Contact Us</span>
                <h1 className="hero-title">Get in touch with our team.</h1>
                <p className="hero-subtitle">Whether you have technical questions or need enterprise support, we're here to help you secure your assessments.</p>
            </div>

            <div className="contact-layout-grid">
                {/* Left side: Info Cards */}
                <div className="contact-info-column">
                    <div className="premium-info-card">
                        <div className="info-icon">@</div>
                        <h3>Support</h3>
                        <p>support@proctorai.com</p>
                        <span className="info-badge">24/7 technical assistance</span>
                    </div>
                    <div className="premium-info-card">
                        <div className="info-icon">$</div>
                        <h3>Sales</h3>
                        <p>sales@proctorai.com</p>
                        <span className="info-badge">Enterprise solutions</span>
                    </div>
                </div>

                {/* Right side: Contact Form */}
                <div className="premium-contact-form-container">
                    <form className="premium-contact-form" onSubmit={handleSubmit}>
                        {submitStatus && (
                            <div className="premium-success-alert">
                                ✓ {submitStatus}
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Your Name</label>
                                <input
                                    type="text"
                                    className="premium-input-element"
                                    placeholder="Jane Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Your Email</label>
                                <input
                                    type="email"
                                    className="premium-input-element"
                                    placeholder="jane@institution.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>How can we help?</label>
                            <textarea
                                className="premium-input-element premium-textarea"
                                placeholder="Tell us about your requirements..."
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="premium-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending message..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
