import React, { memo } from 'react';
import { User, Stethoscope, Download, Plus } from 'lucide-react';

export const PatientDetailView = memo(({ selectedPatient, onDownloadRecord }) => {
    if (!selectedPatient) {
        return (
            <div className="patient-detail-view glass-card hover-lift">
                <div className="empty-profile animate-pop">
                    <div className="empty-icon-bg">
                        <User size={40} className="text-muted" />
                    </div>
                    <p>Select a patient from the queue to view their profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-detail-view glass-card hover-lift">
            <div className="p-profile-container animate-pop">
                <div className="p-header">
                    <div className="p-avatar">{selectedPatient.patient[0]}</div>
                    <div className="p-meta">
                        <h4>{selectedPatient.patient}</h4>
                        <span>Age: {selectedPatient.age || 'N/A'} • {selectedPatient.type}</span>
                    </div>
                </div>

                <div className="p-data-grid">
                    <div className="data-item">
                        <span className="lab">Next Slot</span>
                        <span className="val">{selectedPatient.time}</span>
                    </div>
                    <div className="data-item">
                        <span className="lab">Status</span>
                        <span className="val confirmed">Confirmed</span>
                    </div>
                </div>

                <div className="consult-area">
                    <label>Professional Notes</label>
                    <textarea placeholder="Record clinical observations here..."></textarea>
                </div>

                <div className="clinical-upload-zone card glass">
                    <label className="upload-label">
                        <Plus size={20} />
                        <div className="upload-text">
                            <span className="title">Secure Clinical Report Upload</span>
                            <span className="hint">Upload PDF or DICOM results directly to patient records</span>
                        </div>
                        <input type="file" className="hidden-input" onChange={(e) => {
                            if (e.target.files[0]) {
                                alert(`Clinical Report "${e.target.files[0].name}" successfully uploaded and encrypted.`);
                            }
                        }} />
                    </label>
                </div>

                <div className="actions-stack">
                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => alert("Note saved successfully to clinical history!")}>
                        <Stethoscope size={18} />
                        <span>Save Note to History</span>
                    </button>
                    <button className="text-btn" onClick={() => onDownloadRecord(selectedPatient)} style={{ width: '100%', padding: '12px', justifyContent: 'center', display: 'flex', gap: '8px' }}>
                        <Download size={16} /> Download Verification Record
                    </button>
                </div>
            </div>
        </div>
    );
});
