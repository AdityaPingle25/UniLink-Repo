const Student = require('../models/Student');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Use Brevo HTTP API for email delivery (bypasses SMTP port blocking)
const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

/**
 * Send notification email to all students using Brevo API.
 * @param {string} subject - Email subject
 * @param {string} text - Email body (plain text)
 * @param {string} html - Email body (HTML)
 */
async function sendNotificationToAllStudents(subject, text, html) {
    try {
        if (!process.env.BREVO_API_KEY) {
            console.warn('BREVO_API_KEY not set. Notification recorded but not sent.');
            console.log(`[MOCK EMAIL SEND] Subject: ${subject}`);
            return;
        }

        const students = await Student.find({}, 'email fullName');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const recipientList = students
            .filter(s => s.email && emailRegex.test(s.email))
            .map(s => ({ email: s.email, name: s.fullName || 'Student' }));

        if (recipientList.length === 0) {
            console.log('No students found to send email to.');
            return;
        }

        // Brevo allows max 99 recipients per BCC call via API,
        // so we send in batches if needed.
        const BATCH_SIZE = 50;
        for (let i = 0; i < recipientList.length; i += BATCH_SIZE) {
            const batch = recipientList.slice(i, i + BATCH_SIZE);
            
            const result = await brevo.transactionalEmails.sendTransacEmail({
                sender: { 
                    name: 'UniLink Portal', 
                    email: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER 
                },
                to: [{ email: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER, name: 'UniLink Portal' }],
                bcc: batch,
                subject: subject,
                textContent: text,
                htmlContent: html
            });

            console.log(`Email batch ${Math.floor(i / BATCH_SIZE) + 1} sent successfully:`, result);
        }

        console.log(`Email notification sent to ${recipientList.length} students.`);
    } catch (error) {
        console.error('Error sending notification email via Brevo:', error.message || error);
    }
}

module.exports = { sendNotificationToAllStudents };
