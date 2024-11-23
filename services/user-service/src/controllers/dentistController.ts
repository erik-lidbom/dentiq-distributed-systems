import { Request, Response, NextFunction } from "express";
import { Dentist } from "../models/dentistSchema";

// Create a new dentist
export const createDentist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { personnummer, firstName, lastName, password, email } = req.body;

        // Validate required fields
        if (!personnummer || !firstName || !lastName || !password || !email) {
            res.status(400).json({ message: "Missing required field(s)." });
            return;
        }

        const newDentist = new Dentist({
            personnummer,
            firstName,
            lastName,
            password,
            email,
        });

        const savedDentist = await newDentist.save();

        res.status(201).json({ message: "New dentist registered", dentist: savedDentist });
    } catch (error) {
        console.error("[ERROR] Could not create dentist: ", error);
        next(error);
    }
};

// Delete a dentist
export const deleteDentist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { dentistId } = req.body;

        if (!dentistId) {
            res.status(400).json({ message: "Missing required field: dentistId." });
            return;
        }

        const deletedDentist = await Dentist.findByIdAndDelete(dentistId);

        if (!deletedDentist) {
            res.status(404).json({ message: "Dentist not found." });
            return;
        }

        res.status(200).json({ message: "Dentist deleted", dentistId });
    } catch (error) {
        console.error("[ERROR] Could not delete dentist: ", error);
        next(error);
    }
};

// Get a dentist by ID
export const getDentist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { dentistId } = req.query;

        if (!dentistId) {
            res.status(400).json({ message: "Missing required field: dentistId." });
            return;
        }

        const dentist = await Dentist.findById(dentistId);

        if (!dentist) {
            res.status(404).json({ message: "Dentist not found." });
            return;
        }

        res.status(200).json(dentist);
    } catch (error) {
        console.error("[ERROR] Could not fetch dentist: ", error);
        next(error);
    }
};

// Update a dentist (Patch)
export const patchDentist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { dentistId, updates } = req.body;

        if (!dentistId || !updates) {
            res.status(400).json({ message: "Missing required field(s)." });
            return;
        }

        const updatedDentist = await Dentist.findByIdAndUpdate(dentistId, updates, { new: true });

        if (!updatedDentist) {
            res.status(404).json({ message: "Dentist not found." });
            return;
        }

        res.status(200).json({ message: "Dentist updated", dentist: updatedDentist });
    } catch (error) {
        console.error("[ERROR] Could not update dentist: ", error);
        next(error);
    }
};

// Query multiple dentists
export const queryDentists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filters = req.body.filters || {};

        const dentists = await Dentist.find(filters);

        if (!dentists || dentists.length === 0) {
            res.status(404).json({ message: "No dentists found." });
            return;
        }

        res.status(200).json(dentists);
    } catch (error) {
        console.error("[ERROR] Could not query dentists: ", error);
        next(error);
    }
};
