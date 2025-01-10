import express, { Express } from 'express';
import dotenv from 'dotenv';
import { mqttClient } from './mqtt/mqtt';
import connectToDB from './db/db';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3010; 
connectToDB();
mqttClient.setup();

// Middleware
app.use(express.json());

// Start the Server
app.listen(port, () => {
  console.log(
    `[SERVER]: Logging Service is running at http://localhost:${port}`
  );
  console.log('-------------------------------------------------------');
});
