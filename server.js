const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'v2/.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static frontend files from 'v2/client'
app.use(express.static(path.join(__dirname, 'v2/client')));
// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes - Now relative to v2/server
const authRoutes = require('./v2/server/routes/auth');
const announcementRoutes = require('./v2/server/routes/announcements');
const scholarshipRoutes = require('./v2/server/routes/scholarships');
const internshipRoutes = require('./v2/server/routes/internships');
const eventRoutes = require('./v2/server/routes/events');
const assignmentRoutes = require('./v2/server/routes/assignments');
const studentRoutes = require('./v2/server/routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/students', studentRoutes);

// Catch-all to serve v2/client/index.html for any unknown route (enables client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'v2/client/index.html'));
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
