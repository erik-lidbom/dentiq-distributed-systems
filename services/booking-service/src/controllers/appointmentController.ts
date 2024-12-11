import { Request, Response, NextFunction } from "express";
import { Appointment } from '../models/appointmentModel'
import mqttClient from '../mqtt/mqtt'
import { TOPICS } from '../mqtt/topics'
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export const createAppointment = async (
    req: Request, 
    res: Response, 
    next: NextFunction): Promise<void> => {
    try {
        const { dentistId, start_time, end_time } = req.body;

        if (!dentistId || !start_time || !end_time) {
            res.status(400).json({ message: "Missing required field(s)." });
            return;
        }

        const newAppointment = new Appointment({
            dentistId,
            start_time,
            end_time,
            status: "unbooked"
        });

        const savedAppointment = await newAppointment.save();

        const notificationPayload = {
            dentistId: savedAppointment.dentistId,
            senderService: "AppointmentService",
            message: `${savedAppointment.start_time} - ${savedAppointment.end_time}`
        };
        console.log(JSON.stringify(notificationPayload))
        mqttClient.publish(
            TOPICS.APPOINTMENT.APPOINTMENT_CREATED,
            JSON.stringify(notificationPayload),
            {qos: 0}
        );

        res.status(201).json({ message: `Appointment successfully created with id: ${savedAppointment._id}` })

    } catch (error) {
        res.status(500).json({
            message: 'An unexpected error occured, please try again',
            error: error
        })
        console.error("[ERROR] Could not create appointment: ", error)
        next(error);
    }
};


export const bookAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patientId, appointmentId } = req.body;

        if (!patientId || !appointmentId) {
            console.log("KANOOON");
            res.status(400).json({ message: "Missing required field(s)."});
            return;
        };

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            res.status(404).json({ message: "Appointment could not be found." })
            return;
        }

        if (appointment.status !== "unbooked") {
            res.status(400).json({ message: "Appointment already booked. "});
            return;
        }

        appointment.status = "booked";
        appointment.patientId = patientId;

        const bookedAppointment = await appointment.save();

        const notificationPayload = { 
            dentistId: bookedAppointment.dentistId,
            patientId: bookedAppointment.patientId,
            message: `${bookedAppointment.start_time} - ${bookedAppointment.end_time}`,
            senderService: "AppointmentService"
        }

        mqttClient.publish(
            TOPICS.APPOINTMENT.APPOINTMENT_BOOKED, 
            JSON.stringify(notificationPayload)
        );

        res.status(200).json({ message: `Appointment successfully booked with id: ${bookedAppointment._id}` })
    } catch (error) {
        res.status(500).json({
            message: 'An unexpected error occured, please try again',
            error: error
        })
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

    const appointment = await Appointment.findById(appointmentId);
    

    if(!appointment) {
        res.status(404).json({ message: `Appointment with id: ${appointmentId} not found`});
        return;
    }

    const deletedAppointment = await Appointment.deleteOne({ _id: appointment._id });

    const notificationPayload = {
        dentistId: appointment.dentistId,
        patientId: appointment.patientId,
        message: `${appointment.start_time} - ${appointment.end_time}`,
        senderService: "AppointmentService"
    }

    mqttClient.publish(
        TOPICS.APPOINTMENT.DENTIST_DELETE_SLOT, 
        JSON.stringify(notificationPayload)
    );

    res.status(200).json({ message: `Appointment deleted with id: ${appointmentId}` });
    } catch (error) {
        res.status(500).json({
            message: 'An unexpected error occured, please try again',
            error: error
        })
        console.error("[ERROR] Could not delete appointment", error);
    }
}

export const getAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { appointmentId } = req.query;

        if (!appointmentId) {
            res.status(400).json({ message: "Missing required field." });
            return;
        }

        const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            res.status(404).json({ message: `Could not find appointment with ID: ${appointmentId}` });
            return;
        }

        res.status(200).json({ message: "Appointment: ", appointment });

    } catch (error) {
        res.status(500).json({
            message: 'An unexpected error occured, please try again',
            error: error
        })
        console.error("[ERROR] Could not fetch appointment: ", error);
    }
};

export const cancelAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { appointmentId } = req.body;

        if(!appointmentId) {
            res.status(400).json({ message: "Missing required field." });
            return;
        };

        const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            res.status(404).json({ message: `Could not find appointment with ID: ${appointmentId}` })
            return;
        };

        const notificationPayload = {
            dentistId: appointment.dentistId,
            patientId: appointment.patientId,
            message: `${appointment.start_time} - ${appointment.end_time}`,
            senderService: "AppointmentService"
        }

        appointment.patientId = null;
        const updatedAppointment = await appointment.save()
    
        mqttClient.publish(
            TOPICS.APPOINTMENT.PATIENT_CANCEL_SLOT, 
            JSON.stringify(notificationPayload)
        );

        res.status(200).json({ message: `Appointment with ID successfully canceled: ${appointment._id}` })

    } catch (error) {
        res.status(500).json({
            message: 'An unexpected error occured, please try again',
            error: error
        })
        console.error("[ERROR] Could not fetch appointment: ", error)
    }
}