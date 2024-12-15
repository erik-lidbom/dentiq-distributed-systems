import express, { Express } from 'express';
import dotenv from 'dotenv';
import mqttClient from './mqtt/mqtt';
import appointmentRouter from './routes/appointmentRoutes';
import connectToDB from './db/db';
import { getAppointments } from './controllers/appointmentController';
import cors from 'cors';

mqttClient;

dotenv.config();
connectToDB();

const app: Express = express();
const port = process.env.PORT || 3002;

// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Enable cross-origin resource sharing for frontend must be registered before api
app.use(
  cors({
    origin: '*',
  })
);

app.use('/api/appointments', appointmentRouter);
app.use('/api/bookAppointment', appointmentRouter);
app.use('/api/deleteAppointment', appointmentRouter);
app.use('/api/getAppointment', appointmentRouter);
app.use('/api/cancelAppointment', appointmentRouter);

app.get('/', async (req, res) => {
  try {
    await getAppointments(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

const server = app.listen(port, () => {
  console.log(`[SERVER]: Server is running at http://localhost:${port}`);
  console.log('-------------------------------------------------------');
});

export { app, server };
