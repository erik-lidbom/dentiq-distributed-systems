import express, { Router } from 'express';
const router = express.Router();
import {
  createPatient,
  deletePatient,
  getPatient,
  patchPatient,
} from '../controllers/patientController';

// Route to create a new patient
router.post('/', createPatient);

// Route to delete a patient
router.delete('/', deletePatient);

// Route to get a specific patient
router.get('/', getPatient);

// Route to update (patch) a patient's information
router.patch('/', patchPatient);

export default router;
