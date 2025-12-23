import fs from 'fs';
import path from 'path';

const DB_FILE = './db.json';

if (fs.existsSync(DB_FILE)) {
    try {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        console.log('DB keys:', Object.keys(db));
        console.log('Appointments:', Array.isArray(db.appointments) ? 'Array' : typeof db.appointments);
        console.log('Patients:', Array.isArray(db.patients) ? 'Array' : typeof db.patients);
        console.log('Messages:', Array.isArray(db.messages) ? 'Array' : typeof db.messages);
        console.log('Doctors:', Array.isArray(db.doctors) ? 'Array' : typeof db.doctors);
    } catch (e) {
        console.error('DB Parse Error:', e.message);
    }
} else {
    console.log('DB_FILE not found');
}
