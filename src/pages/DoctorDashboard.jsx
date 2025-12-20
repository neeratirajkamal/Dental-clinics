import React, { useState, memo } from 'react';
import {
  Users,
  Clock,
  FileText,
  Activity,
  Mail,
  MessageCircle // Added for WhatsApp
} from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { StatCard } from '../components/StatCard';
import { MedicalQueue } from '../components/MedicalQueue';
import { PatientDetailView } from '../components/PatientDetailView';
import { SystemHealthMonitor } from '../components/SystemHealthMonitor';

export const DoctorDashboard = memo(({ appointments, onBookAppointment }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const downloadClinicalRecord = (appt) => {
    const content = `
DR. WILSON'S CLINICAL RECORD
---------------------------
PATIENT PROFILE:
Name: ${appt.patient}
Age: ${appt.age || 'N/A'}
      
APPOINTMENT DETAILS:
Date: ${appt.date || 'Today'}
Slot: ${appt.time}
Treatment: ${appt.type}
      
CONSULTATION NOTES:
- Initial assessment required.
- Patient reported history of ${appt.type.toLowerCase()}.
---------------------------
Ref: #${appt.id || 'SYNC-X'}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ClinicalRecord_${appt.patient.replace(' ', '_')}.txt`;
    link.click();
  };

  const heroImages = [
    {
      url: '/assets/images/dental-hero-9.jpg',
      alt: 'Expert Dental Consultation'
    },
    {
      url: '/assets/images/dental-hero-10.jpg',
      alt: 'Professional Dental Treatment'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="doctor-dashboard">
      <div className="new-dashboard-hero glass-card">
        <div className="hero-left">
          <span className="hero-badge">HEALTHCARE & HOSPITALITY</span>
          <h1>Experience Premium <br /> Clinical Care</h1>
          <p className="hero-sub">Modern dental expertise with a hospitable approach for every patient.</p>

          <div className="hero-actions">
            <button className="book-btn-hero" onClick={onBookAppointment}>
              Book Appointment {'>'}
            </button>
            <button className="services-btn-hero">
              Services
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="stat-v-item">
              <span className="stat-val">99%</span>
              <span className="stat-label">SMILE</span>
            </div>
            <div className="stat-v-separator"></div>
            <div className="stat-v-item">
              <span className="stat-val">15+</span>
              <span className="stat-label">YEARS</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-wrapper">
            {heroImages.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.alt}
                className={`main-hero-img slider-img ${idx === currentHeroImage ? 'active' : ''}`}
                style={{
                  position: idx === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  opacity: idx === currentHeroImage ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  zIndex: idx === currentHeroImage ? 1 : 0
                }}
              />
            ))}

            <div className="floating-badge top-right animate-pop">
              <div className="star-icon">★</div>
              <div className="badge-text">
                <span className="label">TOP RATED</span>
                <span className="value">Best Clinic</span>
              </div>
            </div>

            <div className="floating-badge bottom-left animate-pop delay-1">
              <div className="pulse-icon"><Activity size={16} /></div>
              <div className="badge-text">
                <span className="label">PATIENT PULSE</span>
                <span className="value">Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="system-status-row">
          <SystemHealthMonitor />
        </div>
        <div className="main-grid">
          <MedicalQueue
            appointments={appointments}
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />

          <PatientDetailView
            selectedPatient={selectedPatient}
            onDownloadRecord={downloadClinicalRecord}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .doctor-dashboard { padding: 0; width: 100%; max-width: 1600px; margin: 0 auto; }
          
          .system-status-row {
            margin-bottom: 24px;
          }
          .new-dashboard-hero { 
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: center; 
            gap: 40px;
            background: #ffffff; 
            border-radius: 24px; 
            padding: 40px; 
            margin-bottom: 24px; 
            position: relative; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            border: 1px solid #f8fafc;
            overflow: visible;
          }

          .hero-left { display: flex; flex-direction: column; align-items: flex-start; z-index: 2; height: 100%; justify-content: center; }
          
          .hero-badge { 
            background: #f0fdfa; 
            color: #0d9488; 
            font-size: 10px; 
            font-weight: 800; 
            padding: 4px 12px; 
            border-radius: 8px; 
            letter-spacing: 1px; 
            margin-bottom: 16px; 
            text-transform: uppercase;
          }

          .hero-left h1 { 
            font-size: clamp(32px, 4vw, 48px);
            font-weight: 850; 
            color: #0f172a; 
            line-height: 1.1; 
            margin: 0 0 16px 0; 
            letter-spacing: -1.5px;
          }

          .hero-sub { 
            font-size: clamp(14px, 1.5vw, 16px);
            color: #64748b; 
            line-height: 1.5; 
            margin: 0 0 24px 0; 
            max-width: 400px;
          }

          .hero-actions { display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap; }
          
          .book-btn-hero { 
            background: #0d9488; 
            color: white; 
            padding: 12px 28px; 
            border-radius: 10px; 
            font-weight: 700; 
            font-size: 15px; 
            transition: all 0.2s; 
            display: flex; 
            align-items: center; 
            gap: 8px;
            box-shadow: 0 8px 16px -4px rgba(13, 148, 136, 0.3);
            white-space: nowrap;
          }
          .book-btn-hero:hover { transform: translateY(-2px); box-shadow: 0 12px 20px -4px rgba(13, 148, 136, 0.4); background: #0f766e; }
          
          .services-btn-hero {
            background: white;
            color: #0f172a;
            padding: 12px 28px; 
            border-radius: 10px; 
            font-weight: 700; 
            font-size: 15px; 
            border: 1px solid #e2e8f0; 
            transition: all 0.2s; 
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
          }
          .services-btn-hero:hover { background: #f8fafc; transform: translateY(-2px); }

          .hero-stats-row { display: flex; align-items: center; gap: 32px; margin-top: 0; }
          .stat-v-item { display: flex; flex-direction: column; gap: 2px; }
          .stat-val { font-size: 20px; font-weight: 850; color: #0f172a; line-height: 1; }
          .stat-label { font-size: 9px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
          .stat-v-separator { width: 1px; height: 24px; background: #f1f5f9; }

          .hero-right { display: flex; justify-content: center; position: relative; }
          .hero-image-wrapper { position: relative; width: 100%; aspect-ratio: 4/3; max-width: 480px; overflow: hidden; border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
          .main-hero-img { width: 100%; height: 100%; display: block; object-fit: cover; object-position: center; transition: opacity 1s ease-in-out; }

          .floating-badge { 
            position: absolute; 
            background: white;
            padding: 12px 16px; 
            border-radius: 14px; 
            box-shadow: 0 8px 24px rgba(0,0,0,0.06); 
            display: flex; 
            align-items: center; 
            gap: 10px;
            z-index: 5;
            border: 1px solid #f8fafc;
          }
          .floating-badge.top-right { top: 10%; right: 10%; }
          .floating-badge.bottom-left { bottom: 10%; left: 10%; }

          .star-icon { width: 28px; height: 28px; background: #fff7ed; color: #f97316; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; }
          .pulse-icon { width: 28px; height: 28px; background: #f0fdf4; color: #0d9488; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

          .badge-text { display: flex; flex-direction: column; }
          .badge-text .label { font-size: 7px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; }
          .badge-text .value { font-size: 11px; font-weight: 800; color: #1e293b; }

          @media (max-width: 1024px) {
            .new-dashboard-hero { grid-template-columns: 1fr; padding: 32px; gap: 32px; }
            .hero-left { align-items: center; text-align: center; }
            .hero-sub { margin: 0 auto 24px; }
            .hero-actions { justify-content: center; }
            .hero-stats-row { justify-content: center; }
            .hero-right { justify-content: center; }
            .hero-image-wrapper { aspect-ratio: 16/9; }
          }

          @media (max-width: 640px) {
            .new-dashboard-hero { padding: 24px 16px; border-radius: 20px; margin-bottom: 20px; }
            .hero-left h1 { font-size: 28px; }
            .hero-actions { flex-direction: column; width: 100%; gap: 10px; }
            .book-btn-hero, .services-btn-hero { width: 100%; justify-content: center; }
            .hero-stats-row { gap: 20px; }
          }
        `}} />

    </div>
  );
});
