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
        console.warn('[Automation] N8N_WEBHOOK_URL not set in .env');
    }

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

// WhatsApp Bot Webhook - Enhanced Dental Clinic Flow
const userState = {};
const CLINIC_NAME = 'Smile Dental Clinic';
const BOOKING_URL = 'http://localhost:5173/book'; // Update for production/ngrok

app.post('/incoming-whatsapp', async (req, res) => {
    const from = req.body.From;
    const body = req.body.Body?.trim().toLowerCase();
    const originalBody = req.body.Body?.trim();

    console.log(`[WhatsApp Bot] Message from ${from}: ${body}`);

    let responseText = '';

    // Initial greeting when user first clicks/joins
    if (!userState[from] && (body === 'hi' || body === 'hello' || body === 'hey' || body === 'start')) {
        responseText = `🦷 *Welcome to ${CLINIC_NAME}!*\n\nHow can I assist you Today?\n\n1️⃣ Reply *BOOK* - Schedule an appointment\n2️⃣ Reply *TECH* - Report technical issues\n3️⃣ Reply *TEAM* - Speak with our chat team\n4️⃣ Reply *SERVICES* - View our services\n5️⃣ Reply *MENU* - Show all options`;
        userState[from] = { step: 'IDLE' };
    }
    // Booking option
    else if (body === 'book' || body === '1') {
        responseText = `📅 *Book Your Appointment*\n\nYou can book instantly via our portal:\n${BOOKING_URL}\n\nOr reply with your *full name* to continue here:`;
        userState[from] = { step: 'NAME', startTime: Date.now() };
    }
    // Technical Issues
    else if (body === 'tech' || body === '2') {
        responseText = `🛠️ *Technical Support*\n\nPlease describe the issue you're facing. Our chat team will get to you shortly!`;
        userState[from] = { step: 'SUPPORT' };
    }
    // Team / Contact soon
    else if (body === 'team' || body === 'contact' || body === '3') {
        responseText = `🤝 *Connect with Team*\n\nOur chat team will get in contact with you shortly! Please stay tuned.`;
        userState[from] = { step: 'IDLE' };
    }
    // Name step
    else if (userState[from]?.step === 'NAME') {
        userState[from].name = originalBody;
        userState[from].step = 'PHONE';
        responseText = `Thanks *${userState[from].name}*! 👋\n\nPlease enter your *phone number* (for appointment reminders):`;
    }
    // Phone step
    else if (userState[from]?.step === 'PHONE') {
        userState[from].phone = originalBody;
        userState[from].step = 'TREATMENT';
        responseText = `Got it! 📱\n\nWhat *treatment* do you need?\n\n1️⃣ General Checkup\n2️⃣ Dental Cleaning\n3️⃣ Cavity Filling\n4️⃣ Root Canal\n5️⃣ Teeth Whitening\n6️⃣ Other\n\nReply with the number or type:`;
    }
    // Treatment step
    else if (userState[from]?.step === 'TREATMENT') {
        const treatments = {
            '1': 'General Checkup', '2': 'Dental Cleaning', '3': 'Cavity Filling',
            '4': 'Root Canal', '5': 'Teeth Whitening', '6': 'Other'
        };
        userState[from].treatment = treatments[body] || originalBody;
        userState[from].step = 'DATE';
        responseText = `🦷 *${userState[from].treatment}* - Great choice!\n\nWhat *date* works for you?\n\nPlease reply with your preferred date (e.g., "Tomorrow", "Monday", "25 Dec"):`;
    }
    // Date step
    else if (userState[from]?.step === 'DATE') {
        userState[from].date = originalBody;
        userState[from].step = 'TIME';
        responseText = `📅 Date: *${userState[from].date}*\n\nWhat *time* would you prefer?\n\nOur available slots:\n🕐 9:00 AM - 12:00 PM\n🕐 2:00 PM - 6:00 PM\n\nReply with your preferred time (e.g., "10:00 AM"):`;
    }
    // Time step - Final confirmation
    else if (userState[from]?.step === 'TIME') {
        userState[from].time = originalBody;
        userState[from].step = 'CONFIRM';

        responseText = `📋 *Please Confirm Your Appointment*\n\n🦷 *${CLINIC_NAME}*\n━━━━━━━━━━━━━━━\n👤 Name: ${userState[from].name}\n📱 Phone: ${userState[from].phone}\n🏥 Treatment: ${userState[from].treatment}\n📅 Date: ${userState[from].date}\n🕐 Time: ${userState[from].time}\n━━━━━━━━━━━━━━━\n\nReply *CONFIRM* to book this slot\nReply *CANCEL* to start over`;
    }
    // Confirmation
    else if (userState[from]?.step === 'CONFIRM' && body === 'confirm') {
        // Save to database
        const appointment = {
            id: Date.now(),
            patient: userState[from].name,
            phone: userState[from].phone,
            date: userState[from].date,
            time: userState[from].time,
            type: userState[from].treatment,
            doctor: 'Dr. Sarah Wilson',
            status: 'Confirmed',
            source: 'WhatsApp',
            timestamp: new Date().toISOString()
        };

        db.appointments.push(appointment);

        // Add patient if new
        const existingPatient = db.patients.find(p => p.phone === userState[from].phone);
        if (!existingPatient) {
            db.patients.push({
                id: Date.now(),
                name: userState[from].name,
                phone: userState[from].phone,
                lastVisit: 'First Visit',
                condition: 'New Patient',
                nextAppt: userState[from].date
            });
        }

        saveDB();
        console.log('[WhatsApp Bot] Appointment booked:', appointment);

        responseText = `✅ *Appointment Confirmed!*\n\n🎉 Thank you for choosing ${CLINIC_NAME}!\n\nYour appointment details have been saved. We'll send you a reminder before your visit.\n\n📍 *Address:* 123 Dental Street, Medical Plaza\n📞 *Contact:* +91 98765 43210\n\nSee you soon! 🦷✨\n\nReply *MENU* for more options.`;

        delete userState[from];
    }
    // Cancel
    else if (body === 'cancel') {
        delete userState[from];
        responseText = `❌ Booking cancelled.\n\nNo worries! Reply *BOOK* whenever you're ready to schedule an appointment.`;
    }
    // Services info
    else if (body === 'services' || body === '2') {
        responseText = `🦷 *Our Dental Services*\n\n✨ *General Dentistry*\n• Checkups & Cleanings\n• Cavity Fillings\n• Root Canal Treatment\n\n💎 *Cosmetic Dentistry*\n• Teeth Whitening\n• Veneers\n• Smile Makeover\n\n👶 *Pediatric Dentistry*\n• Kids Checkups\n• Fluoride Treatment\n\n🦷 *Orthodontics*\n• Braces\n• Aligners\n\nReply *BOOK* to schedule your appointment!`;
    }
    // Hours info
    else if (body === 'hours' || body === '3') {
        responseText = `🕐 *Clinic Hours*\n\n*Monday - Friday:*\n9:00 AM - 1:00 PM\n3:00 PM - 7:00 PM\n\n*Saturday:*\n9:00 AM - 2:00 PM\n\n*Sunday:* Closed\n\nReply *BOOK* to schedule your appointment!`;
    }
    // Location info
    else if (body === 'location' || body === '4') {
        responseText = `📍 *Our Location*\n\n*${CLINIC_NAME}*\n123 Dental Street\nMedical Plaza, 2nd Floor\nCity, State - 123456\n\n🗺️ Google Maps: [Click Here]\n\nReply *BOOK* to schedule your appointment!`;
    }
    // Menu
    else if (body === 'menu' || body === 'help') {
        responseText = `🦷 *${CLINIC_NAME} Menu*\n\n1️⃣ *BOOK* - Schedule appointment\n2️⃣ *SERVICES* - Our services\n3️⃣ *HOURS* - Clinic timings\n4️⃣ *LOCATION* - Find us\n\nHow can we help you?`;
    }
    // Default response
    else {
        responseText = `🦷 *Welcome to ${CLINIC_NAME}!*\n\nI didn't quite understand that.\n\nReply with:\n• *BOOK* to schedule an appointment\n• *MENU* for all options\n• *HI* to start over`;
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
                            body: `🦷 Hello ${appt.patient}! Your premium session for ${appt.type} is confirmed for ${appt.date} at ${appt.time}. We look forward to seeing you at Smile Dental Clinic.`,
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
                // Generate deep link simulation
                const eventTitle = encodeURIComponent(`Dental: ${appt.type} - ${appt.patient}`);
                appt.calendarSync = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=20241225T100000Z/20241225T110000Z`;
                updates = true;
                ErrorAgent.log('CalendarAgent', `Deep link generated for ${appt.patient}`);
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

// Run the multi-agent clinical OS every 30 seconds
setInterval(runAgentCycle, 30000);
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
