import express, { Express, Router } from "express";
const router = express.Router();
import { createAppointment, deleteAppointment, getAppointment, bookAppointment, cancelAppointment } from "../controllers/appointmentController";

//outer.post("/", createAppointment); // Create an appointment
//outer.delete("/", deleteAppointment); // Delete an appointment
//outer.get("/", getAppointment); // Get an appointment
/// router.patch("/", patchAppointment); // Update an appointment
//outer.patch("/", bookAppointment);
//outer.patch("/", cancelAppointment)

export default router;