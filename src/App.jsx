import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientPortal } from './pages/PatientPortal';
import { Doctors } from './pages/Doctors';
import { Appointments } from './pages/Appointments';
import { Patients } from './pages/Patients';
import { Reports } from './pages/Reports';
import { LandingPage } from './pages/LandingPage';
import { AboutUs } from './pages/AboutUs';
import { ClinicalServices } from './pages/ClinicalServices';
import { AppointmentModal } from './components/AppointmentModal';
import { Sidebar } from './components/Sidebar';
import { MessagingSystem } from './components/MessagingSystem';
import { Chatbot } from './components/Chatbot';
import { PublicBooking } from './pages/PublicBooking';
import { CheckCircle, Calendar, MessageCircle, X, Activity } from 'lucide-react';
import { api } from './services/api';

const Settings = () => (
  <div className="settings-page">
    <div className="page-header">
      <div className="header-text">
        <h1>Settings</h1>
        <p>Manage your account, clinic preferences, and integrations</p>
      </div>
    </div>
    <div className="settings-container card">
      <h3>Integration Control</h3>
      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <span className="title">Google Calendar Sync</span>
            <span className="desc">Automatically sync all doctor appointments with their Google Calendar.</span>
          </div>
          <button className="toggle on">Enabled</button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <span className="title">WhatsApp Notifications</span>
            <span className="desc">Send automated appointment reminders to patients via WhatsApp.</span>
          </div>
          <button className="toggle off">Disabled</button>
        </div>
      </div>
    </div>

    <style dangerouslySetInnerHTML={{
      __html: `
      .settings-container { padding: 32px; max-width: 800px; width: 100%; }
      .settings-list { margin-top: 24px; display: flex; flex-direction: column; gap: 20px; }
      .setting-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; gap: 16px; }
      .setting-info { display: flex; flex-direction: column; gap: 4px; }
      .title { font-weight: 600; color: var(--text-main); }
      .desc { font-size: 13px; color: var(--text-muted); }
      .toggle { padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
      .toggle.on { background: #dcfce7; color: #166534; }
      .toggle.off { background: #f1f5f9; color: var(--text-muted); }
      @media (max-width: 640px) {
        .setting-item { flex-direction: column; align-items: flex-start; }
        .toggle { width: 100%; }
      }
    ` }} />
  </div>
);



