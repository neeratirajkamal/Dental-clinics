import React, { useState } from 'react';
import { X, UserRound, Briefcase, Phone, Mail, Award, AlertCircle } from 'lucide-react';
import { validators } from '../utils/validators';

export const DoctorModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        specialty: '',
        experience: '',
        phone: '',
        email: '',
        license: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    if (!isOpen) return null;

    const specialties = [
        'General Dentist',
        'Orthodontist',
        'Periodontist',
        'Endodontist',
        'Oral Surgeon',
        'Pediatric Dentist',
        'Prosthodontist',
        'Cosmetic Dentist'
    ];

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });

        // Validate on change if field was touched
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
            case 'name':
                error = validators.name(value);
                break;
            case 'specialty':
                error = validators.specialty(value);
                break;
            case 'experience':
                error = validators.experience(value);
                break;
            case 'phone':
                error = validators.phone(value);
                break;
            case 'email':
                error = validators.email(value);
                break;
            case 'license':
                error = validators.license(value);
                break;
            default:
                break;
        }

        setErrors({ ...errors, [field]: error });
        return error;
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        Object.keys(formData).forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched({
            name: true,
            specialty: true,
            experience: true,
            phone: true,
            email: true,
            license: true
        });

        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            specialty: '',
            experience: '',
            phone: '',
            email: '',
            license: ''
        });
        setErrors({});
        setTouched({});
        onClose();
    };

    const isFormValid = () => {
        return Object.values(formData).every(val => val !== '') &&
            Object.values(errors).every(err => err === '');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content card slide-up">
                <div className="modal-header">
                    <div className="header-icon-title">
                        <div className="header-icon-bg">
                            <UserRound size={20} color="var(--primary)" />
                        </div>
                        <h3>Add New Doctor</h3>
                    </div>
                    <button onClick={handleClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-form">
                    <div className="form-grid">
                        {/* Full Name */}
                        <div className="form-group full-width">
                            <label>
                                <UserRound size={14} />
                                Full Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Dr. John Smith"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                className={errors.name && touched.name ? 'error' : ''}
                            />
                            {errors.name && touched.name && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.name}
                                </span>
                            )}
                        </div>

                        {/* Specialty */}
                        <div className="form-group full-width">
                            <label>
                                <Briefcase size={14} />
                                Type of Doctor (Specialty) <span className="required">*</span>
                            </label>
                            <select
                                value={formData.specialty}
                                onChange={(e) => handleChange('specialty', e.target.value)}
                                onBlur={() => handleBlur('specialty')}
                                className={errors.specialty && touched.specialty ? 'error' : ''}
                            >
                                <option value="">Select Specialty</option>
                                {specialties.map(spec => (
                                    <option key={spec} value={spec}>{spec}</option>
                                ))}
                            </select>
                            {errors.specialty && touched.specialty && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.specialty}
                                </span>
                            )}
                        </div>

                        {/* Years of Experience */}
                        <div className="form-group">
                            <label>
                                <Award size={14} />
                                Years of Experience <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="10"
                                min="0"
                                max="60"
                                value={formData.experience}
                                onChange={(e) => handleChange('experience', e.target.value)}
                                onBlur={() => handleBlur('experience')}
                                className={errors.experience && touched.experience ? 'error' : ''}
                            />
                            {errors.experience && touched.experience && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.experience}
                                </span>
                            )}
                        </div>

                        {/* License Number */}
                        <div className="form-group">
                            <label>
                                <Award size={14} />
                                License Number <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="DL-12345"
                                value={formData.license}
                                onChange={(e) => handleChange('license', e.target.value)}
                                onBlur={() => handleBlur('license')}
                                className={errors.license && touched.license ? 'error' : ''}
                            />
                            {errors.license && touched.license && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.license}
                                </span>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="form-group">
                            <label>
                                <Phone size={14} />
                                Phone Number <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                onBlur={() => handleBlur('phone')}
                                className={errors.phone && touched.phone ? 'error' : ''}
                            />
                            {errors.phone && touched.phone && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.phone}
                                </span>
                            )}
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label>
                                <Mail size={14} />
                                Email Address <span className="required">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="doctor@clinic.com"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                className={errors.email && touched.email ? 'error' : ''}
                            />
                            {errors.email && touched.email && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.email}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={handleClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="save-btn"
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                        >
                            Add Doctor
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 600px;
          padding: 32px;
          border-radius: 28px;
          overflow-y: auto;
          max-height: 90vh;
          border: none;
        }

        .slide-up {
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .required {
          color: #ef4444;
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #ef4444;
          font-weight: 500;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .cancel-btn {
          flex: 1;
          padding: 12px;
          background: #f1f5f9;
          color: var(--text-main);
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #e2e8f0;
        }

        .save-btn {
          flex: 2;
          padding: 12px 24px;
          background: var(--primary);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .full-width {
            grid-column: span 1;
          }

          .modal-content {
            padding: 24px;
          }
        }
      ` }} />
        </div>
    );
};
