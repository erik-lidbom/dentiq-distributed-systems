import express, { Router } from "express";
const router: Router = express.Router();

import { 
  createDentist, 
  deleteDentist, 
  getDentist, 
  patchDentist, 
  queryDentists 
} from "../controllers/dentistController";

// Route to create a new dentist
router.post("/", createDentist);

// Route to delete a dentist
router.delete("/", deleteDentist);

// Route to get a specific dentist by ID
router.get("/", getDentist);

// Route to update (patch) a dentist's information
router.patch("/", patchDentist);

// Route to query multiple dentists with filters
router.post("/query", queryDentists);

export default router;
