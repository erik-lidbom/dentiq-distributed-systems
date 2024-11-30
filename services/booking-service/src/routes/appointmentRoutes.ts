import express, { Express, Router } from "express";
const router = express.Router();
import { createAppointment, deleteAppointment, getAppointment, bookAppointment } from "../controllers/appointmentController";

router.post("/", createAppointment); // Create an appointment
router.delete("/", deleteAppointment); // Delete an appointment
router.get("/", getAppointment); // Get an appointment
// router.patch("/", patchAppointment); // Update an appointment
router.patch("/", bookAppointment);

export default router;