import React, { useState } from 'react';
import { Calendar, User, Phone, Activity, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin, Star, MessageCircle } from 'lucide-react';

// Clinic WhatsApp Number (Update this to your actual clinic number with country code)
const CLINIC_WHATSAPP = '+919876543210'; // Example: India number
const CLINIC_NAME = 'Smile Dental Clinic';
const BOOKING_PAGE_URL = 'http://localhost:5173/book'; // Update for production

// Doctor Data - Dental Specialists
const doctors = [
    { id: 1, name: 'Dr. Anjali Sharma', specialty: 'General Dentist', rating: 4.9, available: true, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 2, name: 'Dr. Ramesh Verma', specialty: 'Orthodontist', rating: 4.8, available: true, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 3, name: 'Dr. Sarah Wilson', specialty: 'Cosmetic Dentist', rating: 4.9, available: true, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 4, name: 'Dr. Priya Patel', specialty: 'Pediatric Dentist', rating: 4.7, available: true, image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300&h=300' }
];

// Time Slots
const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

// Helper to generate calendar days
const getNextDays = () => {
    const days = [];
    for (let i = 1; i <= 14; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        // Skip Sundays
        if (d.getDay() !== 0) {
            days.push(d);
        }
    }
    return days;
};

const StepDoctor = ({ formData, setFormData, handleNext }) => (
    <div className="step-content">
        <h2 className="step-title">Choose Your Dentist</h2>
        <p className="step-subtitle">Select a specialist for your dental care</p>

        <div className="doctor-grid">
            {doctors.map(doc => (
                <div
                    key={doc.id}
                    className={`doctor-card ${formData.doctor === doc.name ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, doctor: doc.name, specialty: doc.specialty })}
                >
                    <img src={doc.image} alt={doc.name} className="doctor-img" />
                    <div className="doctor-info">
                        <h3>{doc.name}</h3>
                        <p>{doc.specialty}</p>
                        <div className="rating">
                            <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                            <span>{doc.rating}</span>
                        </div>
                    </div>
                    <div className="radio-circle">
                        {formData.doctor === doc.name && <div className="inner-dot" />}
                    </div>
                </div>
            ))}
        </div>

        <div className="nav-buttons single">
            <button className="btn-primary" onClick={handleNext} disabled={!formData.doctor}>
                Next Step <ChevronRight size={20} />
            </button>
        </div>
    </div>
);

const StepDateTime = ({ formData, setFormData, handleBack, handleNext }) => {
    const calendarDays = getNextDays();

    return (
        <div className="step-content">
            <h2 className="step-title">Select Date & Time</h2>
            <p className="step-subtitle">Available slots for {formData.doctor}</p>

            <div className="date-scroll-container">
                {calendarDays.map((day, i) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const isSelected = formData.date === dateStr;
                    return (
                        <div
                            key={i}
                            className={`date-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setFormData({ ...formData, date: dateStr, time: '' })}
                        >
                            <span className="day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <span className="day-num">{day.getDate()}</span>
                            <span className="month-name">{day.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                    );
                })}
            </div>

            <h3 className="section-label">Available Time Slots</h3>
            <div className="time-grid">
                {timeSlots.map(time => (
                    <button
                        key={time}
                        className={`time-chip ${formData.time === time ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, time })}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className="nav-buttons">
                <button className="btn-text" onClick={handleBack}><ChevronLeft size={18} /> Back</button>
                <button className="btn-primary" onClick={handleNext} disabled={!formData.time}>
                    Next Step <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

const StepDetails = ({ formData, setFormData, handleBack, handleSubmit }) => (
    <div className="step-content">
        <h2 className="step-title">Patient Details</h2>
        <p className="step-subtitle">Fill in your information to confirm</p>

        <form id="booking-form" onSubmit={handleSubmit} className="details-form">
            <div className="input-group">
                <User className="input-icon" size={20} />
                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.patient}
                    onChange={e => setFormData({ ...formData, patient: e.target.value })}
                />
            </div>

            <div className="input-group">
                <Phone className="input-icon" size={20} />
                <input
                    type="tel"
                    placeholder="WhatsApp Number (with country code)"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            <div className="input-group">
                <Activity className="input-icon" size={20} />
                <input
                    type="number"
                    placeholder="Age"
                    required
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                />
            </div>

            <div className="input-group">
                <Activity className="input-icon" size={20} />
                <select
                    required
                    value={formData.treatmentType || ''}
                    onChange={e => setFormData({ ...formData, treatmentType: e.target.value })}
                    className="treatment-select"
                >
                    <option value="">Select Treatment Type</option>
                    <option value="Checkup">General Checkup</option>
                    <option value="Cleaning">Dental Cleaning</option>
                    <option value="Filling">Cavity Filling</option>
                    <option value="Root Canal">Root Canal</option>
                    <option value="Extraction">Tooth Extraction</option>
                    <option value="Whitening">Teeth Whitening</option>
                    <option value="Braces">Braces Consultation</option>
                    <option value="Other">Other</option>
                </select>
            </div>
        </form>

        <div className="booking-summary">
            <h4>Appointment Summary</h4>
            <div className="summary-row">
                <Clock size={16} /> <span>{formData.date} at {formData.time}</span>
            </div>
            <div className="summary-row">
                <MapPin size={16} /> <span>{formData.doctor} - {formData.specialty}</span>
            </div>
        </div>

        <div className="nav-buttons">
            <button type="button" className="btn-text" onClick={handleBack}><ChevronLeft size={18} /> Back</button>
            <button type="submit" form="booking-form" className="btn-primary btn-confirm">
                <CheckCircle size={20} /> Confirm Booking
            </button>
        </div>
    </div>
);

const StepSuccess = ({ formData }) => (
    <div className="step-content success-step">
        <div className="success-icon-wrapper">
            <CheckCircle size={80} className="success-icon" />
        </div>
        <h2>Booking Confirmed! 🦷</h2>
        <p>Your appointment at <strong>{CLINIC_NAME}</strong> has been scheduled.</p>
        <div className="ticket">
            <div className="ticket-header">
                <span>🦷 {CLINIC_NAME}</span>
            </div>
            <div className="ticket-row">
                <span>Doctor</span>
                <strong>{formData.doctor}</strong>
            </div>
            <div className="ticket-row">
                <span>Date</span>
                <strong>{formData.date}</strong>
            </div>
            <div className="ticket-row">
                <span>Time</span>
                <strong>{formData.time}</strong>
            </div>
            <div className="ticket-row">
                <span>Patient</span>
                <strong>{formData.patient}</strong>
            </div>
            <div className="ticket-row">
                <span>Treatment</span>
                <strong>{formData.treatmentType}</strong>
            </div>
        </div>

        <p className="confirmation-note">A confirmation message will be sent to your WhatsApp.</p>

        <button className="btn-primary full-width" onClick={() => window.location.href = '/'}>
            Return to Home
        </button>
    </div>
);

export const PublicBooking = () => {
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
            patient: '',
            phone: '',
            age: '',
            date: tomorrow.toISOString().split('T')[0],
            time: '',
            doctor: '',
            specialty: '',
            treatmentType: ''
        };
    });

    const handleNext = () => {
        if (step === 1 && !formData.doctor) return alert('Please select a dentist');
        if (step === 2 && !formData.time) return alert('Please select a time slot');
        setStep(prev => prev + 1);
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    const [processingStep, setProcessingStep] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.treatmentType) {
            return alert('Please select a treatment type');
        }

        setIsProcessing(true);
        setProcessingStep(0); // Start

        // Values for animation
        const steps = [1, 2, 3];

        // Start Step 1
        setTimeout(() => setProcessingStep(1), 800);

        const newAppt = {
            id: Date.now(),
            ...formData,
            status: 'Confirmed',
            type: formData.treatmentType,
            timestamp: new Date().toISOString()
        };

        try {
            await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppt)
            });

            // Step 2: Database success
            setTimeout(() => setProcessingStep(2), 2000);

            // Step 3: Finalize
            await new Promise(resolve => setTimeout(resolve, 3500));
            setProcessingStep(3);

            // Move to success screen
            setTimeout(() => {
                setIsProcessing(false);
                setStep(4);
            }, 800);

        } catch (error) {
            console.error('Error submitting booking:', error);
            setIsProcessing(false);
            alert('Booking failed. Please try again.');
        }
    };

    const handleWhatsAppRedirect = () => {
        const message = encodeURIComponent(
            `Hello ${CLINIC_NAME}! 🦷\n\nI would like to book an appointment.\n\nPlease help me schedule a visit.\n\nThank you!`
        );
        window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${message}`, '_blank');
    };

    const renderProgressBar = () => (
        <div className="progress-container">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}><span>1</span></div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}><span>2</span></div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}><span>3</span></div>
        </div>
    );

    return (
        <div className="booking-wrapper">
            {/* Dental Clinic Background */}
            <div className="dental-bg-pattern"></div>
            <div className="bg-gradient-overlay" />

            <div className="mobile-container glass-effect">
                {/* Clinic Header */}
                <div className="clinic-header">
                    <div className="clinic-logo">🦷</div>
                    <div className="clinic-info">
                        <h1>{CLINIC_NAME}</h1>
                        <p>Your Smile, Our Priority</p>
                    </div>
                </div>

                {step < 4 && (
                    <header className="wizard-header">
                        {step > 1 ? (
                            <button className="back-icon" onClick={handleBack}>
                                <ChevronLeft size={24} />
                            </button>
                        ) : <div style={{ width: 40 }} />}

                        <span className="step-indicator">Step {step} of 3</span>
                        <div style={{ width: 40 }} />
                    </header>
                )}

                {step < 4 && renderProgressBar()}

                <div className="step-transition-container">
                    {isProcessing ? (
                        <div className="step-content agent-processing">
                            <div className="loader-orbit">
                                <div className="orbit-track"></div>
                                <Activity className="orbit-icon" size={48} />
                                <div className="orbit-particle p1"></div>
                                <div className="orbit-particle p2"></div>
                            </div>
                            <h3>AI Med-OS Working</h3>
                            <p className="processing-sub">Coordinating with Hospital Systems...</p>

                            <div className="agent-status-list">
                                <div className={`status-item ${processingStep >= 1 ? 'completed' : 'pending'}`}>
                                    {processingStep >= 1 ? <CheckCircle size={16} className="text-success" /> : <div className="spinner-micro"></div>}
                                    <span>System: Validating Patient ID...</span>
                                </div>
                                <div className={`status-item ${processingStep >= 2 ? 'completed' : 'pending'}`}>
                                    {processingStep >= 2 ? <CheckCircle size={16} className="text-success" /> : <div className="spinner-micro"></div>}
                                    <span>Calendar Agent: Locking {formData.date} Slot...</span>
                                </div>
                                <div className={`status-item ${processingStep >= 3 ? 'completed' : 'pending'}`}>
                                    {processingStep >= 3 ? <CheckCircle size={16} className="text-success" /> : <div className="spinner-micro"></div>}
                                    <span>Notifier: Preparing WhatsApp Confirmation...</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {step === 1 && <StepDoctor formData={formData} setFormData={setFormData} handleNext={handleNext} />}
                            {step === 2 && <StepDateTime formData={formData} setFormData={setFormData} handleBack={handleBack} handleNext={handleNext} />}
                            {step === 3 && <StepDetails formData={formData} setFormData={setFormData} handleBack={handleBack} handleSubmit={handleSubmit} />}
                            {step === 4 && <StepSuccess formData={formData} />}
                        </>
                    )}
                </div>

                {/* WhatsApp Floating Action Button */}
                {step < 4 && (
                    <div className="whatsapp-fab-container">
                        <button className="whatsapp-btn" onClick={handleWhatsAppRedirect}>
                            <MessageCircle size={22} />
                            <span>Chat on WhatsApp</span>
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

                :root {
                    --primary: #0891b2;
                    --primary-dark: #0e7490;
                    --primary-light: #22d3ee;
                    --accent: #06b6d4;
                    --bg-soft: #ecfeff;
                    --text-main: #164e63;
                    --text-light: #64748b;
                    --card-bg: rgba(255, 255, 255, 0.95);
                    --success: #10b981;
                    --whatsapp: #25D366;
                }

                .booking-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #ecfeff 0%, #cffafe 50%, #a5f3fc 100%);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Outfit', sans-serif;
                    position: relative;
                    overflow: hidden;
                    padding: 20px;
                }

                .dental-bg-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=30&w=1920');
                    background-size: cover;
                    background-position: center;
                    opacity: 0.08;
                    z-index: 0;
                }

                .bg-gradient-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(180deg, rgba(236,254,255,0.95) 0%, rgba(207,250,254,0.9) 100%);
                    z-index: 1;
                }

                .mobile-container {
                    width: 100%;
                    max-width: 480px;
                    background: white;
                    min-height: 85vh;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                    border-radius: 32px;
                    z-index: 10;
                    overflow: hidden;
                    margin: auto;
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.92);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.8);
                }

                /* Clinic Header */
                .clinic-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 24px 24px 0;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: white;
                    padding-bottom: 20px;
                    margin: -1px -1px 0;
                    border-radius: 32px 32px 0 0;
                }

                .clinic-logo {
                    font-size: 48px;
                    background: white;
                    width: 72px;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }

                .clinic-info h1 {
                    font-size: 22px;
                    font-weight: 800;
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .clinic-info p {
                    font-size: 14px;
                    opacity: 0.9;
                    margin: 4px 0 0;
                    font-weight: 500;
                }

                /* WhatsApp Button */
                .whatsapp-fab-container {
                    padding: 16px 24px 24px;
                    display: flex;
                    justify-content: center;
                    background: transparent;
                    margin-top: auto;
                }

                .whatsapp-btn {
                    background: var(--whatsapp);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    padding: 14px 28px;
                    font-weight: 700;
                    font-size: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                    font-family: inherit;
                }

                .whatsapp-btn:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 12px 28px rgba(37, 211, 102, 0.5);
                }

                /* Header */
                .wizard-header {
                    padding: 20px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .back-icon {
                    background: white;
                    border: 1px solid #e2e8f0;
                    border-radius: 14px;
                    cursor: pointer;
                    color: var(--text-main);
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                }

                .back-icon:hover {
                    transform: translateX(-2px);
                    border-color: var(--primary);
                    color: var(--primary);
                }

                .step-indicator {
                    font-size: 13px;
                    color: var(--primary);
                    font-weight: 700;
                    background: var(--bg-soft);
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid rgba(8, 145, 178, 0.2);
                }

                /* Progress Bar */
                .progress-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0;
                    padding: 0 24px 24px;
                }

                .progress-step {
                    width: 36px;
                    height: 36px;
                    background: #e2e8f0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 14px;
                    color: var(--text-light);
                    transition: all 0.3s;
                }

                .progress-step.active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
                }

                .progress-line {
                    width: 60px;
                    height: 3px;
                    background: #e2e8f0;
                }

                /* Common Steps */
                .step-content {
                    padding: 0 24px 24px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    animation: fadeIn 0.4s ease-out;
                }

                .step-title {
                    font-size: 26px;
                    font-weight: 800;
                    color: var(--text-main);
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }

                .step-subtitle {
                    color: var(--text-light);
                    margin-bottom: 24px;
                    font-size: 15px;
                }

                /* Doctor Grid */
                .doctor-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    margin-bottom: 24px;
                    max-height: 380px;
                    overflow-y: auto;
                    padding-right: 8px;
                }

                .doctor-card {
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border: 2px solid transparent;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                    background: white;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
                }

                .doctor-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
                }

                .doctor-card.selected {
                    border-color: var(--primary);
                    background: var(--bg-soft);
                    box-shadow: 0 8px 24px rgba(8, 145, 178, 0.15);
                }

                .doctor-img {
                    width: 60px;
                    height: 60px;
                    border-radius: 16px;
                    object-fit: cover;
                }

                .doctor-info {
                    flex: 1;
                    margin-left: 14px;
                }

                .doctor-info h3 {
                    font-size: 16px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    color: var(--text-main);
                }

                .doctor-info p {
                    font-size: 13px;
                    color: var(--text-light);
                    margin: 0 0 6px 0;
                }

                .rating {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .radio-circle {
                    width: 24px;
                    height: 24px;
                    border: 2px solid #cbd5e1;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .doctor-card.selected .radio-circle {
                    border-color: var(--primary);
                    background: white;
                }

                .inner-dot {
                    width: 12px;
                    height: 12px;
                    background: var(--primary);
                    border-radius: 50%;
                    animation: pop 0.3s;
                }

                /* Date Scroll */
                .date-scroll-container {
                    display: flex;
                    overflow-x: auto;
                    gap: 10px;
                    padding-bottom: 8px;
                    margin-bottom: 28px;
                    scrollbar-width: none;
                }

                .date-scroll-container::-webkit-scrollbar {
                    display: none;
                }

                .date-card {
                    min-width: 72px;
                    height: 90px;
                    border-radius: 18px;
                    border: 2px solid #e2e8f0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: white;
                    gap: 2px;
                }

                .date-card.selected {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    transform: translateY(-4px);
                    box-shadow: 0 10px 24px rgba(8, 145, 178, 0.3);
                }

                .day-name {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    opacity: 0.7;
                }

                .day-num {
                    font-size: 24px;
                    font-weight: 800;
                }

                .month-name {
                    font-size: 11px;
                    font-weight: 500;
                    opacity: 0.8;
                }

                /* Time Grid */
                .section-label {
                    font-size: 15px;
                    font-weight: 700;
                    margin-bottom: 14px;
                    color: var(--text-main);
                }

                .time-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-bottom: 24px;
                }

                .time-chip {
                    padding: 12px 8px;
                    border-radius: 14px;
                    border: 2px solid transparent;
                    background: white;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    font-family: inherit;
                }

                .time-chip:hover {
                    transform: translateY(-2px);
                    border-color: var(--primary-light);
                }

                .time-chip.selected {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                    box-shadow: 0 8px 20px rgba(8, 145, 178, 0.25);
                }

                /* Form Inputs */
                .details-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .input-group {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .input-group input,
                .treatment-select {
                    width: 100%;
                    padding: 16px 16px 16px 52px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    outline: none;
                    font-size: 15px;
                    color: var(--text-main);
                    font-weight: 500;
                    transition: all 0.2s;
                    font-family: inherit;
                }

                .treatment-select {
                    cursor: pointer;
                    appearance: none;
                }

                .input-group input:focus,
                .treatment-select:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
                }

                .booking-summary {
                    background: linear-gradient(145deg, var(--bg-soft), #e0f2fe);
                    border-radius: 20px;
                    padding: 20px;
                    margin-bottom: 24px;
                    border: 1px solid rgba(8, 145, 178, 0.2);
                }

                .booking-summary h4 {
                    margin: 0 0 12px;
                    font-size: 14px;
                    color: var(--primary-dark);
                    font-weight: 700;
                }

                .summary-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    color: var(--text-main);
                    margin-bottom: 8px;
                    font-weight: 500;
                }

                .summary-row:last-child {
                    margin-bottom: 0;
                }

                .summary-row svg {
                    color: var(--primary);
                }

                /* Success Step */
                .success-step {
                    align-items: center;
                    text-align: center;
                    justify-content: center;
                    padding-top: 40px;
                }

                .success-icon-wrapper {
                    margin-bottom: 24px;
                    animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .success-icon {
                    color: var(--success);
                    filter: drop-shadow(0 10px 20px rgba(16, 185, 129, 0.3));
                }

                .success-step h2 {
                    color: var(--text-main);
                    margin-bottom: 8px;
                }

                .ticket {
                    background: white;
                    width: 100%;
                    padding: 0;
                    border-radius: 24px;
                    border: 2px dashed #cbd5e1;
                    margin: 32px 0;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                }

                .ticket-header {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: white;
                    padding: 16px;
                    font-weight: 700;
                    font-size: 16px;
                }

                .ticket-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 14px 20px;
                    font-size: 14px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .ticket-row:last-child {
                    border-bottom: none;
                }

                .ticket-row span {
                    color: var(--text-light);
                }

                .ticket-row strong {
                    color: var(--text-main);
                    font-weight: 700;
                }

                .confirmation-note {
                    font-size: 13px;
                    color: var(--text-light);
                    margin-bottom: 24px;
                }

                /* Navigation */
                .nav-buttons {
                    margin-top: auto;
                    display: flex;
                    gap: 12px;
                    padding-top: 20px;
                }

                .nav-buttons.single {
                    justify-content: flex-end;
                }

                .btn-primary {
                    flex: 1;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    height: 56px;
                    font-size: 15px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 8px 20px rgba(8, 145, 178, 0.25);
                    font-family: inherit;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 28px rgba(8, 145, 178, 0.35);
                }

                .btn-primary:active {
                    transform: scale(0.98);
                }

                .btn-primary:disabled {
                    background: #cbd5e1;
                    opacity: 0.7;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .btn-primary.full-width {
                    width: 100%;
                }

                .btn-confirm {
                    background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
                    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
                }

                .btn-confirm:hover {
                    box-shadow: 0 12px 28px rgba(16, 185, 129, 0.35);
                }

                .btn-text {
                    color: var(--text-light);
                    background: none;
                    border: none;
                    font-weight: 600;
                    padding: 0 16px;
                    cursor: pointer;
                    transition: color 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-family: inherit;
                    font-size: 14px;
                }

                .btn-text:hover {
                    color: var(--text-main);
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pop {
                    0% { transform: scale(0); }
                    90% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                .agent-processing {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding-top: 40px;
                }

                .loader-orbit {
                    width: 80px;
                    height: 80px;
                    border: 3px solid var(--bg-soft);
                    border-top: 3px solid var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: spin 1.5s linear infinite;
                    margin-bottom: 24px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .orbit-icon {
                    color: var(--primary);
                    animation: pulse 1.5s ease-in-out infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(0.9); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }

                .agent-status-list {
                    margin-top: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                }

                .status-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--success);
                    background: var(--bg-soft);
                    padding: 10px;
                    border-radius: 12px;
                }

                .status-item.loading {
                    color: var(--primary);
                    background: #f1f5f9;
                }

                .status-item.loading span {
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.3; }
                }

                @media (min-width: 500px) {
                    .mobile-container {
                        max-width: 480px;
                        margin: 20px auto;
                        height: auto;
                        min-height: 750px;
                    }
                }
                /* Advanced AI Loader */
                .loader-orbit {
                    position: relative;
                    width: 120px;
                    height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .orbit-track {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid rgba(8, 145, 178, 0.1);
                    border-radius: 50%;
                }

                .orbit-icon {
                    color: var(--primary);
                    animation: pulse 2s infinite;
                    z-index: 2;
                    filter: drop-shadow(0 0 10px rgba(8, 145, 178, 0.3));
                }

                .orbit-particle {
                    position: absolute;
                    width: 12px;
                    height: 12px;
                    background: var(--primary);
                    border-radius: 50%;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    transform-origin: 0 60px;
                    box-shadow: 0 0 10px var(--primary);
                }

                .orbit-particle.p1 { animation: orbit 3s linear infinite; }
                .orbit-particle.p2 { animation: orbit 3s linear infinite; animation-delay: -1.5s; opacity: 0.6; width: 8px; height: 8px; }

                @keyframes orbit {
                    from { transform: translateX(-50%) rotate(0deg); }
                    to { transform: translateX(-50%) rotate(360deg); }
                }

                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .agent-processing h3 {
                    font-size: 22px;
                    font-weight: 800;
                    margin-bottom: 8px;
                    background: linear-gradient(to right, var(--primary), var(--primary-dark));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .processing-sub {
                    font-size: 14px;
                    color: var(--text-light);
                    margin-bottom: 32px;
                }

                .agent-status-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    width: 100%;
                    max-width: 320px;
                }

                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: rgba(255,255,255,0.5);
                    border-radius: 12px;
                    border: 1px solid rgba(226, 232, 240, 0.6);
                    transition: all 0.3s;
                }

                .status-item.completed {
                    background: #f0fdfa;
                    border-color: #ccfbf1;
                }
                
                .status-item.pending {
                    opacity: 0.6;
                }

                .status-item span {
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .text-success { color: var(--success); }

                .spinner-micro {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(8, 145, 178, 0.2);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
