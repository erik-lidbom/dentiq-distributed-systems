import { Request, Response, NextFunction } from "express";
import { Patient } from "../models/patientSchema";
import mqttClient from "../mqtt/mqtt";

// Helper function to handle errors
const handleError = (error: any, res: Response): void => {
    if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        res.status(409).json({
            message: `Duplicate value for field '${duplicateField}': ${error.keyValue[duplicateField]}`,
        });
    } else {
        res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

// Create a new patient
export const createPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { Personnummer, Firstname, Lastname, password, email } = req.body;

        if (!Personnummer || !Firstname || !Lastname || !password || !email) {
            res.status(400).json({ message: "Missing required field(s)." });
            return;
        }

        const newPatient = new Patient({
            Personnummer,
            Firstname,
            Lastname,
            password,
            email,
        });

        const savedPatient = await newPatient.save();

        // Publish message to MQTT
        const message = {
            patientId: savedPatient._id,
            Personnummer,
            Firstname,
            Lastname,
            email,
        };

        mqttClient.publish(
            process.env.PATIENT_TOPIC!,
            JSON.stringify(message),
            { qos: 2 },
            (err) => {
                if (err) {
                    console.error("[MQTT]: Failed to publish message:", err);
                } else {
                    console.log("[MQTT]: Message published successfully:", message);
                }
            }
        );

        res.status(201).json({ message: "New patient registered", patient: savedPatient });
    } catch (error) {
        console.error("[ERROR] Could not create patient: ", error);
        handleError(error, res);
    }
};

// Delete a patient
export const deletePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patientId } = req.body;

        if (!patientId) {
            res.status(400).json({ message: "Missing required field: patientId." });
            return;
        }

        const deletedPatient = await Patient.findByIdAndDelete(patientId);

        if (!deletedPatient) {
            res.status(404).json({ message: "Patient not found." });
            return;
        }

        res.status(200).json({ message: "Patient deleted", patientId });
    } catch (error) {
        console.error("[ERROR] Could not delete patient: ", error);
        handleError(error, res);
    }
};

// Get a patient by ID
export const getPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patientId } = req.query; // Retrieve from query parameters

        // Validate if patientId is provided
        if (!patientId) {
            res.status(400).json({ message: "Missing required field: patientId." });
            return;
        }

        // Find the patient by ID
        const patient = await Patient.findById(patientId);

        if (!patient) {
            res.status(404).json({ message: "Patient not found." });
            return;
        }

        // Return the patient details
        res.status(200).json(patient);
    } catch (error) {
        console.error("[ERROR] Could not fetch patient: ", error);
        handleError(error, res);
    }
};

// Update a patient (Patch)
export const patchPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patientId, updates } = req.body;

        if (!patientId || !updates) {
            res.status(400).json({ message: "Missing required field(s)." });
            return;
        }

        const updatedPatient = await Patient.findByIdAndUpdate(patientId, updates, { new: true });

        if (!updatedPatient) {
            res.status(404).json({ message: "Patient not found." });
            return;
        }

        res.status(200).json({ message: "Patient updated", patient: updatedPatient });
    } catch (error) {
        console.error("[ERROR] Could not update patient: ", error);
        handleError(error, res);
    }
};
