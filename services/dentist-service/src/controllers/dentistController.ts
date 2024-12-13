import { Request, Response, NextFunction } from 'express';
import { Dentist } from '../models/dentistSchema';
import { publishMessage } from '../mqtt/mqtt'; // Import MQTT helper function

// Helper function to handle errors
const handleError = (error: any, res: Response): void => {
  if (error.code === 11000) {
    const duplicateField = Object.keys(error.keyValue)[0];
    res.status(409).json({
      message: `Duplicate value for field '${duplicateField}': ${error.keyValue[duplicateField]}`,
    });
  } else {
    res.status(500).json({
      message: 'An unexpected error occurred.',
      error: error.message,
    });
  }
};

// Create a new dentist
export const createDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      personnummer,
      firstName,
      lastName,
      password,
      email,
      appointments,
      clinics,
    } = req.body;

    // Validate required fields
    if (!personnummer || !firstName || !lastName || !password || !email) {
      res.status(400).json({ message: 'Missing required field(s).' });
      return;
    }

    const newDentist = new Dentist({
      personnummer,
      firstName,
      lastName,
      password,
      email,
      appointments,
      clinics,
    });

    const savedDentist = await newDentist.save();

    // Publish message to HiveMQ
    const message = {
      type: 'dentist',
      dentistId: savedDentist._id,
      personnummer,
      firstName,
      lastName,
      email,
      appointments,
      clinics,
    };
    publishMessage(process.env.DENTIST_TOPIC!, message);

    res
      .status(201)
      .json({ message: 'New dentist registered', dentist: savedDentist });
  } catch (error) {
    console.error('[ERROR] Could not create dentist: ', error);
    handleError(error, res);
  }
};

// Delete a dentist
export const deleteDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dentistId } = req.body;

    if (!dentistId) {
      res.status(400).json({ message: 'Missing required field: dentistId.' });
      return;
    }

    const deletedDentist = await Dentist.findByIdAndDelete(dentistId);

    if (!deletedDentist) {
      res.status(404).json({ message: 'Dentist not found.' });
      return;
    }

    res.status(200).json({ message: 'Dentist deleted', dentistId });
  } catch (error) {
    console.error('[ERROR] Could not delete dentist: ', error);
    handleError(error, res);
  }
};

// Get a dentist by ID
export const getDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dentistId } = req.query;

    if (!dentistId) {
      res.status(400).json({ message: 'Missing required field: dentistId.' });
      return;
    }

    const dentist = await Dentist.findById(dentistId).populate(
      'appointments clinics'
    );

    if (!dentist) {
      res.status(404).json({ message: 'Dentist not found.' });
      return;
    }

    res.status(200).json(dentist);
  } catch (error) {
    console.error('[ERROR] Could not fetch dentist: ', error);
    handleError(error, res);
  }
};

// Update a dentist (Patch)
export const patchDentist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dentistId, updates } = req.body;

    if (!dentistId || !updates) {
      res.status(400).json({ message: 'Missing required field(s).' });
      return;
    }

    const updatedDentist = await Dentist.findByIdAndUpdate(dentistId, updates, {
      new: true,
    }).populate('appointments clinics');

    if (!updatedDentist) {
      res.status(404).json({ message: 'Dentist not found.' });
      return;
    }

    res
      .status(200)
      .json({ message: 'Dentist updated', dentist: updatedDentist });
  } catch (error) {
    console.error('[ERROR] Could not update dentist: ', error);
    handleError(error, res);
  }
};

// Query multiple dentists
export const queryDentists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = req.body.filters || {};

    const dentists = await Dentist.find(filters).populate(
      'appointments clinics'
    );

    if (!dentists || dentists.length === 0) {
      res.status(404).json({ message: 'No dentists found.' });
      return;
    }

    res.status(200).json(dentists);
  } catch (error) {
    console.error('[ERROR] Could not query dentists: ', error);
    handleError(error, res);
  }
};
