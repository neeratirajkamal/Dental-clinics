const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
    getAppointments: async () => (await fetch(`${BASE_URL}/appointments`).then(res => res.json())),
    getPatients: async () => (await fetch(`${BASE_URL}/patients`).then(res => res.json())),
    getMessages: async () => (await fetch(`${BASE_URL}/messages`).then(res => res.json())),
    getDoctors: async () => (await fetch(`${BASE_URL}/doctors`).then(res => res.json())),
    getServices: async () => (await fetch(`${BASE_URL}/services`).then(res => res.json())),

    createAppointment: async (data) => (await fetch(`${BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())),

    createPatient: async (data) => (await fetch(`${BASE_URL}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())),

    createDoctor: async (data) => (await fetch(`${BASE_URL}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())),

    sendMessage: async (data) => (await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())),

    deleteAppointment: async (id) => (await fetch(`${BASE_URL}/appointments/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())),

    deleteDoctor: async (id) => (await fetch(`${BASE_URL}/doctors/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())),

    deletePatient: async (id) => (await fetch(`${BASE_URL}/patients/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())),

    updatePatient: async (id, data) => (await fetch(`${BASE_URL}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(res => res.json())),

    getAvailableSlots: async (date, doctor) => (await fetch(`${BASE_URL}/available-slots?date=${date}&doctor=${encodeURIComponent(doctor)}`).then(res => res.json())),
    getSystemHealth: async () => (await fetch(`${BASE_URL}/system/health`).then(res => res.json()))
};
