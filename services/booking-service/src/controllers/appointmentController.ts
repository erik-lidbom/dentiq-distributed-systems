import { Appointment } from '../models/appointmentModel';
import { publishMessage } from '../mqtt/publish';

export type NotificationPayload = {
  patientId?: string | null;
  dentistId?: string;
  senderService?: string;
  message?: string;
  typeOfNotification?: string;
  error?: boolean;
};

export type ResponsePayload = {
  status: number;
  message: string;
  data?: any;
  notificationPayload?: NotificationPayload;
};

/**
 * Helper function to publish response messages
 */
const publishResponse = (topic: string, payload: ResponsePayload): void => {
  if (topic) {
    publishMessage(topic, payload);
  } else {
    console.error('[MQTT]: Topic not provided for publishing response.');
  }
};

/**
 * Create new appointments for a dentist
 */
export const createAppointment = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    const payload: {
      dentistId: string;
      date: string;
      start_times: string[];
    } = JSON.parse(message.toString());
    const { dentistId, date, start_times } = payload;
    console.log('payload: ', payload)

    if (!dentistId || !date || !Array.isArray(start_times)) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentCreated',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    const newAppointments = start_times.map((time) => ({
      dentistId,
      date,
      start_time: time,
      status: 'unbooked',
    }));

    await Appointment.insertMany(newAppointments);

    const resPayload: ResponsePayload = {
      status: 201,
      message: `Successfully created ${newAppointments.length} appointment(s).`,
      notificationPayload: {
        dentistId,
        senderService: 'AppointmentService',
        message: `${start_times}`,
        typeOfNotification: 'AppointmentCreated',
      },
    };

    publishResponse(topic, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error creating appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
      notificationPayload: {
        typeOfNotification: 'AppointmentCreated',
        error: true,
      },
    };
    publishResponse(topic, resPayload);
    return resPayload;
  }
};

/**
 * Book an existing appointment
 */
export const bookAppointment = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    const payload: {
      patientId: string;
      dentistId: string;
      date: string;
      time: string;
      reason_for_visit?: string;
    } = JSON.parse(message.toString());

    const { patientId, dentistId, date, time, reason_for_visit } = payload;

    if (!patientId || !dentistId || !date || !time) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      publishMessage('appointment/booked', {
        topic: 'Failed Booking',
        message: 'Failed Booking. Try Again!',
      });
      return resPayload;
    }

    // Find the appointment by dentistId, date, and time
    const appointment = await Appointment.findOne({
      dentistId,
      date,
      start_time: time,
      status: 'unbooked',
    });

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Appointment not available for booking.',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      publishMessage('appointment/booked', {
        topic: 'Failed Booking',
        message: 'Failed Booking. Try Again!',
      });
      return resPayload;
    }

    // Update the appointment with patient details and reason for visit
    appointment.status = 'booked';
    appointment.patientId = patientId;
    appointment.reason_for_visit = reason_for_visit || '';

    const bookedAppointment = await appointment.save();

    console.log('Booked appointment herrreeeee:', bookedAppointment);

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Appointment successfully booked for ${bookedAppointment.date} at ${bookedAppointment.start_time}.`,
      notificationPayload: {
        dentistId: bookedAppointment.dentistId,
        patientId: bookedAppointment.patientId,
        senderService: 'AppointmentService',
        message: `${bookedAppointment.start_time}`,
        typeOfNotification: 'AppointmentBooked',
      },
    };

    publishResponse(topic, resPayload);
    publishMessage('appointment/booked', {
      dentistId: bookedAppointment.dentistId,
      patientId: bookedAppointment.patientId,
      date: bookedAppointment.date,
      time: bookedAppointment.start_time,
      message: `Booked for ${date} at ${time}`,
    });
    return resPayload;
  } catch (error) {
    console.error('Error booking appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
      notificationPayload: {
        typeOfNotification: 'AppointmentBooked',
        error: true,
      },
    };
    publishResponse(topic, resPayload);
    publishMessage('appointment/failed', {
      topic: 'Failed Booking',
      message: 'Failed Booking. Try Again!',
    });
    return resPayload;
  }
};

/**
 * Delete an appointment
 */
export const deleteAppointment = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    const payload: {
      appointmentId: string;
    } = JSON.parse(message.toString());
    const { appointmentId } = payload;

    if (!appointmentId) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: `Appointment with ID ${appointmentId} not found.`,
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    await Appointment.deleteOne({ _id: appointment._id });

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Appointment with ID ${appointment._id} successfully deleted.`,
      notificationPayload: {
        dentistId: appointment.dentistId,
        patientId: appointment.patientId,
        senderService: 'AppointmentService',
        message: `${appointment.start_time}`,
        typeOfNotification: 'AppointmentDeleted',
      },
    };

    publishResponse(topic, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
      notificationPayload: {
        typeOfNotification: 'AppointmentDeleted',
        error: true,
      },
    };
    publishResponse(topic, resPayload);
    return resPayload;
  }
};

