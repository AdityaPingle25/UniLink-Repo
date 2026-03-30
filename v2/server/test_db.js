const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('URI loaded:', uri ? uri.substring(0, 40) + '...[rest hidden]' : '** UNDEFINED **');

console.log('Attempting to connect to MongoDB...');
mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.log('FAILED:', err.message);
    process.exit(1);
  });
