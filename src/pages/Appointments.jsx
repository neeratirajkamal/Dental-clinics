import React from 'react';
import { Clock, Filter, Plus, Search, MoreVertical, Trash2 } from 'lucide-react';
import { AppointmentModal } from '../components/AppointmentModal';
import { HeroBanner } from '../components/HeroBanner';

const AppointmentRow = ({ id, patient, doctor, time, type, status, onDelete }) => (
  <tr className="appt-row">
    <td>
      <div className="patient-cell">
        <div className="patient_avatar">{patient[0]}</div>
        <div className="patient-info">
          <span className="name">{patient}</span>
          <span className="id">#P-{id.toString().slice(-4)}</span>
        </div>
      </div>
    </td>
    <td>
      <div className="doctor-cell">
        <span className="doc-name">{doctor}</span>
        <span className="specialty hide-tablet">Dental Surgeon</span>
      </div>
    </td>
    <td>
      <div className="time-cell">
        <Clock size={14} className="hide-mobile" />
        <span>{time}</span>
      </div>
    </td>
    <td className="hide-mobile">
      <span className="type-tag">{type}</span>
    </td>
    <td>
      <span className={`status-pill ${status.toLowerCase()}`}>{status}</span>
    </td>
    <td>
      <div className="row-actions">
        <button className="note-btn" onClick={() => onDelete(id)} title="Delete Appointment"><Trash2 size={16} /></button>
        <button className="note-btn"><MoreVertical size={16} /></button>
      </div>
    </td>
  </tr>
);

export const Appointments = ({ appointments, onAdd, onDelete, doctors = [] }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      onDelete(id);
    }
  };

  return (
    <div className="appointments-page">
      <div
        className="dashboard-bg-overlay"
        style={{ backgroundImage: `url('/assets/images/dental-hero-2.jpg')` }}
      ></div>
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => {
          onAdd(data);
          setIsModalOpen(false);
        }}
        doctors={doctors}
      />

      <HeroBanner
        title="Patients Appointments"
        subtitle="Schedule and manage clinical sessions with ease."
        onBook={() => setIsModalOpen(true)}
        buttonText="New Appointment"
        backgroundImages={[
          "/assets/images/dental-hero-1.jpg",
          "/assets/images/dental-hero-2.jpg"
        ]}
      />

      <div className="appointments-table-container glass-card">
        <div className="table-header">
          <div className="table-search">
            <Search size={18} />
            <input type="text" placeholder="Search appointments..." />
          </div>
          <div className="table-tabs hide-tablet">
            <button className="tab active">List View</button>
            <button className="tab">Calendar</button>
          </div>
          <button className="note-btn hide-mobile">
            <Filter size={18} />
          </button>
        </div>

        <div className="table-wrapper">
          {appointments.length === 0 ? (
            <div className="empty-state-table">
              <Plus size={48} color="#e2e8f0" />
              <p>No appointments booked yet.</p>
            </div>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th className="hide-mobile">Treatment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appt => (
                  <AppointmentRow key={appt.id} {...appt} onDelete={handleDeleteAppointment} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