/**
 * Fetch a specific appointment by ID
 */
export const getAppointment = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    const payload: {
      appointmentId: string;
    } = JSON.parse(message.toString());
    const { appointmentId } = payload;

    if (!appointmentId) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field: appointmentId.',
        notificationPayload: {
          typeOfNotification: 'GetAppointment',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: `Appointment with ID ${appointmentId} not found.`,
        notificationPayload: {
          typeOfNotification: 'GetAppointment',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Successfully fetched appointment with ID: ${appointment._id}`,
      data: appointment,
      notificationPayload: {
        dentistId: appointment.dentistId,
        patientId: appointment.patientId,
        senderService: 'AppointmentService',
        message: `${appointment.start_time}`,
        typeOfNotification: 'GetAppointment',
      },
    };

    publishResponse(topic, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
      notificationPayload: {
        typeOfNotification: 'GetAppointment',
        error: true,
      },
    };
    publishResponse(topic, resPayload);
    return resPayload;
  }
};

/**
 * Fetch all appointments
 */
export const getAppointments = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    const payload: {
      dentistId: string;
      date: string
    } = JSON.parse(message.toString());
    const { dentistId, date } = payload;
    console.log('Query ID: ', dentistId)
    const appointments = await Appointment.find({ dentistId, date });


    const resPayload: ResponsePayload = {
      status: 200,
      message: `Successfully fetched ${appointments.length} appointments.`,
      data: appointments,
    };
    console.log('Payload: ', resPayload)

    if (!appointments || appointments.length === 0) {
      resPayload.status = 404;
      resPayload.message = 'No appointments found.';
    }

    publishResponse(topic, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishResponse(topic, resPayload);
    return resPayload;
  }
};

/**
 * Cancel a booked appointment
 */

export const cancelAppointment = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    const payload: {
      appointmentId: string;
    } = JSON.parse(message.toString());
    const { appointmentId } = payload;

    if (!appointmentId) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: `Appointment with ID ${appointmentId} not found.`,
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    if (appointment.status !== 'booked') {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Appointment is not booked.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      };
      publishResponse(topic, resPayload);
      return resPayload;
    }

    appointment.status = 'unbooked';
    appointment.patientId = null;

    const cancelledAppointment = await appointment.save();

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Appointment with ID ${cancelledAppointment._id} successfully cancelled.`,
      notificationPayload: {
        dentistId: cancelledAppointment.dentistId,
        patientId: cancelledAppointment.patientId,
        senderService: 'AppointmentService',
        message: `${cancelledAppointment.start_time}`,
        typeOfNotification: 'AppointmentCancelled',
      },
    };

    publishResponse(topic, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
      notificationPayload: {
        typeOfNotification: 'AppointmentCancelled',
        error: true,
      },
    };
    publishResponse(topic, resPayload);
    return resPayload;
  }
};
