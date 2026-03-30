require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the static frontend files from 'v2/client'
app.use(express.static(path.join(__dirname, '../client')));

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is successfully running on http://localhost:${PORT}`);
});
