import { Request, Response, NextFunction } from "express";
import { Appointment } from '../models/appointmentModel'
import mqttClient from '../mqtt/mqtt'
import { TOPICS } from '../mqtt/topics'
import { v4 as uuidv4 } from "uuid";

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

        const correlationId = uuidv4(); // randomly generated correlation ID, has to match from dentistService
        mqttClient.publish(
            TOPICS.APPOINTMENT.DENTIST_CREATE_APP,
            JSON.stringify({ correlationId, dentistId }),
            {qos: 2}
        );

        const validateDentist = await validateId(correlationId, TOPICS.APPOINTMENT.DENTIST_AWAIT_CONF);

        if(!validateDentist) {
            res.status(400).json({ message: "Could not validate dentistId." });
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
        console.error("[ERROR] Could not create appointment: ", error)
        next(error);
    }
};

const validateId = (correlationId: string, validationTopic: string) => { // Handshake method, can be used for both createAppointment
    return new Promise<boolean>((resolve, reject) => {                   // and bookAppointment
        const timeout = setTimeout(() => {
            mqttClient.removeListener('message', payloadHandler) // we clean up the listener to reduce mem leaks
            reject(new Error("Could not validate dentist in time."));
        }, 5000);

        const payloadHandler = (topic: string, payload: Buffer) => {
            if (topic === validationTopic) {
                try {
                    const payloadMsg = Buffer.isBuffer(payload) ? JSON.parse(payload.toString()) : payload;
                    if (payloadMsg.correlationId === correlationId) {
                        clearTimeout(timeout); // Clear the timeout
                        mqttClient.removeListener('message', payloadHandler); // we clean up the listener to reduce mem leaks
                        resolve(payloadMsg.status); // Resolve the promise
                    }
                } catch (error) {
                    mqttClient.removeListener('message', payloadHandler); // Clean up listener on parse error
                    clearTimeout(timeout); // Clear the timeout
                    reject(new Error("Failed to parse validation response."));
                }
            }
        };

        mqttClient.on('message', payloadHandler); // Add the listener
    });
};


export const bookAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { patientId, appointmentId } = req.body;

        if (!patientId || !appointmentId) {
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

        const correlationId = uuidv4(); // randomly generated correlation ID, has to match from dentistService

        mqttClient.publish(
            TOPICS.APPOINTMENT.PATIENT_BOOKING,
            JSON.stringify({ correlationId, patientId }),
            {qos: 2}
        );

        const validatePatient = await validateId(correlationId, TOPICS.APPOINTMENT.PATIENT_AWAIT_CONFIRMATION);
        
        if(!validatePatient) {
            res.status(400).json({ message: "Could not validate dentistId." });
            return;
        }

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
        res.status(404).json({ message: "Appointment not found."});
        return;
    }

    const deletedAppointment = await Appointment.deleteOne(appointment._id);

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

    res.status(200).json({ message: "Appointment deleted: ", appointment })
    } catch (error) {
        console.error("[ERROR] Could not delete appointment", error);
        next(error);
    }
}

export const getAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { appointmentId } = req.body;

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
        console.error("[ERROR] Could not fetch appointment: ", error);
        next(error);
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

    } catch (err) {
        console.error("[ERROR] Could not cancel appointment: ", err);
        next(err);
    }
}