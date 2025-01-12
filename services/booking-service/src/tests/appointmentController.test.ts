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
const mockInvalidMessageCreateAppointment = {
  payload: JSON.stringify({
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
  }),
  correlationId: '57f1a44f-a4e0-4442-a651-d48cb53ab715',
};

const mockMessageCreateAppointment = {
  payload: JSON.stringify({
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
    start_times: ['08:00', '09:00', '13:00'],
  }),
  correlationId: '57f1a44f-a4e0-4442-a651-d48cb53ab245',
};

const mockSavedAppointmentCreateAppointment = {
  _id: '675dd76c3832989362cf6b2c',
  dentistId: '675dd76c3832989362ff6b2d',
  date: '2024-12-14',
  start_times: ['08:00', '09:00', '13:00'],
  status: 'unbooked',
};

// ## Mock variables for booking
const mockInvalidMessageBooking = {
  payload: JSON.stringify({
    patientId: '675dd76c3832989362ff6b2a',
  }),
  correlationId: '57f1a44f-a4e0-4442-a651-d48cb53ab765',
};

const mockMessageBooking = {
  payload: JSON.stringify({
    patientId: '675dd76c3832989362ff6b5d',
    dentistId: '675dd76c3832989362ff6b2d',
    date: '2024-12-14',
    time: '08:00',
  }),
  correlationId: '57f1a44f-3214-4442-a651-d48cb53ab765',
};

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

const mockMessageDeleteAppointment = {
  payload: JSON.stringify({
    appointmentId: '675dd76c3832989362ff6b5d',
  }),
  correlationId: '4611a44f-3214-4442-a651-d48cb53ab765',
};

const mockMessageCancelAppointment = {
  payload: JSON.stringify({
    appointmentId: '675dd76c3832989362ff6b5d',
  }),
  correlationId: '57f1a44f-3214-4332-a651-d48cb53ab765',
};

const mockMessageGetAppointment = {
  payload: JSON.stringify({
    appointmentId: '675dd76c3832989362ff6b5d',
  }),
  correlationId: '57f1a44f-3214-4332-a651-d48c443ab765',
};

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
    });
  });

  describe('Appointment-Service: Book Appointment', () => {
    const topic = 'test/topic';
    it('should return status 400 if required fields are missing', async () => {
      const response = await bookAppointment(topic, mockInvalidMessageBooking);

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field(s).');
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
    });

    it('should return status 404 if appointment is not found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const { payload } = mockMessageDeleteAppointment;
      const { appointmentId } = JSON.parse(payload.toString());

      const response = await deleteAppointment(
        topic,
        mockMessageDeleteAppointment
      );

      expect(response.status).toBe(404);
      expect(response.message).toMatch(
        `Appointment with ID ${appointmentId} not found.`
      );
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
    });
  });

  describe('Appointment-Service: Cancel Appointment', () => {
    it('should return stats 400 if required fields are missing', async () => {
      const mockData = {
        payload: JSON.stringify({
          patientId: null,
        }),
        correlationId: '4611a44f-3214-4442-a651-d48cb53ab765',
      };

      const response = await cancelAppointment(topic, mockData);

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field.');
    });

    it('should return status 404 if appointment could not be found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const { payload } = mockMessageCancelAppointment;
      const { appointmentId } = JSON.parse(payload.toString());
      const response = await cancelAppointment(
        topic,
        mockMessageCancelAppointment
      );

      expect(response.status).toBe(404);
      expect(response.message).toMatch(
        `Appointment with ID ${appointmentId} not found.`
      );
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
    });
  });

  describe('Appointment-Service: Get Appointment', () => {
    it('should return status 400 if required fields are missing', async () => {
      const response = await getAppointment(topic, mockInvalidMessageBooking);

      expect(response.status).toBe(400);
      expect(response.message).toMatch('Missing required field: appointmentId');
    });

    it('should return status 404 if appointment could not be found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);
      const { payload } = mockMessageGetAppointment;
      const { appointmentId } = JSON.parse(payload.toString());
      const response = await getAppointment(topic, mockMessageGetAppointment);

      expect(response.status).toBe(404);
      expect(response.message).toMatch(
        `Appointment with ID ${appointmentId} not found.`
      );
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
    });
  });
});
