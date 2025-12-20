import React, { useState } from 'react';
import { UserRound, Star, Phone, Mail, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { DoctorModal } from '../components/DoctorModal';

const DoctorCard = ({ id, name, specialty, patients, experience, phone, email, onDelete }) => {
  return (
    <div className="doctor-card card">
      <div className="doc-header">
        <div className="doc-avatar">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="doc-badge glass">
          <Star size={12} fill="var(--accent)" color="var(--accent)" />
          <span>4.9</span>
        </div>
        <div className="doc-top-actions">
          <button className="delete-btn" onClick={() => onDelete(id)} title="Delete Doctor">
            <Trash2 size={18} />
          </button>
          <button className="doc-options"><MoreHorizontal size={18} /></button>
        </div>
      </div>

      <div className="doc-info">
        <h3>{name}</h3>
        <p>{specialty}</p>
      </div>

      <div className="doc-stats">
        <div className="doc-stat">
          <span className="stat-num">{patients || 0}</span>
          <span className="stat-label">Patients</span>
        </div>
        <div className="stat-divider"></div>
        <div className="doc-stat">
          <span className="stat-num">{experience || 12}</span>
          <span className="stat-label">Years Exp.</span>
        </div>
      </div>

      <div className="doc-actions">
        <button className="contact-btn glass" onClick={() => phone && window.open(`tel:${phone}`)}><Phone size={16} /></button>
        <button className="contact-btn glass" onClick={() => email && window.open(`mailto:${email}`)}><Mail size={16} /></button>
        <button className="view-profile-btn">View Profile</button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .doctor-card { padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; width: 100%; }
        .doc-header { width: 100%; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; position: relative; }
        .doc-top-actions { display: flex; gap: 8px; }
        .delete-btn { color: var(--text-muted); transition: color 0.2s; padding: 4px; border-radius: 6px; }
        .delete-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }
        .doc-avatar { width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700; color: var(--primary); border: 4px solid white; box-shadow: var(--shadow-md); }
        .doc-badge { position: absolute; top: 0; left: 50%; transform: translateX(-50%) translateY(-10px); padding: 4px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 4px; box-shadow: var(--shadow-sm); z-index: 10; }
        .doc-info h3 { font-size: 18px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .doc-info p { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; }
        .doc-stats { width: 100%; display: flex; justify-content: space-around; background: #f8fafc; padding: 12px; border-radius: var(--radius-md); margin-bottom: 24px; }
        .doc-stat { display: flex; flex-direction: column; gap: 2px; }
        .stat-num { font-size: 16px; font-weight: 700; color: var(--text-main); }
        .stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-divider { width: 1px; height: 30px; background: #e2e8f0; }
        .doc-actions { width: 100%; display: flex; gap: 12px; }
        .contact-btn { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 10px; color: var(--text-muted); transition: all 0.2s ease; flex-shrink: 0; }
        .contact-btn:hover { color: var(--primary); background: rgba(13, 148, 136, 0.05); }
        .view-profile-btn { flex: 1; height: 40px; background: var(--primary); color: white; border-radius: 10px; font-size: 14px; font-weight: 600; transition: background 0.2s ease; white-space: nowrap; }
        .view-profile-btn:hover { background: var(--primary-hover); }

        @media (max-width: 640px) {
          .doctor-card { padding: 16px; }
          .doc-avatar { width: 64px; height: 64px; font-size: 20px; }
          .doc-info h3 { font-size: 16px; }
          .doc-stats { padding: 8px; margin-bottom: 16px; }
          .stat-num { font-size: 14px; }
          .stat-label { font-size: 10px; }
        }
      ` }} />
    </div>
  );
};

export const Doctors = ({ doctors, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteDoctor = (id) => {
    if (window.confirm("Are you sure you want to remove this medical staff member?")) {
      onDelete(id);
    }
  };

  return (
    <div className="doctors-page">
      <div
        className="dashboard-bg-overlay"
        style={{ backgroundImage: `url('/assets/images/dental-hero-6.jpg')` }}
      ></div>
      <DoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          onAdd(data);
          setIsModalOpen(false);
        }}
      />

      <div className="page-header">
        <div className="header-text">
          <h1>Medical Staff</h1>
          <p>Manage your clinic's specialized doctors</p>
        </div>
        <button className="add-doctor-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {doctors.length === 0 ? (
        <div className="empty-state card">
          <UserRound size={48} color="#e2e8f0" />
          <p>No doctors found in the records.</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <DoctorCard key={doctor.id} {...doctor} onDelete={handleDeleteDoctor} />
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .doctors-page { display: flex; flex-direction: column; gap: 32px; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
        .header-text h1 { font-size: 24px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .header-text p { color: var(--text-muted); font-size: 14px; }
        .add-doctor-btn { display: flex; align-items: center; gap: 8px; background: var(--primary); color: white; padding: 10px 20px; border-radius: 12px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2); white-space: nowrap; }
        .doctors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .empty-state { padding: 60px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-muted); text-align: center; }

        @media (max-width: 640px) {
          .page-header { flex-direction: column; align-items: flex-start; }
          .add-doctor-btn { width: 100%; justify-content: center; }
          .doctors-grid { grid-template-columns: 1fr; }
        }
      ` }} />
    </div>
  );
};
