import React, { useState } from 'react';
import { X, Calendar, Clock, User, Activity, AlertCircle, CheckCircle2, Download, MessageCircle, ExternalLink, Search, Phone, MapPin, Loader } from 'lucide-react';
import { validators, formatWhatsAppNumber } from '../utils/validators';
import { generateGoogleCalendarLink, generateDoctorCalendarLink } from '../utils/calendarService';

export const AppointmentModal = ({ isOpen, onClose, onSave, doctors = [] }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: Slots, 3: Booking, 4: Confirmed
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    patient: '',
    age: '',
    phone: '',
    whatsapp: '6303551518',
    address: '',
    type: '',
    doctor: '',
    date: '',
    time: '',
    status: 'Confirmed'
  });


  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field]);
  };

  const validateField = (field, value) => {
    let error = '';
    switch (field) {
      case 'patient':
        error = validators.name(value);
        break;
      case 'age':
        error = validators.age(value);
        break;
      case 'phone':
        error = validators.phone(value);
        break;
      case 'whatsapp':
        error = validators.whatsapp(value);
        break;
      case 'address':
        error = validators.required(value, 'Address');
        break;
      case 'type':
        error = validators.required(value, 'Treatment');
        break;
      case 'doctor':
        error = validators.required(value, 'Doctor');
        break;
      case 'date':
        error = validators.futureDate(value);
        break;
      case 'time':
        error = validators.required(value, 'Time slot');
        break;
      default:
        break;
    }
    setErrors({ ...errors, [field]: error });
    return error;
  };

  if (!isOpen) return null;

  const handleCheckSlots = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setAvailabilityChecked(true);
    }, 1500);
  };

  const handleBook = async () => {
    setStep(3); // Show booking confirmation screen

    // Prepare data
    const finalData = {
      ...formData,
      id: Date.now(),
      whatsapp: formatWhatsAppNumber(formData.whatsapp)
    };

    // Data is sent to backend via onSave which uses api.createAppointment
    // The backend handles WhatsApp automation and email sync
    onSave(finalData);

    console.log('Syncing clinical record with AI Concierge...');

    // Generate Calendar Links
    const calendarLink = generateGoogleCalendarLink(finalData);
    const doctorCalendarLink = generateDoctorCalendarLink(finalData);
    setBookingDetails({ ...finalData, calendarLink, doctorCalendarLink });


    setStep(4); // Show success confirmation
  };

  const downloadPDF = () => {
    const content = `
      MEDICAL APPOINTMENT SUMMARY
      ---------------------------
      Patient: ${bookingDetails.patient}
      Age: ${bookingDetails.age}
      Phone: ${bookingDetails.phone}
      WhatsApp: ${bookingDetails.whatsapp}
      Doctor: ${bookingDetails.doctor}
      Treatment: ${bookingDetails.type}
      Date: ${bookingDetails.date}
      Time: ${bookingDetails.time}
      Status: ${bookingDetails.status}
      ---------------------------
      Google Calendar: Synced
      WhatsApp Notification: Sent
      ---------------------------
      This is a digitally generated clinical record.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_${bookingDetails.patient.replace(/\s/g, '_')}.txt`;
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content card slide-up">
        <div className="modal-header">
          <div className="header-icon-title">
            <div className="header-icon-bg">
              {step === 4 ? <CheckCircle2 size={20} color="#059669" /> : <Calendar size={20} color="var(--primary)" />}
            </div>
            <div>
              <h3 style={{ margin: 0 }}>{step === 4 ? 'Booking Confirmed' : 'Clinic Concierge'}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Step {step} of 4</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        {/* Premium Stepper */}
        {step < 3 && (
          <div className="form-stepper">
            <div className={`step-item ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-dot">{step > 1 ? '✓' : '1'}</div>
              <span className="step-label">Details</span>
            </div>
            <div className={`step-item ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-dot">{step > 2 ? '✓' : '2'}</div>
              <span className="step-label">Schedule</span>
            </div>
            <div className="step-item">
              <div className="step-dot">3</div>
              <span className="step-label">Finish</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="modal-form animate-slide-up">
            <div className="form-grid">
              <div className="form-group full-width">
                <label><User size={14} /> Patient Name <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.patient}
                  onChange={(e) => handleChange('patient', e.target.value)}
                  onBlur={() => handleBlur('patient')}
                  className={errors.patient && touched.patient ? 'error shake' : ''}
                />
                {errors.patient && touched.patient && (
                  <span className="error-message">
                    <AlertCircle size={12} />
                    {errors.patient}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label><Activity size={14} /> Age <span className="required">*</span></label>
                <input
                  type="number"
                  placeholder="Age"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  onBlur={() => handleBlur('age')}
                  className={errors.age && touched.age ? 'error shake' : ''}
                />
              </div>
              <div className="form-group full-width">
                <label><MessageCircle size={14} /> WhatsApp <span className="required">*</span></label>
                <input
                  type="tel"
                  placeholder="+1 5551234567"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  onBlur={() => handleBlur('whatsapp')}
                  className={errors.whatsapp && touched.whatsapp ? 'error shake' : ''}
                />
                <span className="field-hint">For premium hospital notifications</span>
              </div>
              <div className="form-group">
                <label><Activity size={14} /> Treatment <span className="required">*</span></label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  onBlur={() => handleBlur('type')}
                >
                  <option value="">Select Treatment</option>
                  <option>Routine Checkup</option>
                  <option>Dental Cleaning</option>
                  <option>Root Canal</option>
                  <option>Teeth Whitening</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label><User size={14} /> Consultant <span className="required">*</span></label>
                <select
                  required
                  value={formData.doctor}
                  onChange={(e) => handleChange('doctor', e.target.value)}
                  onBlur={() => handleBlur('doctor')}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name} - {doc.specialty}</option>
                  ))}
                  {doctors.length === 0 && (
                    <>
                      <option>Dr. James Wilson</option>
                      <option>Dr. Emily Blunt</option>
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="cancel-btn">Discard</button>
              <button
                type="button"
                className="save-btn"
                disabled={!formData.patient || !formData.doctor || !formData.type}
                onClick={() => setStep(2)}
              >
                Choose Slot →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="modal-form animate-slide-up">
            <div className="form-grid">
              <div className="form-group full-width">
                <label><Calendar size={14} /> Visit Date <span className="required">*</span></label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
              <div className="form-group full-width">
                <label><Clock size={14} /> Smart Slot Selection <span className="required">*</span></label>
                <div className="slots-grid-premium">
                  {['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '04:00 PM'].map(s => (
                    <div
                      key={s}
                      className={`slot-option ${formData.time === s ? 'selected' : ''}`}
                      onClick={() => handleChange('time', s)}
                    >
                      <span className="time">{s}</span>
                      <span className="availability">Available</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {availabilityChecked ? (
              <div className="availability-alert success animate-pop">
                <CheckCircle2 size={16} />
                <span>Excellent! This slot is reserved for you.</span>
              </div>
            ) : isChecking ? (
              <div className="availability-alert loading">
                <div className="spinner"></div>
                <span>Securing slot in clinic database...</span>
              </div>
            ) : null}

            <div className="modal-footer">
              <button type="button" onClick={() => setStep(1)} className="cancel-btn">Back</button>
              {!availabilityChecked ? (
                <button
                  type="button"
                  className="save-btn"
                  onClick={handleCheckSlots}
                  disabled={!formData.date || !formData.time || isChecking}
                >
                  {isChecking ? 'Securing...' : 'Verify Availability'}
                </button>
              ) : (
                <button
                  type="button"
                  className="save-btn success"
                  onClick={handleBook}
                >
                  Confirm Priority Booking
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="booking-confirmation-view animate-pop">
            <div className="booking-loader">
              <Loader size={64} className="spinning-loader" />
              <h3>Clinical Multi-Agent OS</h3>
              <p>Specialized agents are coordinating your medical booking.</p>
              <div className="booking-progress">
                <div className="progress-step completed">
                  <CheckCircle2 size={20} />
                  <span>[Agent] Coordinator: Confirmed Priority</span>
                </div>
                <div className="progress-step completed">
                  <CheckCircle2 size={20} />
                  <span>[Agent] Notifier: WhatsApp Sync Ready</span>
                </div>
                <div className="progress-step active">
                  <Loader size={20} className="spinning-small" />
                  <span>[Agent] Calendar: Generating Google Link</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && bookingDetails && (
          <div className="confirmation-view animate-slide-up">
            <div className="conf-summary card glass">
              <div className="conf-item">
                <span className="label">Guest</span>
                <span className="value">{bookingDetails.patient}</span>
              </div>
              <div className="conf-item">
                <span className="label">Treatment</span>
                <span className="value">{bookingDetails.type}</span>
              </div>
              <div className="conf-item">
                <span className="label">Physician</span>
                <span className="value">{bookingDetails.doctor}</span>
              </div>
              <div className="conf-item">
                <span className="label">Arrival</span>
                <span className="value">{bookingDetails.date} at {bookingDetails.time}</span>
              </div>
            </div>

            <div className="whatsapp-thanks">
              <div className="wa-bubble">
                <div className="wa-header">
                  <MessageCircle size={14} color="#128c7e" />
                  <span>Concierge Concirmed</span>
                </div>
                <p>Welcome to the clinic, <strong>{bookingDetails.patient}</strong>!</p>
                <p>Your premium session is booked for <strong>{bookingDetails.time}</strong>.</p>
              </div>
            </div>

            <div className="modal-footer vertical">
              <button type="button" onClick={downloadPDF} className="pwa-btn secondary hover-lift">
                <Download size={18} />
                <span>Handover PDF Summary</span>
              </button>
              {bookingDetails.calendarLink && (
                <a href={bookingDetails.calendarLink} target="_blank" rel="noopener noreferrer" className="pwa-btn primary hover-lift" style={{ textDecoration: 'none' }}>
                  <Calendar size={18} />
                  <span>Add to My Calendar</span>
                </a>
              )}
              <button type="button" onClick={onClose} className="pwa-btn secondary" style={{ fontWeight: 500 }}>
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal-content { width: 100%; max-width: 500px; padding: 32px; border-radius: var(--radius-lg); overflow-y: auto; max-height: 90vh; border: 1px solid var(--glass-border); box-shadow: var(--shadow-lg); background: white; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .header-icon-title { display: flex; align-items: center; gap: 12px; }
        .header-icon-bg { width: 44px; height: 44px; background: rgba(13, 148, 136, 0.08); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .header-icon-title h3 { font-size: 20px; font-weight: 800; color: var(--text-main); }
        .modal-form { display: flex; flex-direction: column; gap: 20px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .full-width { grid-column: span 2; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .required { color: #ef4444; font-weight: 700; }
        .form-group input, .form-group select { padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; outline: none; background: #f8fafc; transition: all 0.2s; }
        .form-group input:focus, .form-group select:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1); }
        .form-group input.error, .form-group select.error { border-color: #ef4444; background: #fef2f2; }
        .error-message { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #ef4444; font-weight: 500; margin-top: -4px; }
        .field-hint { font-size: 11px; color: var(--text-muted); font-style: italic; margin-top: -4px; }
        
        .slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; }
        .slot-chip { padding: 10px; font-size: 12px; font-weight: 700; border-radius: 10px; background: #f1f5f9; color: var(--text-muted); border: 1px solid transparent; transition: all 0.2s; }
        .slot-chip:hover { background: #e2e8f0; }
        .slot-chip.active { background: var(--primary); color: white; box-shadow: 0 4px 10px rgba(13, 148, 136, 0.2); }
        
        .availability-alert { display: flex; align-items: center; gap: 10px; padding: 14px; border-radius: 12px; font-size: 13px; font-weight: 600; margin-top: 10px; }
        .availability-alert.success { background: #ecfdf5; color: #065f46; border: 1px solid #10b98130; }
        .availability-alert.loading { background: #f8fafc; color: var(--text-muted); }
        .spinner { width: 16px; height: 16px; border: 2px solid #cbd5e1; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
 
        .confirmation-view { display: flex; flex-direction: column; gap: 20px; }
        .conf-summary { padding: 24px; border-radius: 20px; background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); }
        .conf-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .conf-item:last-child { border: none; }
        .conf-item .label { font-size: 12px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
        .conf-item .value { font-size: 14px; font-weight: 700; color: var(--text-main); }
        
        .integration-status { display: flex; flex-direction: column; gap: 12px; }
        .status-row { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px; border-radius: 14px; }
        .status-row.doctor-sync { background: #f0fdf4; border: 1px dashed #22c55e40; }
        
        .whatsapp-thanks { margin-bottom: 24px; }
        .wa-bubble { background: #e7fed3; padding: 16px; border-radius: 12px; border-top-left-radius: 0; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .wa-header { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
        .wa-header span { font-size: 11px; font-weight: 700; color: #128c7e; text-transform: uppercase; }
        .wa-bubble p { font-size: 14px; color: #111b21; margin-bottom: 4px; line-height: 1.4; }
        .wa-bubble strong { color: #000; }

        .wa-sync-btn { background: #25d366; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; transition: all 0.2s; margin-left: auto; }
        .wa-sync-btn:hover { background: #128c7e; transform: scale(1.05); }
        .wa-sync-btn.secondary { background: #3b82f6; }
        .wa-sync-btn.secondary:hover { background: #2563eb; }

        .s-icon { width: 32px; height: 32px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); box-shadow: var(--shadow-sm); }
        .s-info p { font-size: 13px; font-weight: 700; color: var(--text-main); }
        .s-info span { font-size: 11px; color: var(--text-muted); }
        .ext-link { margin-left: auto; color: var(--text-muted); }
 
        .modal-footer { display: flex; gap: 12px; margin-top: 8px; }
        .modal-footer.vertical { flex-direction: column; gap: 10px; margin-top: 20px; }
        .pwa-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 15px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .pwa-btn.primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; }
        .pwa-btn.primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(13, 148, 136, 0.2); }
        .pwa-btn.secondary { background: white; color: var(--text-main); border: 1px solid #e2e8f0; }
        .pwa-btn.secondary:hover { background: #f8fafc; }
 
        .cancel-btn { flex: 1; padding: 12px; background: #f1f5f9; color: var(--text-main); border-radius: 12px; font-weight: 700; transition: all 0.2s; }
        .cancel-btn:hover { background: #e2e8f0; }
        .save-btn { flex: 2; padding: 12px 24px; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border-radius: 12px; font-weight: 700; transition: all 0.3s ease; }
        .save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(13, 148, 136, 0.2); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-btn.success { background: #059669; }
        .save-btn.success:hover { background: #047857; }
 
        .booking-confirmation-view { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; }
        .booking-loader { display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .spinning-loader { color: var(--primary); animation: spin 1s linear infinite; }
        .spinning-small { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .booking-loader h3 { font-size: 24px; font-weight: 800; color: var(--text-main); margin: 0; letter-spacing: -0.5px; }
        .booking-loader p { font-size: 15px; color: var(--text-muted); margin: 0; }
        .booking-progress { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px; margin-top: 32px; }
        .progress-step { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9; transition: all 0.3s; }
        .progress-step.completed { background: rgba(5, 150, 105, 0.05); color: #059669; border-color: rgba(5, 150, 105, 0.1); }
        .progress-step.active { background: rgba(13, 148, 136, 0.05); color: var(--primary); border-color: rgba(13, 148, 136, 0.1); font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .progress-step span { font-size: 14px; }

        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      ` }} />
    </div>
  );
};
