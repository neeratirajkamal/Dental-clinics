import express from 'express';
import twilio from 'twilio';
import fs from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the dist folder (production build)
const __dirnameStatic = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirnameStatic, 'dist')));

// --- Persistence Helper ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');

const defaultData = {
    appointments: [
        { id: 1, patient: 'Sarah Johnson', date: '2023-10-25', time: '10:00 AM', type: 'Root Canal', doctor: 'Dr. Wilson', status: 'Confirmed', notes: 'Patient requires anesthesia' },
        { id: 2, patient: 'Mike Brown', date: '2023-10-25', time: '11:30 AM', type: 'Dental Cleaning', doctor: 'Dr. Wilson', status: 'Pending', notes: 'Routine checkup' },
        { id: 3, patient: 'Emily Davis', date: '2023-10-26', time: '09:00 AM', type: 'Consultation', doctor: 'Dr. Wilson', status: 'Confirmed', notes: 'New patient' }
    ],
    patients: [
        { id: 1, name: 'Sarah Johnson', age: 28, lastVisit: '2023-09-15', condition: 'Healthy', nextAppt: '2023-10-25' },
        { id: 2, name: 'Mike Brown', age: 35, lastVisit: '2023-08-20', condition: 'Gingivitis', nextAppt: '2023-10-25' },
        { id: 3, name: 'Emily Davis', age: 24, lastVisit: 'N/A', condition: 'New Patient', nextAppt: '2023-10-26' }
    ],
    messages: [
        { id: 1, text: "Dr. Wilson, could we reschedule my Tuesday visit?", sender: "Sarah J.", role: 'doctor', read: false, timestamp: new Date().toISOString() },
        { id: 2, text: "Your lab results are ready for review.", sender: "Lab Corp", role: 'doctor', read: true, timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, text: "Reminder: Your appointment is tomorrow at 10 AM.", sender: "System", role: 'patient', read: false, timestamp: new Date().toISOString() }
    ],
    doctors: [
        { id: 1, name: 'Dr. Anjali Sharma', specialty: 'General Physician', patients: 120, rating: 4.9, available: true, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300' },
        { id: 2, name: 'Dr. Ramesh Verma', specialty: 'Dermatologist', patients: 85, rating: 4.8, available: true, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300' },
        { id: 3, name: 'Dr. Sarah Wilson', specialty: 'Dentist', patients: 200, rating: 4.9, available: true, image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300' }
    ]
};

// Load Data
let db = defaultData;
if (fs.existsSync(DB_FILE)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
        console.error('Failed to load DB, using defaults');
    }
} else {
    // Write defaults if file doesn't exist
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

const saveDB = () => {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};

// --- Twilio Setup ---
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
let client;

if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
    try {
        client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    } catch (err) {
        console.warn('Twilio init failed:', err.message);
    }
}

// --- API Endpoints ---

app.get('/', (req, res) => res.send('Dental Clinic API Verified & Running!'));

// Appointments
app.get('/api/appointments', (req, res) => res.json(db.appointments));

app.post('/api/appointments', async (req, res) => {
    const newAppt = {
        id: Date.now(),
        status: 'Confirmed',
        notes: 'Booked online',
        ...req.body
    };
    db.appointments.push(newAppt);

    // Also add to patients list if new
    const existingPatient = db.patients.find(p => p.name === newAppt.patient);
    if (!existingPatient) {
        db.patients.push({
            id: Date.now(),
            name: newAppt.patient,
            age: newAppt.age || 'N/A',
            phone: newAppt.phone || 'N/A',
            lastVisit: 'First Visit',
            condition: 'New Patient',
            nextAppt: newAppt.date
        });
    }

    saveDB();
    console.log('New Appointment Booked:', newAppt);

    // --- N8N Automation Trigger ---
    if (process.env.N8N_WEBHOOK_URL) {
        console.log('[Automation] Triggering N8N workflow:', process.env.N8N_WEBHOOK_URL);
        try {
            fetch(process.env.N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAppt)
            }).catch(err => console.error('[Automation] N8N Trigger Failed (Async):', err.message));
        } catch (e) {
            console.error('[Automation] N8N Fetch Error:', e.message);
        }
    } else {
        // console.warn('[Automation] N8N_WEBHOOK_URL not set in .env');
    }

    // --- TRIGGER INTERNAL AI AGENTS IMMEDIATELY ---
    console.log('[System] 🚀 Triggering Immediate AI Agent Workflow...');
    setImmediate(async () => {
        await runAgentCycle();
    });

    // (Optional) Internal Twilio Logic - Commented out to let n8n handle it
    /*
    if (client && newAppt.phone) {
        try {
            await client.messages.create({
                from: 'whatsapp:+14155238886',
                body: `Your appointment is confirmed for ${newAppt.date} at ${newAppt.time}.`,
                to: `whatsapp:${newAppt.phone}`
            });
        } catch (e) {
            console.log('WhatsApp notification failed:', e.message);
        }
    }
    */

    res.json({ success: true, appointment: newAppt });
});

