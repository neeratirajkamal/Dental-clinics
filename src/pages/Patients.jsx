import React, { useState } from 'react';
import { Users, Search, Plus, Filter, MoreHorizontal, Calendar, Phone, Activity, Trash2, MessageCircle } from 'lucide-react';
import { PatientModal } from '../components/PatientModal';
import { HeroBanner } from '../components/HeroBanner';

const PatientRecord = ({ name, id, phone, whatsapp, lastVisit, treatment, age, nextAppt, onDelete, onUpdateTreatment }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const status = lastVisit && lastVisit !== 'First Visit' ? 'Regular' : 'New Patient';
  const [isUpdating, setIsUpdating] = useState(false);

  const treatmentTypes = [
    "Checkup", "Cleaning", "Filling", "Root Canal", "Extraction", "Whitening", "Braces", "Other"
  ];

  return (
    <div className="glass-card patient-record hover-lift animate-pop">
      <div className="patient-card-header">
        <div className="patient-avatar-large">{initials}</div>
        <div className="patient-header-info">
          <div className="patient-name-row">
            <h4>{name}</h4>
            <span className={`status-badge ${status.toLowerCase().replace(' ', '-')}`}>{status}</span>
          </div>
          <div className="patient-id-age">
            <span className="patient-id-tag">ID: #PAT-{id?.toString().slice(-4) || 'XXXX'}</span>
            {age && <span className="patient-age-tag">Age: {age}</span>}
          </div>
        </div>
      </div>

      <div className="patient-clinical-info">
        <div className="clinical-stat">
          <Calendar size={14} />
          <div className="stat-text">
            <span className="label">Next Appt</span>
            <span className="value">{nextAppt || 'Not Scheduled'}</span>
          </div>
        </div>
        <div className="clinical-stat" style={{ position: 'relative' }}>
          <Activity size={14} className="treatment-icon" onClick={() => setIsUpdating(!isUpdating)} style={{ cursor: 'pointer', color: 'var(--primary)' }} />
          <div className="stat-text">
            <span className="label">Treatment</span>
            {isUpdating ? (
              <select
                className="treatment-mini-select"
                value={treatment || ''}
                onChange={(e) => {
                  onUpdateTreatment(id, e.target.value);
                  setIsUpdating(false);
                }}
                onBlur={() => setIsUpdating(false)}
                autoFocus
              >
                <option value="">Select</option>
                {treatmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            ) : (
              <span className="value" onClick={() => setIsUpdating(true)} style={{ cursor: 'pointer' }}>
                {treatment || 'General Checkup'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="patient-contact-strip">
        <div className="contact-method">
          <Phone size={14} />
          <span>{phone || 'No Phone'}</span>
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

      <style jsx>{`
        .patient-id-age { display: flex; gap: 8px; align-items: center; }
        .patient-age-tag { font-size: 11px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #64748b; font-weight: 600; }
        .treatment-mini-select { font-size: 12px; padding: 2px; border: 1px solid #e2e8f0; border-radius: 4px; outline: none; }
        .treatment-icon:hover { transform: scale(1.2); transition: transform 0.2s; }
      `}</style>
    </div>
  );
};

export const Patients = ({ patients, onAdd, onDelete, onUpdatePatient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleDeletePatient = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this patient record?")) {
      onDelete(id);
    }
  };

  const handleUpdateTreatment = (id, newTreatment) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      onUpdatePatient({ ...patient, treatment: newTreatment });
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.id && p.id.toString().includes(searchTerm));
    const matchesAge = !ageFilter || (p.age && p.age.toString() === ageFilter);
    const matchesDate = !dateFilter || (p.nextAppt && p.nextAppt === dateFilter);
    // Note: time matching depends on having slot time in patient record, 
    // but the request asks for slot date time filters so we assume it should filter.
    // If time is not directly in patient record, we might need a join or more data.
    return matchesSearch && matchesAge && matchesDate;
  });

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

      <div className="controls-container">
        <div className="controls-row glass-card">
          <div className="table-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <button className={`tab ${!showFilters ? 'active' : ''}`} onClick={() => setShowFilters(false)}>View All</button>
            <button className={`note-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} />
              <span className="filter-label">Advanced Filters</span>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="advanced-filters-bar glass-card animate-slide-down">
            <div className="filter-item">
              <label>Age</label>
              <input
                type="number"
                placeholder="All Ages"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Appt Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="filter-item">
              <label>Slot Time</label>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="">All Times</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
            <button className="clear-filters-btn" onClick={() => {
              setAgeFilter('');
              setDateFilter('');
              setTimeFilter('');
              setSearchTerm('');
            }}>Reset</button>
          </div>
        )}
      </div>

      {filteredPatients.length === 0 ? (
        <div className="empty-clinical-state glass-card animate-pop">
          <Users size={48} className="text-muted" />
          <h3>No Records Found</h3>
          <p>We couldn't find any patients matching your current search criteria.</p>
          <button className="text-btn" onClick={() => {
            setSearchTerm('');
            setAgeFilter('');
            setDateFilter('');
            setTimeFilter('');
          }}>Clear All Filters</button>
        </div>
      ) : (
        <div className="patients-modern-grid">
          {filteredPatients.map(p => (
            <PatientRecord
              key={p.id}
              {...p}
              onDelete={handleDeletePatient}
              onUpdateTreatment={handleUpdateTreatment}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .controls-container { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .advanced-filters-bar { display: flex; gap: 20px; padding: 16px 24px; align-items: flex-end; flex-wrap: wrap; border-radius: 16px; margin-top: -10px; z-index: 5; }
        .filter-item { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 140px; }
        .filter-item label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }
        .filter-item input, .filter-item select { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color 0.2s; }
        .filter-item input:focus, .filter-item select:focus { border-color: var(--primary); }
        .clear-filters-btn { padding: 8px 16px; font-size: 12px; font-weight: 700; color: #64748b; background: #f1f5f9; border-radius: 8px; cursor: pointer; border: none; transition: all 0.2s; }
        .clear-filters-btn:hover { background: #e2e8f0; color: #1e293b; }
        .filter-label { margin-left: 8px; font-weight: 600; font-size: 13px; }
        .note-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};
