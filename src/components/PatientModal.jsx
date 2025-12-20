import React, { useState } from 'react';
import { X, User, Calendar, Phone, Mail, MapPin, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import { validators, formatWhatsAppNumber } from '../utils/validators';

export const PatientModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        whatsapp: '',
        email: '',
        address: '',
        medicalHistory: '',
        emergencyContact: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    if (!isOpen) return null;

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
            case 'age':
                error = validators.age(value);
                break;
            case 'phone':
                error = validators.phone(value);
                break;
            case 'whatsapp':
                error = validators.whatsapp(value);
                break;
            case 'email':
                // Email is optional
                if (value) {
                    error = validators.email(value);
                }
                break;
            case 'address':
                error = validators.required(value, 'Address');
                break;
            case 'emergencyContact':
                error = validators.phone(value);
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

        // Required fields
        const requiredFields = ['name', 'age', 'phone', 'whatsapp', 'address', 'emergencyContact'];

        requiredFields.forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        // Optional email validation
        if (formData.email) {
            const emailError = validateField('email', formData.email);
            if (emailError) {
                newErrors.email = emailError;
                isValid = false;
            }
        }

        setErrors(newErrors);
        const newTouched = {};
        requiredFields.forEach(field => {
            newTouched[field] = true;
        });
        if (formData.email) newTouched.email = true;
        setTouched(newTouched);

        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // Format WhatsApp number before saving
            const dataToSave = {
                ...formData,
                whatsapp: formatWhatsAppNumber(formData.whatsapp)
            };
            onSave(dataToSave);
            handleClose();
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            age: '',
            phone: '',
            whatsapp: '',
            email: '',
            address: '',
            medicalHistory: '',
            emergencyContact: ''
        });
        setErrors({});
        setTouched({});
        onClose();
    };

    const isFormValid = () => {
        const requiredFields = ['name', 'age', 'phone', 'whatsapp', 'address', 'emergencyContact'];
        const allRequiredFilled = requiredFields.every(field => formData[field] !== '');
        const noErrors = Object.entries(errors).every(([key, err]) => {
            // Email errors don't count if email is empty (optional field)
            if (key === 'email' && !formData.email) return true;
            return err === '';
        });
        return allRequiredFilled && noErrors;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content card slide-up">
                <div className="modal-header">
                    <div className="header-icon-title">
                        <div className="header-icon-bg">
                            <User size={20} color="var(--primary)" />
                        </div>
                        <h3>Add New Patient</h3>
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
                                <User size={14} />
                                Full Name <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
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

                        {/* Age */}
                        <div className="form-group">
                            <label>
                                <Calendar size={14} />
                                Age <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="25"
                                min="1"
                                max="120"
                                value={formData.age}
                                onChange={(e) => handleChange('age', e.target.value)}
                                onBlur={() => handleBlur('age')}
                                className={errors.age && touched.age ? 'error' : ''}
                            />
                            {errors.age && touched.age && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.age}
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

                        {/* WhatsApp */}
                        <div className="form-group full-width">
                            <label>
                                <MessageSquare size={14} />
                                WhatsApp Number <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="+1 5551234567 (with country code)"
                                value={formData.whatsapp}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                onBlur={() => handleBlur('whatsapp')}
                                className={errors.whatsapp && touched.whatsapp ? 'error' : ''}
                            />
                            {errors.whatsapp && touched.whatsapp && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.whatsapp}
                                </span>
                            )}
                            <span className="field-hint">Include country code for WhatsApp notifications</span>
                        </div>

                        {/* Email */}
                        <div className="form-group full-width">
                            <label>
                                <Mail size={14} />
                                Email Address <span className="optional">(Optional)</span>
                            </label>
                            <input
                                type="email"
                                placeholder="patient@email.com"
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

                        {/* Address */}
                        <div className="form-group full-width">
                            <label>
                                <MapPin size={14} />
                                Address <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="123 Main Street, City, State, ZIP"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                onBlur={() => handleBlur('address')}
                                className={errors.address && touched.address ? 'error' : ''}
                            />
                            {errors.address && touched.address && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.address}
                                </span>
                            )}
                        </div>

                        {/* Emergency Contact */}
                        <div className="form-group full-width">
                            <label>
                                <Phone size={14} />
                                Emergency Contact Number <span className="required">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="+1 (555) 987-6543"
                                value={formData.emergencyContact}
                                onChange={(e) => handleChange('emergencyContact', e.target.value)}
                                onBlur={() => handleBlur('emergencyContact')}
                                className={errors.emergencyContact && touched.emergencyContact ? 'error' : ''}
                            />
                            {errors.emergencyContact && touched.emergencyContact && (
                                <span className="error-message">
                                    <AlertCircle size={12} />
                                    {errors.emergencyContact}
                                </span>
                            )}
                        </div>

                        {/* Medical History */}
                        <div className="form-group full-width">
                            <label>
                                <FileText size={14} />
                                Medical History / Notes <span className="optional">(Optional)</span>
                            </label>
                            <textarea
                                placeholder="Any allergies, medications, or medical conditions..."
                                rows="3"
                                value={formData.medicalHistory}
                                onChange={(e) => handleChange('medicalHistory', e.target.value)}
                            />
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
                            Add Patient
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
          max-width: 650px;
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

        .optional {
          color: var(--text-muted);
          font-weight: 500;
          font-size: 11px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          background: #f8fafc;
          transition: all 0.2s;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
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

        .field-hint {
          font-size: 11px;
          color: var(--text-muted);
          font-style: italic;
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
