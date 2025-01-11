import express, { Express, Router } from 'express';
const router = express.Router();
import {
  createAppointment,
  deleteAppointment,
  bookAppointment,
  cancelAppointment,
} from '../controllers/appointmentController';

//outer.post("/", createAppointment); // Create an appointment
//outer.delete("/", deleteAppointment); // Delete an appointment
//outer.get("/", getAppointment); // Get an appointment
/// router.patch("/", patchAppointment); // Update an appointment
//outer.patch("/", bookAppointment);
//outer.patch("/", cancelAppointment)

// router.get('/', getAppointments); // Get all appointments

export default router;
