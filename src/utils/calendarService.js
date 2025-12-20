/**
 * Utility to generate Google Calendar links for appointments.
 * This approach is privacy-friendly and doesn't require OAuth setup.
 */

export const generateGoogleCalendarLink = (appointment) => {
    if (!appointment || !appointment.date || !appointment.time) return '';

    const { patient, doctor, type, date, time } = appointment;

    // Format Title
    const title = encodeURIComponent(`Dental Appointment: ${type} with ${doctor}`);

    // Format Details
    const details = encodeURIComponent(
        `Patient: ${patient}\n` +
        `Doctor: ${doctor}\n` +
        `Treatment: ${type}\n` +
        `Status: Confirmed via Dental Clinic Portal`
    );

    const location = encodeURIComponent('Dental Clinic, Main Street');

    // Date formatting (YYYYMMDDTHHMMSSZ)
    // appointment.date is 'YYYY-MM-DD'
    // appointment.time is 'HH:MM AM/PM'

    try {
        const [hourStr, minutePart] = time.split(':');
        const [minuteStr, period] = minutePart.split(' ');

        let hours = parseInt(hourStr);
        const minutes = parseInt(minuteStr);

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const dateObj = new Date(date);
        dateObj.setHours(hours, minutes, 0);

        // Start time in ISO without separators
        const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");

        // End time (assume 45 mins duration)
        const endDateObj = new Date(dateObj.getTime() + 45 * 60000);
        const end = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const dates = `${start}/${end}`;

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    } catch (error) {
        console.error("Error generating calendar link:", error);
        return '';
    }
};

/**
 * Utility to generate Google Calendar links for Doctors.
 * Optimized with patient details and medical context.
 */
export const generateDoctorCalendarLink = (appointment) => {
    if (!appointment || !appointment.date || !appointment.time) return '';

    const { patient, age, phone, type, date, time, address } = appointment;

    // Doctor sees: Consultation: Patient Name - Treatment
    const title = encodeURIComponent(`Consultation: ${patient} - ${type}`);

    // Detailed description for the doctor
    const details = encodeURIComponent(
        `Patient: ${patient} (${age} Yrs)\n` +
        `Phone: ${phone}\n` +
        `Address: ${address}\n` +
        `Treatment Requested: ${type}\n` +
        `Platform: Clinic Portal`
    );

    const location = encodeURIComponent('Main Surgery - Dental Clinic');

    try {
        const [hourStr, minutePart] = time.split(':');
        const [minuteStr, period] = minutePart.split(' ');

        let hours = parseInt(hourStr);
        const minutes = parseInt(minuteStr);

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const dateObj = new Date(date);
        dateObj.setHours(hours, minutes, 0);

        const start = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
        const endDateObj = new Date(dateObj.getTime() + 60 * 60000); // 1 hour for doctor
        const end = endDateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");

        const dates = `${start}/${end}`;

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    } catch (error) {
        console.error("Error generating doctor calendar link:", error);
        return '';
    }
};

