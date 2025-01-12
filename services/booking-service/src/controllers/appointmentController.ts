import { Appointment } from '../models/appointmentModel';
import { publishMessage } from '../mqtt/publish';
import { TOPICS } from '../mqtt/topics';

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
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
        message: `New Available Slots: ${start_times}`,
      },
    };

    // Response back to Gateway
    publishMessage(`${topic}/${correlationId}`, resPayload);

    // Message sent to notification service
    const { notificationPayload } = resPayload;
    publishMessage(
      `${TOPICS.PUBLISH.CREATE_NOTIFICATION_RESPONSE}`,
      notificationPayload
    );

    return resPayload;
  } catch (error) {
    console.error('Error creating appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
        message: `Slot at ${date}, ${time} has been booked`,
      },
    };

    const { notificationPayload } = resPayload;
    publishMessage(`${topic}/${correlationId}`, resPayload);
    publishMessage(
      TOPICS.PUBLISH.BOOK_NOTIFICATION_RESPONSE,
      notificationPayload
    );
    return resPayload;
  } catch (error) {
    console.error('Error booking appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      console.warn(`[WARN]: Invalid delete payload - ${JSON.stringify(data)}`);
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      console.warn(
        `[WARN]: No matching appointments found for deletion - ${appointmentIds}`
      );
      publishMessage(`${topic}/${correlationId}`, resPayload);
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

    publishMessage(`${topic}/${correlationId}`, resPayload);
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
    };

    publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: `Appointment with ID ${appointmentId} not found.`,
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
      },
    };

    const { notificationPayload } = resPayload;
    publishMessage(`${topic}/${correlationId}`, resPayload);
    publishMessage(
      TOPICS.PUBLISH.CANCEL_NOTIFICATION_DENTIST_RESPONSE,
      notificationPayload
    );
    return resPayload;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: `Appointment with ID ${appointmentId} not found.`,
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
      },
    };

    publishMessage(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error fetching appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishMessage(`${topic}/${correlationId}`, resPayload);
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
    console.log('DATA');
    console.log(data);
    if (message.payload) {
      const { dentistId, patientId } = JSON.parse(data.toString());

      if (dentistId) {
        appointments = await Appointment.find({ dentistId: dentistId });
        console.log('hej');
      } else if (patientId) {
        appointments = await Appointment.find({ patientId: patientId });
        console.log('jao');
      } else {
        appointments = await Appointment.find();
        console.log('lol');
        console.log(appointments);
      }
    } else {
      appointments = await Appointment.find();
      console.log('wtf');
    }

    const resPayload: ResponsePayload = {
      status: 200,
      message: `Successfully fetched ${appointments.length} appointments.`,
      data: appointments,
    };
    console.log('RESPAYLOAD');
    console.log(resPayload);

    if (!appointments || appointments.length === 0) {
      resPayload.status = 404;
      resPayload.message = 'No appointments found.';
    }

    console.log('HAAAALÅåå');
    console.log(topic);
    console.log(correlationId);
    publishMessage(`${topic}/${correlationId}`, resPayload);
    return resPayload;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishMessage(`${topic}/${correlationId}`, resPayload);
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
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      const resPayload: ResponsePayload = {
        status: 404,
        message: `Appointment with ID ${appointmentId} not found.`,
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
      return resPayload;
    }

    if (appointment.status !== 'booked' && appointment.patientId === null) {
      const resPayload: ResponsePayload = {
        status: 400,
        message: 'Appointment is not booked.',
      };
      publishMessage(`${topic}/${correlationId}`, resPayload);
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
        message: `Booking at ${cancelledAppointment.date},${cancelledAppointment.start_time} was cancelled`,
      },
    };

    const { notificationPayload } = resPayload;
    publishMessage(`${topic}/${correlationId}`, resPayload);
    //TODO --> PATIENT ID FOR DYNAMIC NOTIFICATIOSN
    publishMessage(
      TOPICS.PUBLISH.CANCEL_NOTIFICATION_DENTIST_RESPONSE,
      notificationPayload
    );
    return resPayload;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    const resPayload: ResponsePayload = {
      status: 500,
      message: 'Internal server error, please try again later.',
    };
    publishMessage(`${topic}/${correlationId}`, resPayload);
    publishMessage('appointment/failed', {
      topic: 'appointment/failed',
      message: `Booking Cancellation Failed!`,
    });
    return resPayload;
  }
};
