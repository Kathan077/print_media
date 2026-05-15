import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './QuotePage.css';

const QuotePage = () => {
    const pageRef = useRef(null);

    // Form inputs state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        details: ''
    });

    // UI Feedback state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from('.qp-eyebrow', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
            .from('.qp-title-line', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'power4.out'
            }, "-=0.4")
            .from('.qp-contact-info .info-item', {
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out'
            }, "-=0.5")
            .from('.qp-form-container', {
                opacity: 0,
                scale: 0.95,
                y: 40,
                duration: 1.2,
                ease: 'expo.out'
            }, "-=0.8");

        }, pageRef);

        return () => ctx.revert();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        setErrorMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                // Clear form data on successful submission
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    details: ''
                });
            } else {
                setSubmitStatus('error');
                setErrorMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Submission error:', err);
            setSubmitStatus('error');
            setErrorMessage('Could not connect to the server. Please ensure the backend is running.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setSubmitStatus(null);
    };

    return (
        <div className="quote-page" ref={pageRef}>
            <Header />
            
            <main className="qp-main">
                {/* Background Blobs */}
                <div className="qp-blob qp-blob-1"></div>
                <div className="qp-blob qp-blob-2"></div>
                
                <div className="container qp-container">
                    
                    {/* Left Column: Text & Info */}
                    <div className="qp-left">
                        <span className="qp-eyebrow">START A PROJECT</span>
                        <h1 className="qp-title">
                            <span className="qp-title-line">Let's craft</span>
                            <span className="qp-title-line outline">something</span>
                            <span className="qp-title-line">legendary.</span>
                        </h1>
                        <p className="qp-desc">
                            Ready to elevate your brand with premium printing? Fill out the form, and our estimating team will get back to you with an exact quote within 24 hours.
                        </p>

                        <div className="qp-contact-info">
                            <div className="info-item">
                                <span className="info-label">EMAIL US</span>
                                <a href="mailto:hello@viralprint.com" className="info-val">hello@viralprint.com</a>
                            </div>
                            <div className="info-item">
                                <span className="info-label">CALL US</span>
                                <a href="tel:+919875270319" className="info-val">+91 98752 70319</a>
                            </div>
                            <div className="info-item">
                                <span className="info-label">WORKING HOURS</span>
                                <span className="info-val">Mon - Sat, 9:00 AM - 7:00 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="qp-right">
                        <div className="qp-form-container glass-panel">
                            <form className="qp-form" onSubmit={handleSubmit}>
                                
                                <div className="form-row">
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            id="name" 
                                            required 
                                            placeholder=" " 
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="name">Full Name</label>
                                    </div>
                                    <div className="input-group">
                                        <input 
                                            type="email" 
                                            id="email" 
                                            required 
                                            placeholder=" " 
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="email">Email Address</label>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        required 
                                        placeholder=" " 
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="phone">Phone Number</label>
                                </div>

                                <div className="input-group">
                                    <select 
                                        id="service" 
                                        required 
                                        value={formData.service}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled hidden>Select Service Type</option>
                                        <option value="business-cards">Premium Business Cards</option>
                                        <option value="marketing">Marketing & Flyers</option>
                                        <option value="packaging">Custom Packaging</option>
                                        <option value="large-format">Large Format & Banners</option>
                                        <option value="other">Other / Custom Request</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <textarea 
                                        id="details" 
                                        rows="4" 
                                        required 
                                        placeholder=" " 
                                        value={formData.details}
                                        onChange={handleChange}
                                    ></textarea>
                                    <label htmlFor="details">Project Details & Quantity</label>
                                </div>

                                <button 
                                    type="submit" 
                                    className={`pro-btn pro-btn--primary qp-submit ${isSubmitting ? 'submitting' : ''}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="pro-spinner"></span>
                                            Sending Details...
                                        </>
                                    ) : (
                                        <>
                                            Request Quote
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14"></path>
                                                <path d="M12 5l7 7-7 7"></path>
                                            </svg>
                                        </>
                                    )}
                                </button>
                                
                                <p className="form-note">Your data is completely safe. We never spam.</p>
                            </form>
                        </div>
                    </div>

                </div>
            </main>

            {/* Premium God-Level Feedback Modal */}
            {submitStatus && (
                <div className="qp-modal-overlay">
                    <div className="qp-modal-card glass-panel-modal">
                        <button className="qp-modal-close" onClick={handleCloseModal}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        
                        {submitStatus === 'success' ? (
                            <div className="qp-modal-content success">
                                <div className="qp-modal-icon-wrapper success">
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                </div>
                                <h3 className="qp-modal-title">Sent Successfully!</h3>
                                <p className="qp-modal-message">
                                    Bhai, aapka contact form data receive ho gaya hai! Ek stunning HTML format notification aapke <strong>Email</strong> pe chala gaya hai aur confirmation <strong>SMS</strong> user ke phone pe bhej diya gaya hai.
                                </p>
                                <button className="pro-btn pro-btn--primary modal-btn" onClick={handleCloseModal}>
                                    Got it, thanks!
                                </button>
                            </div>
                        ) : (
                            <div className="qp-modal-content error">
                                <div className="qp-modal-icon-wrapper error">
                                    <svg className="errormark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="errormark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="errormark__check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
                                    </svg>
                                </div>
                                <h3 className="qp-modal-title error-text">Submission Failed</h3>
                                <p className="qp-modal-message">
                                    {errorMessage}
                                </p>
                                <button className="pro-btn modal-btn error-btn-close" onClick={handleCloseModal}>
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default QuotePage;
