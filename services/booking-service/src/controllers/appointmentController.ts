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
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */
  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      dentistId: string;
      date: string;
      start_times: string[];
    };
    correlationId: string;
  } = message;

  try {
    const { dentistId, date, start_times } = JSON.parse(data.toString());

    if (!dentistId || !date || !Array.isArray(start_times)) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentCreated',
          error: true,
        },
      };
      publishResponse(`${topic}/${correlationId}`, resPayload);
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

    publishResponse(`${topic}/${correlationId}`, resPayload);
    if (newAppointments.length > 0) {
      publishMessage('appointment/added', {
        topic: 'appointment/added',
        message: `New Available Slot`,
      });
    }
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
    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  }
};

/**
 * Book an existing appointment
 */

export const bookAppointment = async (
  topic: string,
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */

  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      patientId: string;
      dentistId: string;
      date: string;
      time: string;
      reason_for_visit?: string;
    };
    correlationId: string;
  } = message;

  try {
    const { patientId, dentistId, date, time, reason_for_visit } = JSON.parse(
      data.toString()
    );

    if (!patientId || !dentistId || !date || !time) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      };
      publishResponse(`${topic}/${correlationId}`, resPayload);
      publishMessage('appointment/failed', {
        topic: 'appointment/failed',
        message: 'Booking Cancellation Failed!',
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
      publishResponse(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    // Update the appointment with patient details and reason for visit
    appointment.status = 'booked';
    appointment.patientId = patientId;
    appointment.reason_for_visit = reason_for_visit || '';

    const bookedAppointment = await appointment.save();

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

    publishResponse(`${topic}/${correlationId}`, resPayload);
    publishMessage('appointment/booked', {
      topic: 'appointment/booked',
      message: `${date} at ${time} has been booked`,
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
    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  }
};

/**
 * Delete multiple appointments
 */

export const deleteAppointments = async (
  topic: string,
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */
  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      appointmentIds: string[];
    };
    correlationId: string;
  } = message;
  try {
    const { appointmentIds } = JSON.parse(data.toString());

    // Validate the input
    if (
      !Array.isArray(appointmentIds) ||
      appointmentIds.some((id) => typeof id !== 'string')
    ) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Invalid or missing appointment IDs.',
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      };
      console.warn(`[WARN]: Invalid delete payload - ${JSON.stringify(data)}`);
      publishResponse(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    // Find appointments matching the IDs
    const appointments = await Appointment.find({
      _id: { $in: appointmentIds },
    });

    if (appointments.length === 0) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: 'No appointments found for the provided IDs.',
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      };
      console.warn(
        `[WARN]: No matching appointments found for deletion - ${appointmentIds}`
      );
      publishResponse(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    // Delete the appointments
    await Appointment.deleteMany({ _id: { $in: appointmentIds } });

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Successfully deleted ${appointments.length} appointment(s).`,
      notificationPayload: {
        senderService: 'AppointmentService',
        message: `Deleted appointments for dentist(s) ${[
          ...new Set(appointments.map((a) => a.dentistId)),
        ]}`,
        typeOfNotification: 'AppointmentDeleted',
      },
    };

    publishResponse(`${topic}/${correlationId}`, resPayload);
    publishMessage('appointment/removed', {
      topic: 'appointment/removed',
      message: `Slots with IDs ${appointmentIds.join(', ')} have been deleted.`,
    });

    return resPayload;
  } catch (error) {
    console.error('[ERROR]: Failed to delete appointments:', error);

    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
      notificationPayload: {
        typeOfNotification: 'AppointmentDeleted',
        error: true,
      },
    };

    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  }
};

/**
 * Delete an appointment
 */
export const deleteAppointment = async (
  topic: string,
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */
  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      appointmentId: string;
    };
    correlationId: string;
  } = message;

  try {
    const { appointmentId } = JSON.parse(data.toString());

    if (!appointmentId) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      };
      publishResponse(`${topic}/${correlationId}`, resPayload);
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
      publishResponse(`${topic}/${correlationId}`, resPayload);
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

    publishResponse(`${topic}/${correlationId}`, resPayload);
    publishMessage('appointment/removed', {
      topic: 'appointment/removed',
      message: `A slot has been deleted`,
    });
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
    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  }
};

/**
 * Fetch a specific appointment by ID
 */
export const getAppointment = async (
  topic: string,
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */
  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      appointmentId: string;
    };
    correlationId: string;
  } = message;
  try {
    const { appointmentId } = JSON.parse(data.toString());

    if (!appointmentId) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field: appointmentId.',
        notificationPayload: {
          typeOfNotification: 'GetAppointment',
          error: true,
        },
      };
      publishResponse(`${topic}/${correlationId}`, resPayload);
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
      publishResponse(`${topic}/${correlationId}`, resPayload);
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

    publishResponse(`${topic}/${correlationId}`, resPayload);
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
    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  }
};

/**
 * Fetch all appointments
 */
export const getAppointments = async (
  topic: string,
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */
  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      dentistId?: string;
      patientId?: string;
    };
    correlationId: string;
  } = message;
  try {
    let appointments;
    if (message.payload) {
      const { dentistId, patientId } = JSON.parse(data.toString());

      if (dentistId) {
        appointments = await Appointment.find({ dentistId: dentistId });
        console.log(appointments.length);
      } else if (patientId) {
        appointments = await Appointment.find({ patientId: patientId });
      } else {
        appointments = await Appointment.find();
      }
    } else {
      appointments = await Appointment.find();
    }

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Successfully fetched ${appointments.length} appointments.`,
      data: appointments,
    };

    if (!appointments || appointments.length === 0) {
      resPayload.status = 404;
      resPayload.message = 'No appointments found.';
    }

    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishResponse(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  }
};

/**
 * Cancel a booked appointment
 */

export const cancelAppointment = async (
  topic: string,
  message: any
): Promise<ResponsePayload> => {
  /**
   * Destructure payload and correlationId
   * Specified type for the payload
   */
  const {
    payload: data,
    correlationId,
  }: {
    payload: {
      appointmentId: string;
    };
    correlationId: string;
  } = message;
  try {
    const { appointmentId } = JSON.parse(data.toString());

    if (!appointmentId) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      };
      publishResponse(`${topic}/${correlationId}`, resPayload);
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
      publishResponse(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    if (appointment.status !== 'booked' && appointment.patientId === null) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Appointment is not booked.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      };
      publishResponse(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    appointment.status = 'unbooked';
    appointment.patientId = null;
    appointment.reason_for_visit = '';

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

    publishResponse(`${topic}/${correlationId}`, resPayload);
    publishMessage('appointment/cancelled', {
      topic: 'appointment/cancelled',
      message: `New Available Slot`,
    });
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
    publishResponse(`${topic}/${correlationId}`, resPayload);
    publishMessage('appointment/failed', {
      topic: 'appointment/failed',
      message: `Booking Cancellation Failed!`,
    });
    return resPayload;
  }
};
