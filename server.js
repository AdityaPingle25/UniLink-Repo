const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Server and DB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
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

// Serve the static frontend files from 'v2/client'
app.use(express.static(path.join(__dirname, '../client')));

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
