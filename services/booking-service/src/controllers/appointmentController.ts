import { Request, Response, NextFunction } from "express";
import { Appointment } from '../models/appointmentModel'
import mqttClient from '../mqtt/mqtt'

export const createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patientId = null, dentistId, clinicId, start_time, end_time } = req.body;

        if (!dentistId || !clinicId || !start_time || !end_time) {
            res.status(400).json({ message: "Missing required field(s)."});
            return;
        }

        const newAppointment = new Appointment({
            patientId,
            dentistId,
            clinicId,
            start_time,
            end_time
        });

        const savedAppointment = await newAppointment.save();
        mqttClient.publish("dentiq", JSON.stringify(savedAppointment));

        res.status(201).json({ message: "New appointment registered" });
    } catch (error) {
        console.error("[ERROR] Could not create appointment: ", error)
        next(error);
    }
}

export const deleteAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
        res.status(400).json({ message: "Missing required field."});
        return;
    }

    const deletedAppointment = await Appointment.findById(appointmentId);

    if(!deleteAppointment) {
        res.status(404).json({ message: "Appointment not found."});
        return;
    }

    res.status(200).json({ message: "Appointment deleted: ", appointmentId })
    } catch (error) {
        console.error("[ERROR] Could not delete appointment", error);
        next(error);
    }
}

export const getAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { appointmentId } = req.body.appointmentId;

        if (!appointmentId) {
            res.status(400).json({ message: "Missing required field." });
            return;
        }

        const appointment = await Appointment.findById(appointmentId);

        res.status(200).json(appointment);

    } catch (error) {
        console.error("[ERROR] Could not fetch appointment: ", error);
        next(error);
    }
}

export const patchAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { appointmentId} = req.body.appointmentId;

        if(!appointmentId) {
            res.status(400).json({ message: "Missing required field. " })
            return;
        }

        const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            res.status(404).json({ message: "Appointment could not be found. " })
            return;
        }

        appointment.clinicId = req.body.clinicId || appointment.clinicId;
        appointment.dentistId = req.body.dentistId || appointment.dentistId;
        appointment.patientId = req.body.patientId || appointment.patientId;
        appointment.start_time = req.body.start_time || appointment.start_time;
        appointment.end_time = req.body.end_time || appointment.end_time;

    } catch (error) {
       console.error("[ERROR] Could not update appointment: ", error);
       next(error);
    }
}
