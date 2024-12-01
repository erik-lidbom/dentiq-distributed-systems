import { Router } from "express";
import {
  createNotification,
  getPatientNotifications,
} from "../controllers/controller";

/**
 * API Router setup
 * Add a new route by adding http method, route and controller function
 */
export const router = Router();

router.post("/", createNotification);
router.get("/:patientId", getPatientNotifications);
