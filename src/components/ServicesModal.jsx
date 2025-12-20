import React from 'react';
import { X, CheckCircle, Sparkles, Shield, Clock, Calendar } from 'lucide-react';

export const ServicesModal = ({ isOpen, onClose, onBookAppointment }) => {
  if (!isOpen) return null;

  const services = [
    {
      title: 'Routine Checkup',
      description: 'Comprehensive oral examination and preventive care',
      benefits: ['Early detection of dental issues', 'Professional cleaning', 'Personalized care advice'],
      icon: CheckCircle,
      color: '#0d9488'
    },
    {
      title: 'Dental Cleaning',
      description: 'Professional teeth cleaning and polishing',
      benefits: ['Remove plaque and tartar', 'Prevent gum disease', 'Fresher breath'],
      icon: Sparkles,
      color: '#3b82f6'
    },
    {
      title: 'Root Canal',
      description: 'Advanced endodontic treatment to save infected teeth',
      benefits: ['Pain relief', 'Preserve natural tooth', 'Prevent further infection'],
      icon: Shield,
      color: '#ef4444'
    },
    {
      title: 'Teeth Whitening',
      description: 'Professional whitening for a brighter smile',
      benefits: ['Safe and effective', 'Immediate results', 'Boost confidence'],
      icon: Sparkles,
      color: '#f59e0b'
    },
    {
      title: 'Orthodontics',
      description: 'Braces and aligners for perfect teeth alignment',
      benefits: ['Straighter teeth', 'Improved bite', 'Enhanced appearance'],
      icon: CheckCircle,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="services-modal-overlay">
      <div className="services-modal-content card slide-up">
        <div className="services-modal-header">
          <div className="header-icon-title">
            <div className="header-icon-bg">
              <Sparkles size={20} color="var(--primary)" />
            </div>
            <h3>Our Dental Services</h3>
          </div>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div className="services-intro">
          <p className="intro-text">
            At our dental clinic, we offer comprehensive dental care services designed to keep your smile healthy and beautiful.
            Our experienced team of dental professionals uses state-of-the-art technology to provide the highest quality care.
          </p>
        </div>

        <div className="services-list">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="service-item">
                <div className="service-icon-wrapper" style={{ background: service.color + '15' }}>
                  <Icon size={24} color={service.color} />
                </div>
                <div className="service-content">
                  <h4 className="service-title">{service.title}</h4>
                  <p className="service-description">{service.description}</p>
                  <ul className="service-benefits">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <CheckCircle size={14} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="booking-info-section">
          <div className="booking-info-card glass">
            <div className="info-icon">
              <Calendar size={24} color="var(--primary)" />
            </div>
            <div className="info-content">
              <h4>Easy Appointment Booking</h4>
              <p>
                Book your appointment at any available time slot by filling out our simple patient form
                and confirming your details. Our team will contact you via WhatsApp to confirm your booking.
              </p>
              <ul className="booking-steps">
                <li>
                  <Clock size={16} />
                  <span>Fill patient information form</span>
                </li>
                <li>
                  <Calendar size={16} />
                  <span>Select your preferred date & time</span>
                </li>
                <li>
                  <CheckCircle size={16} />
                  <span>Confirm your appointment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="services-modal-footer">
          <button onClick={onClose} className="cancel-btn">Close</button>
          <button
            onClick={() => {
              onClose();
              onBookAppointment();
            }}
            className="book-now-btn"
          >
            <Calendar size={18} />
            Book Appointment
          </button>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          .services-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .services-modal-content {
            width: 100%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 32px;
            border-radius: 28px;
            border: none;
          }

          .services-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding-bottom: 20px;
            border-bottom: 1px solid #f1f5f9;
          }

          .header-icon-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .header-icon-bg {
            width: 44px;
            height: 44px;
            background: rgba(13, 148, 136, 0.08);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .header-icon-title h3 {
            font-size: 22px;
            font-weight: 800;
            color: var(--text-main);
          }

          .services-intro {
            margin-bottom: 32px;
            padding: 20px;
            background: linear-gradient(135deg, rgba(13, 148, 136, 0.05), rgba(59, 130, 246, 0.05));
            border-radius: 16px;
            border: 1px solid rgba(13, 148, 136, 0.1);
          }

          .intro-text {
            font-size: 14px;
            line-height: 1.7;
            color: var(--text-muted);
            margin: 0;
          }

          .services-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 32px;
          }

          .service-item {
            display: flex;
            gap: 20px;
            padding: 24px;
            background: #f8fafc;
            border-radius: 18px;
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
          }

          .service-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            border-color: var(--primary);
          }

          .service-icon-wrapper {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .service-content {
            flex: 1;
          }

          .service-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-main);
            margin: 0 0 8px 0;
          }

          .service-description {
            font-size: 13px;
            color: var(--text-muted);
            margin: 0 0 12px 0;
            line-height: 1.5;
          }

          .service-benefits {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .service-benefits li {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
            color: var(--text-muted);
          }

          .service-benefits li svg {
            color: var(--primary);
            flex-shrink: 0;
          }

          .booking-info-section {
            margin-bottom: 24px;
          }

          .booking-info-card {
            padding: 24px;
            border-radius: 18px;
            border: 1px solid var(--glass-border);
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
          }

          .info-icon {
            width: 48px;
            height: 48px;
            background: rgba(13, 148, 136, 0.1);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }

          .info-content h4 {
            font-size: 16px;
            font-weight: 700;
            color: var(--text-main);
            margin: 0 0 12px 0;
          }

          .info-content p {
            font-size: 13px;
            line-height: 1.6;
            color: var(--text-muted);
            margin: 0 0 16px 0;
          }

          .booking-steps {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .booking-steps li {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
            font-weight: 600;
            color: var(--text-main);
            padding: 10px;
            background: white;
            border-radius: 10px;
          }

          .booking-steps li svg {
            color: var(--primary);
            flex-shrink: 0;
          }

          .services-modal-footer {
            display: flex;
            gap: 12px;
            padding-top: 20px;
            border-top: 1px solid #f1f5f9;
          }

          .cancel-btn {
            flex: 1;
            padding: 14px;
            background: #f1f5f9;
            color: var(--text-main);
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.2s;
          }

          .cancel-btn:hover {
            background: #e2e8f0;
          }

          .book-now-btn {
            flex: 2;
            padding: 14px 24px;
            background: var(--primary);
            color: white;
            border-radius: 12px;
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s;
          }

          .book-now-btn:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(13, 148, 136, 0.3);
          }

          @media (max-width: 768px) {
            .services-modal-content {
              padding: 24px;
            }

            .service-item {
              flex-direction: column;
              gap: 16px;
            }

            .service-icon-wrapper {
              width: 48px;
              height: 48px;
            }

            .header-icon-title h3 {
              font-size: 18px;
            }

            .services-modal-footer {
              flex-direction: column;
            }

            .cancel-btn, .book-now-btn {
              width: 100%;
            }
          }
        ` }} />
      </div>
    </div>
  );
};
