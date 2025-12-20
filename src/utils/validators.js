// Validation utility functions for form inputs

export const validators = {
    // Email validation
    email: (value) => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
    },

    // Phone number validation (supports various formats)
    phone: (value) => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-s.]?[(]?[0-9]{1,4}[)]?[-s.]?[0-9]{1,9}$/;
        return phoneRegex.test(value.replace(/\s/g, '')) ? '' : 'Please enter a valid phone number';
    },

    // Name validation
    name: (value) => {
        if (!value) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        const nameRegex = /^[a-zA-Z\s.'-]+$/;
        return nameRegex.test(value) ? '' : 'Name can only contain letters, spaces, and basic punctuation';
    },

    // Age validation
    age: (value) => {
        if (!value) return 'Age is required';
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return 'Age must be a number';
        if (numValue < 1 || numValue > 120) return 'Age must be between 1 and 120';
        return '';
    },

    // Years of experience validation
    experience: (value) => {
        if (!value) return 'Years of experience is required';
        const numValue = parseInt(value, 10);
        if (isNaN(numValue)) return 'Experience must be a number';
        if (numValue < 0 || numValue > 60) return 'Experience must be between 0 and 60 years';
        return '';
    },

    // Required field validation
    required: (value, fieldName = 'This field') => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return `${fieldName} is required`;
        }
        return '';
    },

    // License number validation
    license: (value) => {
        if (!value) return 'License number is required';
        if (value.trim().length < 5) return 'License number must be at least 5 characters';
        return '';
    },

    // Specialty validation
    specialty: (value) => {
        if (!value || value === '') return 'Please select a specialty';
        return '';
    },

    // Date validation (must be future date for appointments)
    futureDate: (value) => {
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Please select a future date';
        return '';
    },

    // WhatsApp number validation (international format)
    whatsapp: (value) => {
        if (!value) return 'WhatsApp number is required';
        // Remove all non-digit characters
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10 || cleaned.length > 15) {
            return 'WhatsApp number must be between 10-15 digits';
        }
        return '';
    }
};

// Helper function to validate entire form
export const validateForm = (formData, validationRules) => {
    const errors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
        const validator = validationRules[field];
        const error = validator(formData[field]);
        if (error) {
            errors[field] = error;
            isValid = false;
        }
    });

    return { isValid, errors };
};

// Format phone number for display
export const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

// Format WhatsApp number for API (international format)
export const formatWhatsAppNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    // If doesn't start with country code, assume it needs one
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
        return `+91${cleaned}`; // Default to India
    }
    return `+${cleaned}`;
};
