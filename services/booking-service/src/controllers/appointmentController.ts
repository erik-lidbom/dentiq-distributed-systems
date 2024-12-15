import { Appointment } from '../models/appointmentModel';


export type NotificationPayload = {
    patientId?: string | null,
    dentistId?: string,
    senderService?: string,
    message?: string
    typeOfNotification?: string,
    error?: boolean
};

export type ResponsePayload = {
    status: number,
    message: string,
    notificationPayload?: NotificationPayload
}

export const createAppointment = async (message: Buffer): Promise<ResponsePayload> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { dentistId, date, start_times } = payload;
;
        if(!dentistId || !date || !Array.isArray(start_times)) {
            const resPayload = {
                status: 400,
                message: 'Missing required field(s).',
                notificationPayload: {
                  typeOfNotification: 'AppointmentCreated',
                  error: true
                }
            }
            return resPayload;
        };
        
        const newAppointments = start_times.map((time) => ({
            dentistId,
            date,
            start_time: time,
            status: 'unbooked'
        }))
        
        await Appointment.insertMany(newAppointments);

        const notificationPayload = {
            dentistId: dentistId,
            senderService: 'AppointmentService',
            message: `${start_times}`,
            typeOfNotification: 'AppointmentCreated'
        };

        const resPayload = {
            status: 201,
            message: `Successfully created ${newAppointments.length} appointment(s).`,
            notificationPayload: notificationPayload
        }

        return resPayload;

    } catch (error) {
        const resPayload = {
            status: 500,
            message: 'Internal server error, please try again later',
            notificationPayload: {
              typeOfNotification: 'AppointmentCreated',
              error: true
            }
        };
        console.log('Error: ', error)

        return resPayload;
    }
}

export const bookAppointment = async (message: Buffer): Promise<ResponsePayload> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;

        const { patientId, appointmentId } = payload;


        if(!patientId || !appointmentId) {
            const resPayload = {
                status: 400,
                message: 'Missing required field(s).',
                notificationPayload: {
                  typeOfNotification: 'AppointmentBooked',
                  error: true
                }
            };
            return resPayload;
        }

    const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            const resPayload = {
                status: 404,
                message: 'Appointment could not be found.',
                notificationPayload: {
                  typeOfNotification: 'AppointmentBooked',
                  error: true
                }
            };
            return resPayload;
        }

        if(appointment.status !== 'unbooked') {
            const resPayload = {
                status: 400,
                message: 'Appointment already booked.',
                notificationPayload: {
                  typeOfNotification: 'AppointmentBooked',
                  error: true
                }
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
            message: `${bookedAppointment.start_time}`,
            typeOfNotification: 'AppointmentBooked'
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
            message: 'Internal server error, please try again later.',
            notificationPayload: {
              typeOfNotification: 'AppointmentBooked',
              error: true
            }
        };
        console.log("Error: ", error)
        return resPayload;
    }
};

export const deleteAppointment = async (message: Buffer): Promise<ResponsePayload> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { appointmentId } = payload

    if (!appointmentId) {
        const resPayload = {
            status: 400,
            message: 'Missing required field.',
            notificationPayload: {
              typeOfNotification: 'AppointmentDeleted',
              error: true
            }
        }
        return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);
    

    if(!appointment) {
        const resPayload = {
            status: 404,
            message: `Appointment with id ${appointmentId} not found.`,
            notificationPayload: {
              typeOfNotification: 'AppointmentDeleted',
              error: true
            }
        };
        return resPayload;
    }

    const deletedAppointment = await Appointment.deleteOne({ _id: appointment._id });

    const notificationPayload = {
        dentistId: appointment.dentistId,
        patientId: appointment.patientId,
        message: `${appointment.start_time}`,
        senderService: 'AppointmentService',
        typeOfNotification: 'AppointmentDeleted'
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
            message: 'Internal server error, please try again later.',
            notificationPayload: {
              typeOfNotification: 'AppointmentDeleted',
              error: true
            }
        };
        console.log("Error: ", error);
        return resPayload;
    };
};

export const cancelAppointment = async (message: Buffer): Promise<ResponsePayload> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;
        const { appointmentId } = payload;

        if(!appointmentId) {
            const resPayload = {
                status: 400,
                message: 'Missing required field.',
                notificationPayload: {
                  typeOfNotification: 'AppointmentCancelled',
                  error: true
                }
            };
            
            return resPayload;
        };

    const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            const resPayload = {
                status: 404,
                message: `Could not find appointment with ID: ${appointmentId}`,
                notificationPayload: {
                  typeOfNotification: 'AppointmentCancelled',
                  error: true
                }
            };
            return resPayload;
        };

        const notificationPayload = {
            dentistId: appointment.dentistId,
            patientId: appointment.patientId,
            message: `${appointment.start_time}`,
            senderService: "AppointmentService",
            typeOfNotification: 'AppointmentCancelled'
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
            message: 'Internal server error, please try again later.',
            notificationPayload: {
              typeOfNotification: 'AppointmentCancelled',
              error: true
            }
        };
        console.log("Error: ", error)
        return resPayload;
    }
}

export const getAppointment = async (message: Buffer): Promise<ResponsePayload> => {
    try {
        const payload = Buffer.isBuffer(message) ? JSON.parse(message.toString()) : message;

        const { appointmentId } = payload;

        if (!appointmentId) {
            const resPayload = {
                status: 400,
                message: 'Missing required field.',
                notificationPayload: {
                  typeOfNotification: 'GetAppointment',
                  error: true
                }
            };
            return resPayload;
        }

    const appointment = await Appointment.findById(appointmentId);

        if(!appointment) {
            const resPayload = {
                status: 404,
                message: `Could not find appointment with ID: ${appointmentId}`,
                notificationPayload: {
                  typeOfNotification: 'GetAppointment',
                  error: true
                }
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
            message: 'Internal server error, please try again later.',
            notificationPayload: {
              typeOfNotification: 'GetAppointment',
              error: true
            }
        };
        console.log("Error: ", error);
        return resPayload;
    }
};