import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar, Activity, ShieldCheck, Heart, User, Menu, X, Phone, MapPin, Clock, Star, MessageCircle } from 'lucide-react';

// Use public root images for reliable loading
const hero1 = '/hero-1.jpg';
const hero2 = '/hero-2.jpg';

export const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const sliderImages = [
        { src: hero1, alt: 'Our Dental Team', caption: 'Expert Care by Our Team' },
        { src: hero2, alt: 'Our Dentist', caption: 'Experienced Professionals' },
        { src: hero1, alt: 'Modern Equipment', caption: 'State-of-the-Art Facility' },
        { src: hero2, alt: 'Dental Chair', caption: 'Personalized Attention' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % sliderImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [sliderImages.length]);

    const services = [
        { icon: '🦷', title: 'General Dentistry', desc: 'Checkups, cleanings, and preventive care' },
        { icon: '✨', title: 'Cosmetic Dentistry', desc: 'Whitening, veneers, and smile makeovers' },
        { icon: '🔧', title: 'Restorative Care', desc: 'Fillings, crowns, and implants' },
        { icon: '👶', title: 'Pediatric Dentistry', desc: 'Gentle care for children of all ages' }
    ];

    const stats = [
        { number: '5000+', label: 'Happy Patients' },
        { number: '15+', label: 'Years Experience' },
        { number: '4.9', label: 'Star Rating' },
        { number: '24/7', label: 'Emergency Care' }
    ];

    const testimonials = [
        { name: 'Sarah Johnson', text: 'Best dental experience ever! The staff is incredibly friendly and professional.', rating: 5 },
        { name: 'Mike Brown', text: 'Finally found a dentist I can trust. Highly recommend their services!', rating: 5 },
        { name: 'Emily Davis', text: 'Modern facilities and caring doctors. My whole family comes here now.', rating: 5 }
    ];

    const handleWhatsApp = () => {
        const message = encodeURIComponent('Hello! I would like to book an appointment at your dental clinic.');
        window.open(`https://wa.me/+919876543210?text=${message}`, '_blank');
    };

    return (
        <div className="landing-page">
            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)} />

            {/* Navigation */}
            <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="logo-container" onClick={() => navigate('/landing')}>
                        <div className="logo-icon">🦷</div>
                        <span className="logo-text">Smile <span className="text-accent">Dental</span></span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="nav-links desktop-only">
                        <button onClick={() => navigate('/about')} className="nav-link-btn">Services</button>
                        <button onClick={() => navigate('/book')} className="nav-link-btn">Book Online</button>
                        <button onClick={handleWhatsApp} className="nav-link-btn whatsapp-link">
                            <MessageCircle size={16} /> WhatsApp
                        </button>
                        <button onClick={() => navigate('/portal')} className="enter-portal-btn">
                            <span>Patient Portal</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
                    <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="mobile-nav-link">Services</button>
                    <button onClick={() => { navigate('/book'); setIsMenuOpen(false); }} className="mobile-nav-link">Book Online</button>
                    <button onClick={() => { handleWhatsApp(); setIsMenuOpen(false); }} className="mobile-nav-link whatsapp">
                        <MessageCircle size={18} /> Chat on WhatsApp
                    </button>
                    <button onClick={() => { navigate('/portal'); setIsMenuOpen(false); }} className="mobile-nav-link portal">
                        Patient Portal <ChevronRight size={18} />
                    </button>
                </div>
            </nav>

            {/* Image Slider */}
            <section className="image-slider">
                <div className="slider-container">
                    {sliderImages.map((img, idx) => (
                        <div
                            key={idx}
                            className={`slide ${idx === currentSlide ? 'active' : ''}`}
                        >
                            <img src={img.src} alt={img.alt} className="slide-img" />
                            <div className="slide-overlay"></div>
                            <div className="slide-caption">
                                <span>{img.caption}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="slider-dots">
                    {sliderImages.map((_, idx) => (
                        <button
                            key={idx}
                            className={`dot ${idx === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
                <div className="slider-arrows">
                    <button
                        className="arrow prev"
                        onClick={() => setCurrentSlide(prev => prev === 0 ? sliderImages.length - 1 : prev - 1)}
                    >
                        ‹
                    </button>
                    <button
                        className="arrow next"
                        onClick={() => setCurrentSlide(prev => (prev + 1) % sliderImages.length)}
                    >
                        ›
                    </button>
                </div>
            </section>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-badge animate-fade-in">✨ Excellence in Dental Care</div>
                    <h1 className="animate-slide-up hero-main-title">Your Perfect <span className="text-gradient">Smile</span> Starts Here</h1>
                    <p className="animate-slide-up delay-1">Experience world-class dental care with cutting-edge technology and a compassionate touch.</p>
                    <div className="hero-actions animate-slide-up delay-2">
                        <button className="btn-primary-large" onClick={() => navigate('/book')}>
                            <Calendar size={20} /> Book Appointment
                        </button>
                        <button className="btn-whatsapp" onClick={handleWhatsApp}>
                            <MessageCircle size={20} /> Chat on WhatsApp
                        </button>
                    </div>
                    <div className="hero-stats animate-fade-in delay-3">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat-item">
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="scroll-indicator">
                    <div className="scroll-arrow"></div>
                </div>
            </header>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Our Services</span>
                        <h2>Comprehensive Dental Care</h2>
                        <p>From routine checkups to advanced procedures, we've got your smile covered.</p>
                    </div>
                    <div className="services-grid">
                        {services.map((service, idx) => (
                            <div key={idx} className="service-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <button className="service-link" onClick={() => navigate('/services')}>
                                    Learn More <ChevronRight size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-us-section">
                <div className="container">
                    <div className="why-us-grid">
                        <div className="why-us-content">
                            <span className="section-badge">Why Choose Us</span>
                            <h2>Advanced Technology, <br />Personalized Care</h2>
                            <p>We combine state-of-the-art dental technology with a warm, patient-centered approach to deliver exceptional results.</p>
                            <ul className="features-list">
                                <li><ShieldCheck size={20} /> Digital X-rays & 3D Imaging</li>
                                <li><ShieldCheck size={20} /> Same-day Crowns & Restorations</li>
                                <li><ShieldCheck size={20} /> Pain-free Laser Dentistry</li>
                                <li><ShieldCheck size={20} /> Flexible Payment Options</li>
                            </ul>
                            <button className="btn-primary" onClick={() => navigate('/book')}>
                                Schedule Your Visit
                            </button>
                        </div>
                        <div className="why-us-image">
                            <img src="/assets/images/dental-doctor.jpg" alt="Modern Dental Equipment" />
                            <div className="floating-card card-1">
                                <Clock size={24} />
                                <div>
                                    <strong>Quick Appointments</strong>
                                    <span>Usually within 24 hours</span>
                                </div>
                            </div>
                            <div className="floating-card card-2">
                                <Star size={24} fill="#fbbf24" stroke="#fbbf24" />
                                <div>
                                    <strong>4.9 Star Rating</strong>
                                    <span>500+ Reviews</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Testimonials</span>
                        <h2>What Our Patients Say</h2>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, idx) => (
                            <div key={idx} className="testimonial-card">
                                <div className="stars">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                                    ))}
                                </div>
                                <p>"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.name.charAt(0)}</div>
                                    <span>{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready for Your Best Smile?</h2>
                        <p>Book your appointment today and experience the difference.</p>
                        <div className="cta-buttons">
                            <button className="btn-white" onClick={() => navigate('/book')}>
                                <Calendar size={20} /> Book Online
                            </button>
                            <button className="btn-whatsapp" onClick={handleWhatsApp}>
                                <MessageCircle size={20} /> WhatsApp Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <div className="logo-container">
                                <div className="logo-icon">🦷</div>
                                <span className="logo-text">Smile Dental</span>
                            </div>
                            <p>Your trusted partner for all dental care needs. Quality treatment with a gentle touch.</p>
                        </div>
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <button onClick={() => navigate('/about')}>Services</button>
                            <button onClick={() => navigate('/book')}>Book Appointment</button>
                            <button onClick={() => navigate('/portal')}>Patient Portal</button>
                        </div>
                        <div className="footer-contact">
                            <h4>Contact Us</h4>
                            <p><Phone size={16} /> +91 98765 43210</p>
                            <p><MapPin size={16} /> 123 Dental Street, Medical Plaza</p>
                            <p><Clock size={16} /> Mon-Sat: 9AM - 7PM</p>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>© 2024 Smile Dental Clinic. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp Button */}
            <button className="floating-whatsapp" onClick={handleWhatsApp}>
                <MessageCircle size={28} />
            </button>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

                .landing-page {
                    font-family: 'Outfit', sans-serif;
                    color: #1e293b;
                    overflow-x: hidden;
                    margin: 0;
                    padding: 0;
                }

                .landing-page * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                /* Image Slider */
                .image-slider {
                    position: relative;
                    width: 100%;
                    height: 500px;
                    margin-top: 72px;
                    overflow: hidden;
                }

                .slider-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }

                .slide {
                    position: absolute;
                    inset: 0;
                    background-size: cover;
                    background-position: center;
                    opacity: 0;
                    transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
                    transform: scale(1.05);
                }

                .slide.active {
                    opacity: 1;
                    transform: scale(1);
                    z-index: 1;
                }

                .slide-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                }

                .slide-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%);
                }

                .slide-caption {
                    position: absolute;
                    bottom: 60px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    z-index: 2;
                }

                .slide-caption span {
                    display: inline-block;
                    padding: 12px 32px;
                    background: rgba(255, 255, 255, 0.95);
                    color: #0891b2;
                    font-size: 18px;
                    font-weight: 700;
                    border-radius: 50px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }

                .slider-dots {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 10px;
                    z-index: 10;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                    border: 2px solid white;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .dot.active {
                    background: white;
                    transform: scale(1.2);
                }

                .dot:hover {
                    background: rgba(255,255,255,0.8);
                }

                .slider-arrows {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    transform: translateY(-50%);
                    display: flex;
                    justify-content: space-between;
                    padding: 0 20px;
                    z-index: 10;
                    pointer-events: none;
                }

                .arrow {
                    width: 50px;
                    height: 50px;
                    background: rgba(255,255,255,0.9);
                    color: #0891b2;
                    border-radius: 50%;
                    font-size: 32px;
                    font-weight: 300;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    pointer-events: auto;
                }

                .arrow:hover {
                    background: white;
                    transform: scale(1.1);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }

                @media (max-width: 768px) {
                    .image-slider {
                        height: 350px;
                        margin-top: 68px;
                    }
                    .slide-caption span {
                        font-size: 14px;
                        padding: 10px 24px;
                    }
                    .arrow {
                        width: 40px;
                        height: 40px;
                        font-size: 24px;
                    }
                }

                /* Navigation */
                .landing-nav {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    transition: all 0.3s;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                }

                .landing-nav.scrolled {
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                }

                .logo-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                }

                .logo-icon {
                    font-size: 32px;
                }

                .logo-text {
                    font-size: 24px;
                    font-weight: 800;
                    color: #000000 !important;
                    letter-spacing: -0.5px;
                }

                .text-accent {
                    color: #000000 !important;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .nav-link-btn {
                    padding: 10px 16px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #64748b;
                    border-radius: 10px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .nav-link-btn:hover {
                    color: #0891b2;
                    background: rgba(8, 145, 178, 0.08);
                }

                .nav-link-btn.whatsapp-link {
                    color: #25D366;
                }

                .enter-portal-btn {
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
                    transition: all 0.3s;
                }

                .enter-portal-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(8, 145, 178, 0.4);
                }

                /* Mobile Navigation */
                .mobile-menu-btn {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #1e293b;
                }

                .mobile-menu-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 998;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s;
                }

                .mobile-menu-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .mobile-nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    padding: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: all 0.3s;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                }

                .mobile-nav.open {
                    max-height: 400px;
                    padding: 16px;
                }

                .mobile-nav-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1e293b;
                    border-radius: 12px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                }

                .mobile-nav-link:hover {
                    background: #f1f5f9;
                }

                .mobile-nav-link.whatsapp {
                    color: #25D366;
                    gap: 10px;
                    justify-content: flex-start;
                }

                .mobile-nav-link.portal {
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    color: white;
                }

                .desktop-only { display: flex; }
                .mobile-only { display: none; }

                @media (max-width: 768px) {
                    .desktop-only { display: none; }
                    .mobile-only { display: flex; }
                }

                /* Hero Section - Light Theme */
                .landing-hero {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 100px 20px 60px;
                    overflow: hidden;
                    background: #f8fafc; /* Light background */
                }

                .hero-bg {
                    display: none; /* Remove dark image bg */
                }

                .hero-overlay {
                    display: none; /* Remove dark overlay */
                }

                .hero-content {
                    max-width: 900px;
                    width: 100%;
                    margin: 0 auto;
                    color: #1e293b; /* Dark text */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .hero-badge {
                    display: inline-block;
                    padding: 8px 20px;
                    background: rgba(8, 145, 178, 0.1); /* Light blue bg */
                    border: 1px solid rgba(8, 145, 178, 0.2);
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 24px;
                    color: #0891b2; /* Blue text */
                    backdrop-filter: blur(10px);
                }

                .landing-hero h1.hero-main-title {
                    font-size: clamp(36px, 8vw, 64px);
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: 20px;
                    color: #000000; /* Black title */
                    background: none;
                    -webkit-text-fill-color: initial;
                }

                .text-gradient {
                    color: #000000 !important;
                    -webkit-text-fill-color: #000000 !important;
                    background: none;
                    display: inline-block;
                }

                .landing-hero p {
                    font-size: clamp(16px, 3vw, 20px);
                    color: #475569; /* Dark gray text */
                    opacity: 1;
                    margin-bottom: 32px;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .hero-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 48px;
                }

                .btn-primary-large {
                    background: white;
                    color: #0891b2;
                    padding: 16px 32px;
                    border-radius: 14px;
                    font-size: 16px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s;
                }

                .btn-primary-large:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
                }

                .btn-glass-large {
                    background: transparent;
                    color: #1e293b;
                    border: 2px solid #cbd5e1;
                    padding: 14px 32px;
                    border-radius: 14px;
                    font-size: 16px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }

                .btn-glass-large:hover {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                    transform: translateY(-3px);
                }

                .hero-stats {
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    flex-wrap: wrap;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-size: 32px;
                    font-weight: 800;
                    color: #000000;
                }

                .stat-label {
                    font-size: 14px;
                    color: #000000;
                    opacity: 0.9;
                    font-weight: 600;
                }

                @media (max-width: 640px) {
                    .hero-stats { gap: 24px; }
                    .stat-number { font-size: 24px; }
                    .btn-primary-large, .btn-glass-large {
                        width: 100%;
                        justify-content: center;
                    }
                }

                /* Services Section */
                .services-section {
                    padding: 100px 0;
                    background: #f8fafc;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .section-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    background: rgba(8, 145, 178, 0.1);
                    color: #0891b2;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 16px;
                }

                .section-header h2 {
                    font-size: clamp(28px, 5vw, 40px);
                    font-weight: 800;
                    margin-bottom: 12px;
                    color: #1e293b;
                }

                .section-header p {
                    color: #64748b;
                    font-size: 16px;
                    max-width: 500px;
                    margin: 0 auto;
                }

                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 24px;
                }

                .service-card {
                    background: white;
                    padding: 32px;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s;
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                }

                .service-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .service-icon {
                    font-size: 48px;
                    margin-bottom: 20px;
                }

                .service-card h3 {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: #1e293b;
                }

                .service-card p {
                    color: #64748b;
                    font-size: 14px;
                    margin-bottom: 20px;
                    line-height: 1.6;
                }

                .service-link {
                    color: #0891b2;
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: gap 0.2s;
                }

                .service-link:hover {
                    gap: 10px;
                }

                /* Why Us Section */
                .why-us-section {
                    padding: 100px 0;
                    background: white;
                }

                .why-us-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    align-items: center;
                }

                @media (max-width: 968px) {
                    .why-us-grid {
                        grid-template-columns: 1fr;
                        gap: 48px;
                    }
                }

                .why-us-content h2 {
                    font-size: clamp(28px, 5vw, 40px);
                    font-weight: 800;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .why-us-content p {
                    color: #64748b;
                    font-size: 16px;
                    line-height: 1.7;
                    margin-bottom: 32px;
                }

                .features-list {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 32px;
                }

                .features-list li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    font-weight: 500;
                    color: #1e293b;
                }

                .features-list svg {
                    color: #0891b2;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    color: white;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 15px;
                    box-shadow: 0 8px 20px rgba(8, 145, 178, 0.3);
                    transition: all 0.3s;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(8, 145, 178, 0.4);
                }

                .why-us-image {
                    position: relative;
                }

                .why-us-image img {
                    width: 100%;
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
                }

                .floating-card {
                    position: absolute;
                    background: white;
                    padding: 16px 20px;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: float 3s ease-in-out infinite;
                }

                .floating-card div {
                    display: flex;
                    flex-direction: column;
                }

                .floating-card strong {
                    font-size: 14px;
                    font-weight: 700;
                    color: #1e293b;
                }

                .floating-card span {
                    font-size: 12px;
                    color: #64748b;
                }

                .floating-card svg {
                    color: #0891b2;
                }

                .card-1 { bottom: 20px; left: -20px; animation-delay: 0s; }
                .card-2 { top: 20px; right: -20px; animation-delay: 1.5s; }

                @media (max-width: 640px) {
                    .card-1 { left: 10px; }
                    .card-2 { right: 10px; }
                }

                /* Testimonials */
                .testimonials-section {
                    padding: 100px 0;
                    background: #f8fafc;
                }

                .testimonials-section .section-header {
                    text-align: center;
                    width: 100%;
                }

                .testimonials-section .section-header h2 {
                    text-align: center;
                }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }

                .testimonial-card {
                    background: white;
                    padding: 32px;
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                }

                .stars {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 16px;
                }

                .testimonial-card p {
                    color: #1e293b;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                    font-style: italic;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .author-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }

                .testimonial-author span {
                    font-weight: 600;
                    color: #1e293b;
                }

                /* CTA Banner - Light Theme */
                .cta-banner {
                    padding: 80px 0;
                    background: #f1f5f9; /* Light gray */
                    border-top: 1px solid #e2e8f0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .cta-content {
                    text-align: center;
                    color: #1e293b; /* Dark text */
                }

                .cta-content h2 {
                    font-size: clamp(28px, 5vw, 40px);
                    font-weight: 800;
                    margin-bottom: 12px;
                    color: #000000;
                }

                .cta-content p {
                    opacity: 0.9;
                    margin-bottom: 32px;
                    font-size: 18px;
                    color: #475569;
                }

                .cta-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-white {
                    background: #0891b2; /* Blue button */
                    color: white;
                    padding: 14px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }

                .btn-white:hover {
                    background: #0e7490;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    color: white;
                }

                .btn-outline-white {
                    background: transparent;
                    color: #1e293b;
                    border: 2px solid #cbd5e1;
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s;
                }

                .btn-outline-white:hover {
                    background: #e2e8f0;
                    border-color: #94a3b8;
                }

                .btn-whatsapp {
                    background: #25D366;
                    color: white;
                    padding: 14px 32px;
                    border-radius: 14px;
                    font-size: 16px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    border: none;
                    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.3);
                    transition: all 0.3s;
                }

                .btn-whatsapp:hover {
                    background: #20BD5A;
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(37, 211, 102, 0.4);
                }

                /* Footer - Light Theme */
                .landing-footer {
                    background: #ffffff;
                    color: #1e293b;
                    padding: 80px 0 40px;
                    border-top: 1px solid #e2e8f0;
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 60px;
                    margin-bottom: 60px;
                }

                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }
                }

                .footer-brand .logo-text {
                    color: #000000;
                }

                .footer-brand p {
                    color: #64748b;
                    margin-top: 16px;
                    line-height: 1.7;
                }

                .footer-links h4, .footer-contact h4 {
                    font-size: 16px;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #000000;
                }

                .footer-links button {
                    display: block;
                    color: #64748b;
                    font-size: 14px;
                    margin-bottom: 12px;
                    transition: color 0.2s;
                }

                .footer-links button:hover {
                    color: #0891b2;
                }

                .footer-contact p {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #64748b;
                    font-size: 14px;
                    margin-bottom: 12px;
                }

                .footer-contact svg {
                    color: #0891b2;
                }

                .footer-bottom {
                    border-top: 1px solid #e2e8f0;
                    padding-top: 24px;
                    text-align: center;
                }

                .footer-bottom p {
                    color: #94a3b8;
                    font-size: 14px;
                }

                /* Floating WhatsApp */
                .floating-whatsapp {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 60px;
                    height: 60px;
                    background: #25D366;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
                    z-index: 999;
                    transition: all 0.3s;
                    animation: pulse 2s infinite;
                }

                .floating-whatsapp:hover {
                    transform: scale(1.1);
                    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.5);
                }

                /* Animations */
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes pulse {
                    0%, 100% { box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4); }
                    50% { box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6); }
                }

                .animate-fade-in { animation: fadeInUp 0.6s ease-out forwards; }
                .animate-slide-up { animation: fadeInUp 0.6s ease-out forwards; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.4s; }

                /* Scroll indicator */
                .scroll-indicator {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .scroll-arrow {
                    width: 24px;
                    height: 24px;
                    border-right: 3px solid rgba(255, 255, 255, 0.5);
                    border-bottom: 3px solid rgba(255, 255, 255, 0.5);
                    transform: rotate(45deg);
                    animation: scrollBounce 2s infinite;
                }

                @keyframes scrollBounce {
                    0%, 100% { transform: rotate(45deg) translateY(0); opacity: 1; }
                    50% { transform: rotate(45deg) translateY(10px); opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};
