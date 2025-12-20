import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, Shield, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export const ProfileSettings = ({ isOpen, onClose, profile, onUpdate, onDelete }) => {
    const [formData, setFormData] = useState({ ...profile, newPassword: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
            if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        // Simulate API delay
        setTimeout(() => {
            const updateData = { ...formData };
            delete updateData.newPassword;
            delete updateData.confirmPassword;
            if (formData.newPassword) updateData.password = formData.newPassword;

            onUpdate(updateData);
            setSuccess(true);
            setIsSubmitting(false);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="modal-overlay">
            <div className="profile-settings-modal card animate-pop">
                <div className="modal-header">
                    <div className="header-title">
                        <User className="text-primary" size={24} />
                        <div>
                            <h3>Profile Settings</h3>
                            <p>Manage your clinical identity and security</p>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-sections">
                        {/* General Info */}
                        <div className="form-section">
                            <label><User size={14} /> Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-msg"><AlertCircle size={12} /> {errors.name}</span>}
                        </div>

                        <div className="form-grid">
                            <div className="form-section">
                                <label><Mail size={14} /> Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className={errors.email ? 'error' : ''}
                                />
                                {errors.email && <span className="error-msg"><AlertCircle size={12} /> {errors.email}</span>}
                            </div>
                            <div className="form-section">
                                <label><Phone size={14} /> Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className="error-msg"><AlertCircle size={12} /> {errors.phone}</span>}
                            </div>
                        </div>

                        <div className="form-section">
                            <label><Shield size={14} /> Medical ID (Internal)</label>
                            <input type="text" value={formData.id} disabled className="disabled-input" />
                        </div>

                        <div className="divider">Security Credentials</div>

                        <div className="form-grid">
                            <div className="form-section">
                                <label><Lock size={14} /> New Password</label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                    className={errors.newPassword ? 'error' : ''}
                                />
                                {errors.newPassword && <span className="error-msg"><AlertCircle size={12} /> {errors.newPassword}</span>}
                            </div>
                            <div className="form-section">
                                <label><Lock size={14} /> Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="Repeat new password"
                                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                {errors.confirmPassword && <span className="error-msg"><AlertCircle size={12} /> {errors.confirmPassword}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="delete-account-btn"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete your clinical records? This cannot be undone.")) {
                                    onDelete();
                                    onClose();
                                }
                            }}
                        >
                            <Trash2 size={16} /> Delete Identity
                        </button>
                        <div className="footer-actions">
                            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Syncing...' : success ? 'Success!' : 'Update Profile'}
                                {success && <CheckCircle2 size={16} style={{ marginLeft: '8px' }} />}
                            </button>
                        </div>
                    </div>
                </form>

                <style dangerouslySetInnerHTML={{
                    __html: `
          .profile-settings-modal { width: 100%; max-width: 600px; z-index: 10001; }
          .modal-header { padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start; }
          .header-title { display: flex; gap: 16px; }
          .header-title h3 { font-size: 18px; font-weight: 800; color: var(--text-main); margin: 0; }
          .header-title p { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
          
          .profile-form { padding: 24px; }
          .form-sections { display: flex; flex-direction: column; gap: 20px; }
          .form-section { display: flex; flex-direction: column; gap: 8px; }
          .form-section label { font-size: 12px; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
          .form-section input { padding: 12px 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 14px; transition: all 0.2s; outline: none; }
          .form-section input:focus { border-color: var(--primary); background: #f0fdfa; }
          .form-section input.error { border-color: #ef4444; background: #fef2f2; }
          .disabled-input { background: #f1f5f9; color: var(--text-muted); cursor: not-allowed; }
          
          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .error-msg { font-size: 11px; color: #ef4444; font-weight: 600; display: flex; align-items: center; gap: 4px; }
          .divider { padding: 12px 0; font-size: 12px; font-weight: 800; color: var(--primary); text-transform: uppercase; border-bottom: 1px solid #f1f5f9; margin-top: 10px; }
          
          .modal-footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
          .footer-actions { display: flex; gap: 12px; }
          .delete-account-btn { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: #ef4444; padding: 8px 12px; border-radius: 10px; transition: all 0.2s; }
          .delete-account-btn:hover { background: #fef2f2; }
          
          @media (max-width: 640px) {
            .form-grid { grid-template-columns: 1fr; }
            .modal-footer { flex-direction: column-reverse; gap: 20px; }
            .footer-actions { width: 100%; }
            .footer-actions button { flex: 1; }
          }
        `}} />
            </div>
        </div>
    );
};