const Notification = ({ message, type, onClose }) => {
  const icons = {
    calendar: <Calendar size={18} />,
    whatsapp: <MessageCircle size={18} />,
    success: <CheckCircle size={18} />,
    info: <Activity size={18} />
  };

  return (
    <div className={`app-notification ${type}`}>
      <div className="notif-content">
        <div className="notif-icon-wrapper">{icons[type] || icons.success}</div>
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="notif-close" aria-label="Close notification"><X size={14} /></button>
      <style dangerouslySetInnerHTML={{
        __html: `
        .app-notification { position: fixed; bottom: 24px; right: 24px; padding: 14px 20px; border-radius: 16px; background: #1e293b; color: white; display: flex; align-items: center; justify-content: space-between; gap: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1); z-index: 10000; animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); min-width: 320px; max-width: 450px; border: 1px solid rgba(255,255,255,0.1); }
        .notif-content { display: flex; align-items: center; gap: 14px; }
        .notif-content span { font-size: 14px; font-weight: 600; letter-spacing: -0.2px; }
        .notif-icon-wrapper { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); }
        .notif-close { color: rgba(255,255,255,0.4); transition: color 0.2s; }
        .notif-close:hover { color: white; }
        .app-notification.calendar { border-left: 4px solid #3b82f6; }
        .app-notification.whatsapp { border-left: 4px solid #22c55e; }
        .app-notification.success { border-left: 4px solid var(--primary); }
        .app-notification.info { border-left: 4px solid var(--secondary); }
        @keyframes slideIn { from { transform: translateX(100%) scale(0.9); opacity: 0; } to { transform: translateX(0) scale(1); opacity: 1; } }
        @media (max-width: 640px) { bottom: 16px; right: 16px; left: 16px; min-width: auto; max-width: none; }
      ` }} />
    </div>
  );
};

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('dental-clinic-role') || 'doctor');

  // State Initialization
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [messages, setMessages] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'System Notice', message: 'Connected to API Server.', time: 'Just now', read: false }
  ]);

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('dental-clinic-profile');
    if (saved) return JSON.parse(saved);
    return {
      name: role === 'doctor' ? 'Dr. Wilson' : 'Sarah J.',
      email: role === 'doctor' ? 'wilson@dentalclinic.com' : 'sarah.j@gmail.com',
      phone: role === 'doctor' ? '+1 (555) 001-9922' : '+1 (555) 002-8833',
      id: role === 'doctor' ? 'DOC-4492' : 'P-8821',
      role: role,
      password: 'password123'
    };
  });

  // Sync role to localStorage
  useEffect(() => {
    localStorage.setItem('dental-clinic-role', role);
  }, [role]);

  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const sendMessage = async (newMsg) => {
    // Optimistic update
    const tempMsg = { ...newMsg, id: Date.now() };
    setMessages(prev => [tempMsg, ...prev]);

    // Send to API
    try {
      await api.sendMessage(newMsg); // Use api.sendMessage now
    } catch (e) { console.error('Message send failed', e); }
  };

  const markRead = (id) => setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));

  // Fetch Data on Load
  useEffect(() => {
    const loadData = async () => {
      try {
        const [appts, pats, msgs, docs] = await Promise.all([
          api.getAppointments(),
          api.getPatients(),
          api.getMessages(),
          api.getDoctors()
        ]);
        setAppointments(appts || []);
        setPatients(pats || []);
        setMessages(msgs || []);
        setDoctors(docs || []);
        console.log('Data loaded from API');
      } catch (err) {
        console.error('API Load Error:', err);
        setNotification({ message: 'Failed to connect to server. Using offline mode.', type: 'info' });
      }
    };
    loadData();

    // 2. Real-time updates (Polling for AI changes)
    const interval = setInterval(() => {
      loadData();
    }, 10000); // Poll every 10s

    return () => clearInterval(interval);
  }, []); // Run once on mount

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addAppointment = async (newAppt) => {
    // Save to API
    let savedAppt = { ...newAppt, id: Date.now() };
    try {
      const res = await api.createAppointment(newAppt);
      if (res.success) savedAppt = res.appointment;
    } catch (e) { console.error(e); }

    setAppointments(prev => [...prev, savedAppt]);

    const newNotif = {
      id: Date.now(),
      type: 'calendar',
      title: 'New Appointment',
      message: `Confirmed ${newAppt.type} for ${newAppt.patient}.`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setNotification({ message: `Concierge: Securing clinical slot for ${newAppt.patient}...`, type: 'info' });

    console.log('Appointment synced with backend automation system.');

    // Multi-stage medical concierge sequence
    setTimeout(() => {
      setNotification({ message: `n8n Engine: Syncing Clinical Calendar...`, type: 'calendar' });

      // Auto-messaging logic
      const patientMsg = {
        id: Date.now() + 1,
        role: 'patient',
        type: 'success',
        text: `Your Clinic Journey begins! 🦷 Confirmed ${newAppt.type} session with ${newAppt.doctor} for ${newAppt.date} at ${newAppt.time}. Please remember to arrive 10 minutes prior to your slot.`,
        timestamp: new Date(),
        read: false
      };

      const doctorMsg = {
        id: Date.now() + 2,
        role: 'doctor',
        type: 'info',
        text: `Consultation Alert: ${newAppt.patient} has reserved a ${newAppt.type} slot for ${newAppt.date} at ${newAppt.time}. Clinical record sync complete.`,
        timestamp: new Date(),
        read: false
      };

      setMessages(prev => [patientMsg, doctorMsg, ...prev]);

      setTimeout(() => {
        setNotification({ message: `n8n Engine: Secure WhatsApp confirmation sent.`, type: 'whatsapp' });

        setTimeout(() => {
          setNotification({ message: `Concierge Process Complete. Have a great day!`, type: 'success' });
        }, 2000);
      }, 2000);
    }, 1500);
  };

  const deleteAppointment = async (id) => {
    try {
      await api.deleteAppointment(id);
      setAppointments(appointments.filter(a => a.id !== id));
      setNotification({ message: 'Appointment removed successfully', type: 'info' });
    } catch (e) { console.error(e); }
  };

  const resetIdentity = () => {
    localStorage.clear();
    window.location.reload();
  };

  const addDoctor = async (newDoc) => {
    let savedDoc = { ...newDoc, id: Date.now(), patients: 0 };
    try {
      const res = await api.createDoctor(newDoc);
      if (res.success) savedDoc = res.doctor;
    } catch (e) { console.error(e); }

    setDoctors([...doctors, savedDoc]);
    setNotification({ message: `Welcome Dr. ${newDoc.name} to the medical team!`, type: 'success' });
  };

  const deleteDoctor = async (id) => {
    try {
      await api.deleteDoctor(id);
      setDoctors(doctors.filter(d => d.id !== id));
      setNotification({ message: 'Doctor profile removed', type: 'info' });
    } catch (e) { console.error(e); }
  };

  const addPatient = async (newPat) => {
    let savedPat = { ...newPat, id: Date.now(), lastVisit: 'N/A', condition: 'New Patient' };
    try {
      const res = await api.createPatient(newPat);
      if (res.success) savedPat = res.patient;
    } catch (e) { console.error(e); }

    setPatients(prev => [...prev, savedPat]);
    setNotification({ message: `Patient ${newPat.name} added to records`, type: 'success' });
  };

  const deletePatient = async (id) => {
    try {
      await api.deletePatient(id);
      setPatients(patients.filter(p => p.id !== id));
      setNotification({ message: 'Patient record deleted', type: 'info' });
    } catch (e) { console.error(e); }
  };

  const updatePatient = async (updatedPat) => {
    try {
      await api.updatePatient(updatedPat.id, updatedPat);
      setPatients(prev => prev.map(p => p.id === updatedPat.id ? updatedPat : p));
      setNotification({ message: `Patient ${updatedPat.name} updated`, type: 'success' });
    } catch (e) {
      console.error('Update failed', e);
      setNotification({ message: 'Failed to update patient record', type: 'error' });
    }
  };


  const renderDashboard = () => {
    if (role === 'doctor') {
      return (
        <DoctorDashboard
          appointments={appointments}
          messages={messages}
          onOpenMessaging={() => setIsMessagingOpen(true)}
          onBookAppointment={() => setIsModalOpen(true)}
        />
      );
    }
    return (
      <PatientPortal
        appointments={appointments}
        messages={messages}
        onBookAppointment={() => setIsModalOpen(true)}
        onOpenMessaging={() => setIsMessagingOpen(true)}
        setNotification={setNotification}
      />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public pages - no sidebar / header */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<PublicBooking />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Protected App Pages - Wrapped in Layout */}
        <Route
          element={
            <Layout
              onBookAppointment={() => setIsModalOpen(true)}
              role={role}
              setRole={setRole}
              messages={messages}
              onOpenMessaging={() => setIsMessagingOpen(true)}
              notifications={notifications}
              setNotifications={setNotifications}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              onResetIdentity={resetIdentity}
            >
              <div className="page-transition">
                {/* Notification and Modals inside the layout context */}
                {notification && <Notification {...notification} onClose={() => setNotification(null)} />}
                <AppointmentModal
                  key={`modal-${isModalOpen}`}
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSave={addAppointment}
                  doctors={doctors}
                />
                {isMessagingOpen && (
                  <MessagingSystem
                    messages={messages}
                    role={role}
                    onSendMessage={sendMessage}
                    onMarkRead={markRead}
                    onClose={() => setIsMessagingOpen(false)}
                  />
                )}
                <Outlet />
              </div>
            </Layout>
          }
        >
          {/* Internal Routes matching as children of Layout */}
          <Route path="/portal" element={renderDashboard()} />
          <Route path="/doctors" element={<Doctors doctors={doctors} onAdd={addDoctor} onDelete={deleteDoctor} />} />
          <Route path="/patients" element={<Patients patients={patients} onAdd={addPatient} onDelete={deletePatient} onUpdatePatient={updatePatient} />} />
          <Route path="/appointments" element={<Appointments appointments={appointments} onAdd={addAppointment} onDelete={deleteAppointment} doctors={doctors} />} />
          <Route path="/reports" element={<Reports appointments={appointments} patientsCount={patients.length} />} />
          <Route path="/services" element={<ClinicalServices />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <Chatbot onBookAppointment={() => setIsModalOpen(true)} />
    </Router>
  );
}

export default App;
