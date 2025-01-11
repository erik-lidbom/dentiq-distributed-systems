import express, { Express } from 'express';
import dotenv from 'dotenv';
import mqttClient from './mqtt/mqtt';
import connectToDB from './db/db';

// Initialize environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002; // Using a different port for Booking service

// MongoDB Connection
connectToDB();

// Start MQTT Client
mqttClient;

// Middleware
app.use(express.json());

// Start the Server
app.listen(port, () => {
  console.log(
    `[SERVER]: Appointment Microservice is running at http://localhost:${port}`
  );
  console.log('-------------------------------------------------------');
});
