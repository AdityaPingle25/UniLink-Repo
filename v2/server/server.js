const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
    console.log(`\n\n--- INCOMING REQUEST ---`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log(`Original URL: ${req.originalUrl}`);
    next();
});
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Keep-alive endpoint for uptime monitors
app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});


// Serve the static frontend files from 'v2/client'
app.use(express.static(path.join(__dirname, '../client')));
// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes - Now relative to current directory
const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');
const scholarshipRoutes = require('./routes/scholarships');
const internshipRoutes = require('./routes/internships');
const eventRoutes = require('./routes/events');
const assignmentRoutes = require('./routes/assignments');
const studentRoutes = require('./routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/students', studentRoutes);

// Catch-all to serve v2/client/index.html for any unknown GET request (enables client-side routing)
app.use((req, res, next) => {
    console.log(`[CATCH-ALL] Unmatched request: ${req.method} ${req.originalUrl}`);
    next();
});
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Global Error Handler (Forces JSON instead of default Express HTML for unhandled errors)
app.use((err, req, res, next) => {
    console.error('Express caught error:', err.message || err);
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'File is too large! Please choose a smaller file.' });
    }
    // For API requests, always return JSON
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(err.status || 500).json({ success: false, message: err.message || 'Server Server Error' });
    }
    res.status(err.status || 500).send('Server Error');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
