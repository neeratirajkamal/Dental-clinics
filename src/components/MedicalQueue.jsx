import React, { memo } from 'react';
import { Calendar as CalendarIcon, ChevronRight, ClipboardList } from 'lucide-react';

export const MedicalQueue = memo(({ appointments, selectedPatient, onSelectPatient }) => {
    return (
        <div className="schedule-timeline glass-card hover-lift">
            <div className="section-header">
                <h3>Medical Queue</h3>
                <span className={`date-pill ${appointments.length > 0 ? 'pulse' : ''}`}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
            </div>
            <div className="timeline">
                {appointments.length === 0 ? (
                    <div className="empty-schedule animate-pop">
                        <div className="empty-icon-bg">
                            <CalendarIcon size={40} className="text-muted" />
                        </div>
                        <p>No medical activity for today.</p>
                    </div>
                ) : (
                    appointments.map((appt) => (
                        <div
                            key={appt.id}
                            className={`timeline-item ${selectedPatient?.id === appt.id ? 'active' : ''} hover-lift`}
                            onClick={() => onSelectPatient(appt)}
                        >
                            <div className="time-marker">
                                <span className="time">{appt.time}</span>
                                <div className="line"></div>
                            </div>
                            <div className="patient-card-mini">
                                <div className="p-info">
                                    <span className="p-name">{appt.patient}</span>
                                    <span className="p-type">{appt.type} (Age: {appt.age || 'N/A'})</span>
                                </div>
                                <div className="p-actions">
                                    <button className="note-btn" aria-label="View Notes">
                                        <ClipboardList size={16} />
                                    </button>
                                    <ChevronRight size={18} color="#cbd5e1" className="hide-mobile" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
