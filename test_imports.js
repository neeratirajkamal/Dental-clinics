import express from 'express';
import twilio from 'twilio';
import cors from 'cors';
import fs from 'fs';

console.log('Express type:', typeof express);
console.log('Twilio type:', typeof twilio);
console.log('Cors type:', typeof cors);

try {
    const app = express();
    console.log('Express app created');
    app.use(cors());
    console.log('Cors middleware used');
} catch (e) {
    console.error('Express/Cors error:', e);
}

try {
    if (typeof twilio === 'function') {
        console.log('Twilio is a function');
        // Don't actually init client as we might lack keys
    } else {
        console.log('Twilio is NOT a function, keys:', Object.keys(twilio));
    }
} catch (e) {
    console.error('Twilio check error:', e);
}
