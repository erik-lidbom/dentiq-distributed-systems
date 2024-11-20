// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const exampleRoute = require('./booking/routes/routes.js');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/BookingService';

// Middleware
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.use('/api/example', exampleRoute);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