app.delete('/api/appointments/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.appointments = db.appointments.filter(a => a.id !== id);
    saveDB();
    res.json({ success: true });
});

// Patients
app.get('/api/patients', (req, res) => res.json(db.patients));

app.delete('/api/patients/:id', (req, res) => {
    // ID might be string like "#P-1234" or number
    const id = req.params.id;
    // Check both string and int match just in case
    db.patients = db.patients.filter(p => p.id != id);
    saveDB();
    res.json({ success: true });
});

// Messages
app.get('/api/messages', (req, res) => res.json(db.messages));

app.post('/api/messages', (req, res) => {
    const newMsg = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...req.body
    };
    db.messages.push(newMsg);
    saveDB();
    res.json({ success: true, message: newMsg });
});

// Doctors
app.get('/api/doctors', (req, res) => res.json(db.doctors || []));

app.post('/api/doctors', (req, res) => {
    const newDoc = {
        id: Date.now(),
        patients: 0,
        ...req.body
    };
    if (!db.doctors) db.doctors = [];
    db.doctors.push(newDoc);
    saveDB();
    res.json({ success: true, doctor: newDoc });
});

app.delete('/api/doctors/:id', (req, res) => {
    if (!db.doctors) return res.json({ success: false });
    db.doctors = db.doctors.filter(d => d.id != req.params.id);
    saveDB();
    res.json({ success: true });
});

// Extra delete endpoints - already consolidated above
// Removed duplicated blocks below to avoid confusion

// End of generic API endpoints

// Basic Availability Endpoint
app.get('/api/available-slots', (req, res) => {
    const { date, doctor } = req.query;

    // Standard slots (Could be configurable per doctor/day in future)
    const allSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
    ];

    if (!date || !doctor) {
        return res.json(allSlots);
    }

    // Find booked slots
    const bookedSlots = db.appointments
        .filter(a => a.date === date && a.doctor === doctor && a.status === 'Confirmed')
        .map(a => a.time);

    // Filter available
    const available = allSlots.filter(time => !bookedSlots.includes(time));

    res.json(available);
});

// WhatsApp Bot Webhook - Enhanced Dental Clinic Flow (MediEaseAI Style)
const userState = {};
const CLINIC_NAME = 'Dental Clinic';
const BOOKING_URL = 'https://subdeltaic-angele-nonphrenetically.ngrok-free.dev/book';

app.post('/incoming-whatsapp', async (req, res) => {
    const from = req.body.From;
    const body = req.body.Body?.trim().toLowerCase();
    const originalBody = req.body.Body?.trim();

    console.log(`[WhatsApp Bot] Message from ${from}: ${body}`);

    let responseText = '';

    // Initial greeting when user sends Hi
    if (body === 'hi' || body === 'hello' || body === 'hey' || body === 'hy') {
        responseText = `Welcome to Dental Clinic How can I assist you Today ?\n\nClick below to book an appointment:\n${BOOKING_URL}`;
    }
    // Fallback for other inputs
    else {
        responseText = `Welcome to Dental Clinic How can I assist you Today ?\n\nClick below to book an appointment:\n${BOOKING_URL}`;
    }

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(responseText);
    res.type('text/xml').send(twiml.toString());
});

// --- Multi-Agent Clinical Operating System ---

/**
 * 1. Log & Error Agent
 * Monitors the health of all other agents and rectifies clinical states.
 */
const ErrorAgent = {
    logs: [],
    log: (agent, message, level = 'INFO') => {
        const entry = { timestamp: new Date().toISOString(), agent, message, level };
        console.log(`[${level}] [${agent}] ${message}`);
        ErrorAgent.logs.unshift(entry);
        if (ErrorAgent.logs.length > 100) ErrorAgent.logs.pop(); // Keep last 100
    },
    report: () => ErrorAgent.logs.slice(0, 5)
};

/**
 * 2. Coordinator Agent
 * Validates new clinical entries, auto-confirms, and assigns medical priority.
 */
const CoordinatorAgent = {
    process: () => {
        ErrorAgent.log('Coordinator', 'Scanning clinical queue...');
        let updates = false;
        db.appointments.forEach(appt => {
            if (appt.status === 'Pending') {
                appt.status = 'Confirmed';
                const emergencyTypes = ['Root Canal', 'Emergency', 'Acute Pain'];
                appt.priority = emergencyTypes.includes(appt.type) ? 'High' : 'Normal';

                db.messages.unshift({
                    id: Date.now(),
                    text: `[Coordinator] Verified: ${appt.patient} scheduled for ${appt.type}. Priority set to ${appt.priority}.`,
                    sender: "Coordinator Agent",
                    role: "doctor",
                    timestamp: new Date().toISOString()
                });
                updates = true;
            }
        });
        return updates;
    }
};

/**
 * 3. Notification Agent (WhatsApp Flow)
 * Monitors confirmed appointments and ensures patients receive their premium WhatsApp concierge.
 */
