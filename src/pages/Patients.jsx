import React, { useState } from 'react';
import { Users, Search, Plus, Filter, MoreHorizontal, Calendar, Phone, Activity, Trash2, MessageCircle } from 'lucide-react';
import { PatientModal } from '../components/PatientModal';
import { HeroBanner } from '../components/HeroBanner';

const PatientRecord = ({ name, id, phone, whatsapp, lastVisit, treatment, onDelete }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const status = lastVisit ? 'Regular' : 'New Patient';

  return (
    <div className="glass-card patient-record hover-lift animate-pop">
      <div className="patient-card-header">
        <div className="patient-avatar-large">{initials}</div>
        <div className="patient-header-info">
          <div className="patient-name-row">
            <h4>{name}</h4>
            <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
          </div>
          <span className="patient-id-tag">ID: #PAT-{id?.toString().slice(-4) || 'XXXX'}</span>
        </div>
      </div>

      <div className="patient-clinical-info">
        <div className="clinical-stat">
          <Calendar size={14} />
          <div className="stat-text">
            <span className="label">Last Visit</span>
            <span className="value">{lastVisit || 'First Consultation'}</span>
          </div>
        </div>
        <div className="clinical-stat">
          <Activity size={14} />
          <div className="stat-text">
            <span className="label">Primary Treatment</span>
            <span className="value">{treatment || 'General Checkup'}</span>
          </div>
        </div>
      </div>

      <div className="patient-contact-strip">
        <div className="contact-method">
          <Phone size={14} />
          <span>{phone}</span>
        </div>
        {whatsapp && (
          <div className="contact-method wa-active">
            <MessageCircle size={14} />
            <span>WhatsApp Active</span>
          </div>
        )}
      </div>

      <div className="patient-card-footer">
        <button className="text-btn danger small" onClick={() => onDelete(id)}>
          <Trash2 size={14} />
          Remove
        </button>
        <button className="btn-primary small">
          Full Profile
        </button>
      </div>
    </div>
  );
};

export const Patients = ({ patients, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeletePatient = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this patient record?")) {
      onDelete(id);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.id && p.id.toString().includes(searchTerm))
  );

  return (
    <div className="patients-page">
      <div
        className="dashboard-bg-overlay"
        style={{ backgroundImage: `url('/assets/images/dental-hero-5.jpg')` }}
      ></div>
      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          onAdd(data);
          setIsModalOpen(false);
        }}
      />

      <HeroBanner
        title="Patients Management"
        subtitle={`Maintaining records for ${patients.length} individuals in your clinical ecosystem.`}
        onBook={() => setIsModalOpen(true)}
        buttonText="Register New Patient"
        backgroundImages={[
          "/assets/images/dental-hero-5.jpg",
          "/assets/images/dental-hero-6.jpg"
        ]}
      />

      <div className="controls-row glass-card">
        <div className="table-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search clinical records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <button className="tab active">View All</button>
          <button className="tab hide-mobile">In Treatment</button>
          <button className="note-btn">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {filteredPatients.length === 0 ? (
        <div className="empty-clinical-state glass-card animate-pop">
          <Users size={48} className="text-muted" />
          <h3>No Records Found</h3>
          <p>We couldn't find any patients matching your current search criteria.</p>
          <button className="text-btn" onClick={() => setSearchTerm('')}>Clear Search</button>
        </div>
      ) : (
        <div className="patients-modern-grid">
          {filteredPatients.map(p => <PatientRecord key={p.id} {...p} onDelete={handleDeletePatient} />)}
        </div>
      )}
    </div>
  );
};
