import React from 'react';
import {
    Calendar,
    Clock,
    FileText,
    Activity,
    Plus,
    ShieldCheck,
    ChevronRight,
    Download,
    CheckCircle2,
    MessageCircle,
    Mail,
    ShoppingBag
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ImageSlider } from '../components/ImageSlider';
import { HeroBanner } from '../components/HeroBanner';
import { StatCard } from '../components/StatCard';

export const PatientPortal = ({ appointments, messages = [], onBookAppointment, onOpenMessaging, setNotification }) => {
    const navigate = useNavigate();
    const nextAppt = appointments.length > 0 ? appointments[0] : null;

    const getWelcomeMessage = () => {
        return "Your Premium Portal";
    };

    const downloadMyRecord = (appt) => {
        const content = `
      PATIENT CLINICAL SUMMARY
      ---------------------------
      Patient: ${appt.patient}
      Age: ${appt.age || 'N/A'}
      
      APPOINTMENT DETAILS:
      Status: Confirmed
      Date: ${appt.date || 'Today'}
      Slot: ${appt.time}
      Treatment: ${appt.type}
      
      CLINIC INFO:
      Dental Clinic
      Official Google Calendar Confirmed.
      ---------------------------
    `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `MyAppointment_${appt.date || 'Record'}.txt`;
        link.click();
    };

    return (
        <div className="patient-dashboard animate-pop">
            <div
                className="dashboard-bg-overlay"
                style={{ backgroundImage: `url('/assets/images/dental-hero-7.jpg')` }}
            ></div>
            <HeroBanner
                title={getWelcomeMessage()}
                subtitle={nextAppt
                    ? `You have a visit scheduled for ${nextAppt.time} today. We're ready for you!`
                    : "Experience premium dental care tailored to your lifestyle."
                }
                onBook={onBookAppointment}
                backgroundImageUrl="/assets/images/dental-hero-10.jpg"
            />

            <div className="dashboard-content">
                {/* Concierge Hub */}
                <section className="concierge-section">
                    <div className="section-header">
                        <h3>Concierge Services</h3>
                    </div>
                    <div className="concierge-hub">
                        <div className="concierge-card hover-lift" onClick={onBookAppointment}>
                            <div className="concierge-icon-bg"><Calendar size={24} /></div>
                            <div className="concierge-text">
                                <h4>New Appointment</h4>
                                <p>Schedule your next session in seconds.</p>
                            </div>
                        </div>
                        <div className="concierge-card hover-lift" onClick={onOpenMessaging}>
                            <div className="concierge-icon-bg"><Mail size={24} /></div>
                            <div className="concierge-text">
                                <h4>Care Hotline</h4>
                                <p>Message your clinic staff directly.</p>
                            </div>
                        </div>
                        <div className="concierge-card hover-lift" onClick={() => navigate('/services')}>
                            <div className="concierge-icon-bg"><ShoppingBag size={24} /></div>
                            <div className="concierge-text">
                                <h4>Check Services</h4>
                                <p>Explore our premium dental catalog.</p>
                            </div>
                        </div>
                        <div className="concierge-card hover-lift file-upload-card">
                            <label className="file-upload-label">
                                <div className="concierge-icon-bg"><Plus size={24} /></div>
                                <div className="concierge-text">
                                    <h4>Clinical Dropbox</h4>
                                    <p>Upload your reports or insurance details.</p>
                                </div>
                                <input type="file" className="hidden-input" onChange={(e) => {
                                    if (e.target.files[0]) {
                                        setNotification({ message: `Document "${e.target.files[0].name}" received by clinic.`, type: 'info' });
                                    }
                                }} />
                            </label>
                        </div>
                    </div>
                </section>

                <section className="documents-list-section glass-card">
                    <div className="section-header">
                        <div className="header-icon-title">
                            <ShieldCheck size={18} className="text-primary" />
                            <h3>Clinical Health Records</h3>
                        </div>
                    </div>
                    <div className="docs-grid">
                        <div className="doc-item-premium">
                            <div className="doc-icon"><FileText size={20} /></div>
                            <div className="doc-info">
                                <span className="doc-name">Dental_Checkup_Summary.pdf</span>
                                <span className="doc-meta">Uploaded by Dr. Wilson • Yesterday</span>
                            </div>
                            <button className="download-btn-small"><Download size={14} /></button>
                        </div>
                    </div>
                </section>

                <div className="dashboard-main-grid">
                    <div className="main-content-area">
                        {/* Premium Visual Banner */}
                        <div
                            className="dashboard-visual-banner animate-slide-up"
                            style={{
                                backgroundImage: `url('/assets/images/dental-hero-7.jpg')`
                            }}
                        >
                            <div className="banner-overlay"></div>
                            <div className="banner-badge">Verified Clinical Excellence</div>
                            <div className="banner-content">
                                <h2>Luxury Care Portfolio</h2>
                                <p>Explore elite treatments & book your transformation.</p>
                                <button className="btn-glass" onClick={() => navigate('/services')}>View Catalog</button>
                            </div>
                        </div>

                        <div className="timeline-container glass-card">
                            <div className="section-header">
                                <h3>Your Treatment Journey</h3>
                                <button className="text-btn">View Full History</button>
                            </div>
                            <div className="treatment-timeline">
                                {appointments.length === 0 ? (
                                    <div className="empty-portal-state">
                                        <p>Start your journey with us today.</p>
                                        <button className="btn-primary" onClick={onBookAppointment}>Book Initial Visit</button>
                                    </div>
                                ) : (
                                    appointments.map((appt, idx) => (
                                        <div key={appt.id} className={`timeline-milestone ${idx === 0 ? 'active' : ''}`}>
                                            <div className="milestone-content">
                                                <div className="milestone-info">
                                                    <h4>{appt.type}</h4>
                                                    <div className="time-slot">
                                                        <Clock size={14} />
                                                        <span>{appt.time} with {appt.doctor}</span>
                                                    </div>
                                                </div>
                                                <button className="download-record-btn" onClick={() => downloadMyRecord(appt)}>
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-sidebar-panels">
                        <div className="inbox-peek glass-card">
                            <div className="section-header">
                                <div className="header-icon-title">
                                    <MessageCircle size={18} className="text-primary" />
                                    <h3>Quick Inbox</h3>
                                </div>
                            </div>
                            <div className="msg-preview-list">
                                {messages.filter(m => m.role === 'patient').slice(0, 2).map(msg => (
                                    <div key={msg.id} className="msg-preview-item" onClick={onOpenMessaging}>
                                        <p className="msg-text">{msg.text}</p>
                                    </div>
                                ))}
                                {messages.filter(m => m.role === 'patient').length === 0 && (
                                    <p className="text-muted small">No recent messages.</p>
                                )}
                            </div>
                        </div>
                        <ImageSlider />
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                    .file-upload-card { cursor: pointer; position: relative; }
                    .file-upload-label { display: flex; align-items: center; gap: 12px; cursor: pointer; width: 100%; }
                    .hidden-input { display: none; }
                    
                    .documents-list-section { margin-top: 24px; padding: 24px; }
                    .docs-grid { display: grid; gap: 12px; margin-top: 16px; }
                    .doc-item-premium { display: flex; align-items: center; gap: 16px; padding: 14px 20px; background: #f8fafc; border-radius: 14px; border: 1px solid #f1f5f9; transition: all 0.2s; }
                    .doc-item-premium:hover { background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.05); transform: translateY(-2px); }
                    .doc-icon { width: 36px; height: 36px; background: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); box-shadow: var(--shadow-sm); }
                    .doc-info { flex: 1; display: flex; flex-direction: column; }
                    .doc-name { font-size: 13px; font-weight: 700; color: var(--text-main); }
                    .doc-meta { font-size: 11px; color: var(--text-muted); }
                    .download-btn-small { width: 32px; height: 32px; background: white; border-radius: 8px; color: var(--text-muted); transition: all 0.2s; border: 1px solid #f1f5f9; }
                    .download-btn-small:hover { color: var(--primary); background: #f1f5f9; }
                `}} />
            </div>
        </div>
    );
};