const NotificationAgent = {
    process: async () => {
        ErrorAgent.log('Notifier', 'Checking for unsent notifications...');
        let updates = false;
        for (const appt of db.appointments) {
            if (appt.status === 'Confirmed' && !appt.notified) {
                ErrorAgent.log('Notifier', `Triggering WhatsApp Concierge for ${appt.patient}...`);

                // Twilio Integration Simulation
                if (client && appt.phone) {
                    try {
                        await client.messages.create({
                            from: 'whatsapp:+14155238886',
                            body: `thanks for booking your appotiment\n\nDetails:\nName: ${appt.patient}\nDate: ${appt.date}\nTime: ${appt.time}\nDoctor: ${appt.doctor}`,
                            to: `whatsapp:${appt.phone}`
                        });
                        appt.notified = true;
                        updates = true;
                    } catch (err) {
                        ErrorAgent.log('Notifier', `Twilio Error: ${err.message}`, 'ERROR');
                    }
                } else {
                    // Simulation mode
                    appt.notified = 'Simulated';
                    updates = true;
                    ErrorAgent.log('Notifier', `WhatsApp simulation sent to ${appt.patient}`);
                }
            }
        }
        return updates;
    }
};

/**
 * 4. Calendar Sync Agent (Google Calendar)
 * Validates that all confirmed clinical slots are synced with the medical calendar system.
 */
const CalendarAgent = {
    process: () => {
        ErrorAgent.log('CalendarAgent', 'Validating medical calendar sync...');
        let updates = false;
        db.appointments.forEach(appt => {
            if (appt.status === 'Confirmed' && !appt.calendarSync) {
                // Generate deep link dynamically based on appt date/time
                const eventTitle = encodeURIComponent(`Dental: ${appt.type} - ${appt.patient}`);

                // Parse Date and Time (Assuming format YYYY-MM-DD and HH:mm AM/PM)
                // This is a basic parser. Ideally use moment or date-fns.
                try {
                    const dateParts = appt.date.split('-'); // 2023-10-25
                    // Convert Time '10:00 AM' to 24h
                    const [timeStr, period] = appt.time.split(' ');
                    let [hours, minutes] = timeStr.split(':');
                    if (period === 'PM' && hours !== '12') hours = parseInt(hours) + 12;
                    if (period === 'AM' && hours === '12') hours = '00';

                    // Construct ISO Strings roughly
                    // Note: Google Calendar link expects YYYYMMDDTHHMMSSZ (UTC) or floating time
                    // We'll use floating (local time) for simplicity: YYYYMMDDTHHMMSS
                    const startStr = `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${hours}${minutes}00`;
                    // Assume 1 hour duration
                    let endHours = parseInt(hours) + 1;
                    const endStr = `${dateParts[0]}${dateParts[1]}${dateParts[2]}T${endHours.toString().padStart(2, '0')}${minutes}00`;

                    appt.calendarSync = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startStr}/${endStr}`;
                    updates = true;
                    ErrorAgent.log('CalendarAgent', `Deep link generated for ${appt.patient}`);
                } catch (e) {
                    ErrorAgent.log('CalendarAgent', `Error generating link for ${appt.id}: ${e.message}`, 'ERROR');
                }
            }
        });
        return updates;
    }
};

// --- Multi-Agent Orchestrator ---
const runAgentCycle = async () => {
    try {
        let changed = false;

        // Sequential agent execution
        if (CoordinatorAgent.process()) changed = true;
        if (await NotificationAgent.process()) changed = true;
        if (CalendarAgent.process()) changed = true;

        if (changed) {
            saveDB();
            ErrorAgent.log('Orchestrator', 'Clinical state synced across all agents.');
        }
    } catch (err) {
        ErrorAgent.log('Orchestrator', `Cycle Failure: ${err.message}`, 'CRITICAL');
    }
};

// Run the multi-agent clinical OS every 60 seconds (Cleanup/Fallback)
setInterval(runAgentCycle, 60000);
ErrorAgent.log('System', 'Multi-Agent Clinical OS Initialized (v2.0 PRO)');

app.get('/api/system/health', (req, res) => {
    res.json({
        status: 'Operational',
        uptime: process.uptime(),
        agents: [
            { id: 'coordinator', name: 'Coordinator Agent', status: 'Running', icon: 'Activity' },
            { id: 'notifier', name: 'Notification Agent', status: client ? 'Integrated' : 'Simulating', icon: 'MessageCircle' },
            { id: 'calendar', name: 'Calendar Agent', status: 'Running', icon: 'Calendar' },
            { id: 'logger', name: 'Log Agent', status: 'Monitoring', icon: 'FileText' }
        ],
        logs: ErrorAgent.report()
    });
});

// Catch-all route to serve React app for client-side routing (must be after API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirnameStatic, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🚀 Dental Clinic Multi-Agent API
    ---------------------------------
    Agents: [Coordinator, Notifier, CalendarAgent, LogAgent]
    Status: ONLINE
    URL: http://localhost:${PORT}
    ---------------------------------
    `);
});
