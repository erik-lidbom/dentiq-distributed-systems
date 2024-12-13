import { Request, Response, NextFunction } from 'express';
import { Appointment } from '../models/appointmentModel';
import mqttClient from '../mqtt/mqtt';
import { TOPICS } from '../mqtt/topics';
import { v4 as uuidv4 } from 'uuid';

export type NotificationPayload = {
    patientId?: string | null,
    dentistId: string,
    senderService: string,
    message: string
    typeOfNotification?: string
};

export type Message_Status_Message = {
    status: number,
    message: string,
    notificationPayload?: NotificationPayload
}

export const createAppointment = async (message: Buffer): Promise<Message_Status_Message> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { dentistId, date, start_times } = payload;
;
        if(!dentistId || !date || !Array.isArray(start_times)) {
            const resPayload = {
                status: 404,
                message: 'Missing required field(s).'
            }
            return resPayload;
        };

        const newAppointment = new Appointment ({
            dentistId,
            date,
            start_times,
            status: 'unbooked'
        });

    const savedAppointment = await newAppointment.save();

        const notificationPayload = {
            dentistId: savedAppointment.dentistId,
            senderService: 'AppointmentService',
            message: `${savedAppointment.start_times}`,
            typeOfNotification: 'AppointmentCreated'
        };

        const resPayload = {
            status: 201,
            message: `Appointment successfully created with id: ${savedAppointment._id}`,
            notificationPayload: notificationPayload
        }

        return resPayload;

    } catch (error) {
        const resPayload = {
            status: 500,
            message: 'Internal server error, please try again later'
        };
        console.log('Error: ', error)

        return resPayload;
    }
}

export const bookAppointment = async (message: Buffer): Promise<Message_Status_Message> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { patientId, appointmentId, reason_for_visit } = payload;

        if(!patientId || !appointmentId) {
            const resPayload = {
                status: 400,
                message: 'Missing required field(s).'
            };
            return resPayload;
        }

    const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            const resPayload = {
                status: 404,
                message: 'Appointment could not be found.'
            };
            return resPayload;
        }

        if(appointment.status !== 'unbooked') {
            const resPayload = {
                status: 400,
                message: 'Appointment already booked. '
            };
            return resPayload;
        };

        appointment.status = 'booked';
        appointment.patientId = patientId;
        
        const bookedAppointment = await appointment.save();

        const notificationPayload = {
            dentistId: bookedAppointment.dentistId,
            patientId: bookedAppointment.patientId,
            senderService: "AppointmentService",
            message: `${bookedAppointment.start_times}`,
            typeOfNotification: 'AppointmentCreated'
        };

        const resPayload = {
            status: 200,
            message: `Appointment successfully booked with id: ${bookedAppointment._id}`,
            notificationPayload: notificationPayload
        };

        return resPayload;
    } catch (error) {
        const resPayload = {
            status: 500,
            message: 'Internal server error, please try again later.'
        };
        console.log("Error: ", error)
        return resPayload;
    }
};

export const deleteAppointment = async (message: Buffer): Promise<Message_Status_Message> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { appointmentId } = payload

    if (!appointmentId) {
        const resPayload = {
            status: 400,
            message: 'Missing required field.'
        }
        return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);
    

    if(!appointment) {
        const resPayload = {
            status: 404,
            message: `Appointment with id ${appointmentId} not found.`
        };
        return resPayload;
    }

    const deletedAppointment = await Appointment.deleteOne(appointment._id);

    const notificationPayload = {
        dentistId: appointment.dentistId,
        patientId: appointment.patientId,
        message: `${appointment.start_times}`,
        senderService: "AppointmentService"
    }

    const resPayload = {
        status: 200,
        message: `Appointment with ID ${appointment._id} successfully deleted.`,
        notificationPayload: notificationPayload
    };

    return resPayload;
    } catch (error) {
        const resPayload = {
            status: 500,
            message: 'Internal server error, please try again later.'
        };
        console.log("Error: ", error);
        return resPayload;
    };
};

export const getAppointment = async (message: Buffer): Promise<Message_Status_Message> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;

        const { appointmentId } = payload;

        if (!appointmentId) {
            const resPayload = {
                status: 400,
                message: 'Missing required field.'
            };
            return resPayload;
        }

    const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            const resPayload = {
                status: 404,
                message: `Could not find appointment with ID: ${appointmentId}`
            };
            return resPayload;
        }

        const resPayload = {
            status: 200,
            message: `Appointment: ${appointment}`
        };
        return resPayload;

    } catch (error) {
        const resPayload = {
            status: 500,
            message: 'Internal server error, please try again later.'
        };
        console.log("Error: ", error);
        return resPayload;
    }
};

export const cancelAppointment = async (message: Buffer): Promise<Message_Status_Message> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { appointmentId } = payload;

        if(!appointmentId) {
            const resPayload = {
                status: 400,
                message: 'Missing required field.'
            };
            
            return resPayload;
        };

    const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            const resPayload = {
                status: 404,
                message: `Could not find appointment with ID: ${appointmentId}`
            };
            return resPayload;
        };

        const notificationPayload = {
            dentistId: appointment.dentistId,
            patientId: appointment.patientId,
            message: `${appointment.start_times}`,
            senderService: "AppointmentService"
        }

        appointment.patientId = null;
        const updatedAppointment = await appointment.save()
    
        const resPayload = {
            status: 200,
            message: `Appointment with ID: ${appointment._id} successfully cancelled.`,
            notificationPayload: notificationPayload
        }
        return resPayload;
    } catch (error) {
        const resPayload = {
            status: 500,
            message: 'Internal server error, please try again later.'
        };
        console.log("Error: ", error)
        return resPayload;
    }
}