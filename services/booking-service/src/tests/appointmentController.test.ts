import {
  bookAppointment,
  createAppointment,
  deleteAppointment,
  cancelAppointment,
  getAppointment,
} from '../controllers/appointmentController';
import { Buffer } from 'buffer';
import { Appointment } from '../models/appointmentModel';

jest.mock('../models/appointmentModel.ts');
jest.mock('../mqtt/mqtt', () => ({
  publish: jest.fn((topic, message, options, callback) => {
    // Simulate successful publish
    callback(null);
  }),
  subscribe: jest.fn((topic, callback) => {
    // Simulate successful subscription
    callback(null);
  }),
  end: jest.fn((force, callback) => {
    // Simulate successful disconnection
    callback();
  }),
  connected: true,
  on: jest.fn(),
  once: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

// ## Mock variables for create appointment
const mockInvalidMessageCreateAppointment = Buffer.from(
  JSON.stringify({
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
  })
);

const mockMessageCreateAppointment = Buffer.from(
  JSON.stringify({
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
    start_times: ['08:00', '09:00', '13:00'],
  })
);

const mockSavedAppointmentCreateAppointment = {
  _id: '675dd76c3832989362cf6b2c',
  dentistId: '675dd76c3832989362ff6b2d',
  date: '2024-12-14',
  start_times: ['08:00', '09:00', '13:00'],
  status: 'unbooked',
};

// ## Mock variables for booking
const mockInvalidMessageBooking = Buffer.from(
  JSON.stringify({
    patientId: '675dd76c3832989362ff6b2a',
  })
);

const mockMessageBooking = Buffer.from(
  JSON.stringify({
    patientId: '675dd76c3832989362ff6b5d',
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
    time: '08:00',
  })
);

const mockMessageBookingDoesntExist = Buffer.from(
  JSON.stringify({
    _id: '675dd76c3841989362ff6b5d',
    patientId: '675dd76c3832989362ff6b5d',
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
    time: '08:00',
  })
);
const mockSavedAppointmentBooking = {
  _id: '675dd76c3832989362cf6b2c',
  dentistId: '675dd76c3832989362ff6b2d',
  patientId: '675dd76c3832989362ff6b5d',
  date: '2024-12-14',
  start_time: '08:00',
  status: 'booked',
  save: jest.fn().mockResolvedValue(this),
  deleteOne: jest.fn().mockResolvedValue(this),
};
const mockUnbookedAppointmentBooking = {
  _id: '675dd76c3832989362cf6b2c',
  dentistId: '675dd76c3832989362ff6b2d',
  patientId: null,
  date: '2024-12-14',
  start_time: '08:00',
  status: 'unbooked',
  save: jest.fn().mockResolvedValue({
    _id: '675dd76c3832989362cf6b2c',
    dentistId: '675dd76c3832989362ff6b2d',
    patientId: '675dd76c3832989362ff6b5d',
    date: '2024-12-14',
    start_time: '08:00',
    status: 'booked',
  }),
};
const mockMessageDeleteAppointment = Buffer.from(
  JSON.stringify({
    appointmentId: '675dd76c3832989362ff6b5d',
  })
);
const mockMessageCancelAppointment = Buffer.from(
  JSON.stringify({
    appointmentId: '675dd76c3832989362ff6b5d',
  })
);
const mockMessageGetAppointment = Buffer.from(
  JSON.stringify({
    appointmentId: '675dd76c3832989362ff6b5d',
  })
);

describe('APPOINTMENT-SERVICE CONTROLLER', () => {
  const topic = 'test/topic';
  describe('Appointment-Service: Create Appointment', () => {
    it('should return status 400 if fields are missing', async () => {
      const response = await createAppointment(
        topic,
        mockInvalidMessageCreateAppointment
      );
      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field(s).');
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentCreated',
        error: true,
      });
    });

    it('should return status 201 if the appointment is successfully created', async () => {
      jest
        .spyOn(Appointment.prototype, 'save')
        .mockResolvedValue(mockSavedAppointmentCreateAppointment);
      const response = await createAppointment(
        topic,
        mockMessageCreateAppointment
      );

      expect(response.status).toBe(201);
      expect(response.message).toMatch(
        `Successfully created ${mockSavedAppointmentCreateAppointment.start_times.length} appointment(s).`
      );
      expect(response.notificationPayload).toEqual({
        dentistId: mockSavedAppointmentCreateAppointment.dentistId,
        senderService: 'AppointmentService',
        message: `${mockSavedAppointmentCreateAppointment.start_times}`,
        typeOfNotification: 'AppointmentCreated',
      });
    });
  });

  describe('Appointment-Service: Book Appointment', () => {
    const topic = 'test/topic';
    it('should return status 400 if required fields are missing', async () => {
      const response = await bookAppointment(topic, mockInvalidMessageBooking);

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field(s).');
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentBooked',
        error: true,
      });
    });

    it('should return status 400 if the appointment is already booked', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockResolvedValue(mockSavedAppointmentBooking);

      const response = await bookAppointment(topic, mockMessageBooking);

      expect(response.status).toBe(400);
      expect(response.message).toMatch(
        'Appointment not available for booking.'
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentBooked',
        error: true,
      });
    });
  });

  describe('Appointment-Service: Delete Appointment', () => {
    it('should return status 400 if required fields are missing', async () => {
      const response = await deleteAppointment(
        topic,
        mockInvalidMessageBooking
      );

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field.');
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentDeleted',
        error: true,
      });
    });

    it('should return status 404 if appointment is not found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const appointmentId = JSON.parse(
        mockMessageDeleteAppointment.toString()
      ).appointmentId;

      const response = await deleteAppointment(
        topic,
        mockMessageDeleteAppointment
      );

      expect(response.status).toBe(404);
      expect(response.message).toMatch(
        `Appointment with ID ${appointmentId} not found.`
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentDeleted',
        error: true,
      });
    });

    it('should return status 200 if appointment is successfully deleted', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockResolvedValue(mockSavedAppointmentBooking);
      jest
        .spyOn(Appointment.prototype, 'deleteOne')
        .mockResolvedValue(mockSavedAppointmentBooking);

      const response = await deleteAppointment(
        topic,
        mockMessageDeleteAppointment
      );

      expect(response.status).toBe(200);
      expect(response.message).toMatch(
        `Appointment with ID ${mockSavedAppointmentBooking._id} successfully deleted.`
      );
      expect(response.notificationPayload).toEqual({
        dentistId: mockSavedAppointmentBooking.dentistId,
        patientId: mockSavedAppointmentBooking.patientId,
        message: `${mockSavedAppointmentBooking.start_time}`,
        senderService: 'AppointmentService',
        typeOfNotification: 'AppointmentDeleted',
      });
    });

    it('should return status 500 if there is an internal error', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockRejectedValue(mockSavedAppointmentBooking);

      const response = await deleteAppointment(
        topic,
        mockMessageDeleteAppointment
      );

      expect(response.status).toBe(500);
      expect(response.message).toMatch(
        'Internal server error, please try again later.'
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentDeleted',
        error: true,
      });
    });
  });

  describe('Appointment-Service: Cancel Appointment', () => {
    it('should return stats 400 if required fields are missing', async () => {
      const mockData = Buffer.from(
        JSON.stringify({
          patientId: null,
        })
      );

      const response = await cancelAppointment(topic, mockData);

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field.');
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentCancelled',
        error: true,
      });
    });

    it('should return status 404 if appointment could not be found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const appointmentId = JSON.parse(
        mockMessageCancelAppointment.toString()
      ).appointmentId;

      const response = await cancelAppointment(
        topic,
        mockMessageCancelAppointment
      );

      expect(response.status).toBe(404);
      expect(response.message).toMatch(
        `Appointment with ID ${appointmentId} not found.`
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentCancelled',
        error: true,
      });
    });

    it('should return status 500 if there is an internal error', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockRejectedValue(mockSavedAppointmentBooking);

      const response = await cancelAppointment(
        topic,
        mockMessageCancelAppointment
      );

      expect(response.status).toBe(500);
      expect(response.message).toMatch(
        'Internal server error, please try again later.'
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'AppointmentCancelled',
        error: true,
      });
    });
  });

  describe('Appointment-Service: Get Appointment', () => {
    it('should return status 400 if required fields are missing', async () => {
      const response = await getAppointment(topic, mockInvalidMessageBooking);

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field: appointmentId');
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'GetAppointment',
        error: true,
      });
    });

    it('should return status 404 if appointment could not be found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const appointmentId = JSON.parse(
        mockMessageGetAppointment.toString()
      ).appointmentId;

      const response = await getAppointment(topic, mockMessageGetAppointment);

      expect(response.status).toBe(404);
      expect(response.message).toMatch(
        `Appointment with ID ${appointmentId} not found.`
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'GetAppointment',
        error: true,
      });
    });

    it('should return status 200 if it can get the appointment', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockResolvedValue(mockSavedAppointmentBooking);

      const response = await getAppointment(topic, mockMessageGetAppointment);

      expect(response.status).toBe(200);
      expect(response.message).toMatch(
        `Successfully fetched appointment with ID: ${mockSavedAppointmentBooking._id}`
      );
    });

    it('should return status 500 if there is an internal error', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockRejectedValue(mockSavedAppointmentBooking);

      const response = await getAppointment(topic, mockMessageGetAppointment);

      expect(response.status).toBe(500);
      expect(response.message).toBe(
        'Internal server error, please try again later.'
      );
      expect(response.notificationPayload).toEqual({
        typeOfNotification: 'GetAppointment',
        error: true,
      });
    });
  });
});
