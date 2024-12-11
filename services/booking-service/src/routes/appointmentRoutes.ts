import express, { Express, Router } from "express";
const router = express.Router();
import { createAppointment, deleteAppointment, getAppointment, bookAppointment, cancelAppointment } from "../controllers/appointmentController";

router.post("/appointments", createAppointment); // Create an appointment
router.delete("/deleteAppointment", deleteAppointment); // Delete an appointment
router.get("/getAppointment", getAppointment); // Get an appointment
// router.patch("/", patchAppointment); // Update an appointment
router.patch("/bookAppointment", bookAppointment);
router.patch("/cancelAppointment", cancelAppointment)

export default router;