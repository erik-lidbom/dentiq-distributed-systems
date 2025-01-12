import express, { Express } from 'express';
import dotenv from 'dotenv';
import mqttClient from './mqtt/mqttClient';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;
const mongoURI = process.env.MONGODB_URI || '';

// Middleware
app.use(express.json());

// MongoDB Connection

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .catch(function (err) {
    console.log(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.log(err.stack);
    process.exit(1);
  })
  .then(function () {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
  });

// Start MQTT client
mqttClient;

// Start the server
app.listen(port, () => {
  console.log(`[AUTH SERVICE]: Running on http://localhost:${port}`);
});
