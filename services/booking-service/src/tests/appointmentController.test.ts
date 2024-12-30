import {
  createAppointment,
  bookAppointment,
  deleteAppointment, // TODO: Implement test for function
  cancelAppointment,
  getAppointment,
  getAppointments, // TODO: Implement test for this function
} from '../controllers/appointmentController';
import { Appointment } from '../models/appointmentModel';
import { publishMessage } from '../mqtt/publish';

jest.mock('../models/appointmentModel');
jest.mock('../mqtt/publish');

const mockPublishMessage = jest.fn();
(publishMessage as jest.Mock).mockImplementation(mockPublishMessage);

beforeEach(() => {
  jest.clearAllMocks();
});

// Mock data
const mockTopic = 'test/topic';
const mockCreateAppointmentPayload = {
  dentistId: '12345',
  date: '2024-12-25',
  start_times: ['10:00', '11:00'],
};

const mockBookAppointmentPayload = {
  patientId: '54321',
  appointmentId: '12345',
};

const mockCancelAppointmentPayload = {
  appointmentId: '12345',
};

const mockGetAppointmentPayload = {
  appointmentId: '12345',
};

const mockAppointment = {
  _id: '12345',
  dentistId: '12345',
  patientId: '54321',
  date: '2024-12-25',
  start_time: '10:00',
  status: 'booked',
  save: jest.fn().mockResolvedValue(true),
};

const mockUnbookedAppointment = {
  _id: '12345',
  dentistId: '12345',
  patientId: null,
  date: '2024-12-25',
  start_time: '10:00',
  status: 'unbooked',
  save: jest.fn().mockResolvedValue({
    _id: '12345',
    dentistId: '12345',
    patientId: '54321',
    date: '2024-12-25',
    start_time: '10:00',
    status: 'booked',
  }),
};

// Tests
describe('Appointment Service Controller', () => {
  describe('createAppointment', () => {
    it('should publish 400 if required fields are missing', async () => {
      const invalidMessage = Buffer.from(
        JSON.stringify({ dentistId: '12345' })
      );
      await createAppointment(mockTopic, invalidMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentCreated',
          error: true,
        },
      });
    });

    it('should publish 201 when appointments are created', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockCreateAppointmentPayload)
      );
      jest
        .spyOn(Appointment, 'insertMany')
        .mockResolvedValue([mockAppointment as any]);

      await createAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 201,
        message: 'Successfully created 2 appointment(s).',
        notificationPayload: {
          dentistId: '12345',
          senderService: 'AppointmentService',
          message: '10:00,11:00',
          typeOfNotification: 'AppointmentCreated',
        },
      });
    });

    it('should publish 500 if an error occurs', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockCreateAppointmentPayload)
      );
      jest
        .spyOn(Appointment, 'insertMany')
        .mockRejectedValue(new Error('Database error'));

      await createAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 500,
        message: 'Internal server error, please try again later.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCreated',
          error: true,
        },
      });
    });
  });

  describe('bookAppointment', () => {
    it('should publish 400 if required fields are missing', async () => {
      const invalidMessage = Buffer.from(
        JSON.stringify({ patientId: '54321' })
      );
      await bookAppointment(mockTopic, invalidMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      });
    });

    it('should publish 404 if appointment is not found', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockBookAppointmentPayload)
      );
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);

      await bookAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 404,
        message: 'Appointment not found.',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      });
    });

    it('should publish 200 when appointment is successfully booked', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockBookAppointmentPayload)
      );
      jest
        .spyOn(Appointment, 'findById')
        .mockResolvedValue(mockUnbookedAppointment);

      await bookAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 200,
        message: `Appointment successfully booked with ID: 12345`,
        notificationPayload: {
          dentistId: '12345',
          patientId: '54321',
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'AppointmentBooked',
        },
      });
    });

    it('should publish 500 if an error occurs', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockBookAppointmentPayload)
      );
      jest
        .spyOn(Appointment, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await bookAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 500,
        message: 'Internal server error, please try again later.',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      });
    });
  });

  describe('cancelAppointment', () => {
    it('should publish 400 if appointmentId is missing', async () => {
      const invalidMessage = Buffer.from(JSON.stringify({}));
      await cancelAppointment(mockTopic, invalidMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      });
    });

    it('should publish 200 when appointment is successfully cancelled', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockCancelAppointmentPayload)
      );
      jest.spyOn(Appointment, 'findById').mockResolvedValue(mockAppointment);

      await cancelAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 200,
        message: 'Appointment with ID 12345 successfully cancelled.',
        notificationPayload: {
          dentistId: '12345',
          patientId: null,
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'AppointmentCancelled',
        },
      });
    });

    it('should publish 500 if an error occurs', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockCancelAppointmentPayload)
      );
      jest
        .spyOn(Appointment, 'findById')
        .mockRejectedValue(new Error('Database error'));

      await cancelAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 500,
        message: 'Internal server error, please try again later.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      });
    });
  });

  describe('getAppointment', () => {
    it('should publish 200 when appointment is successfully retrieved', async () => {
      const validMessage = Buffer.from(
        JSON.stringify(mockGetAppointmentPayload)
      );
      jest.spyOn(Appointment, 'findById').mockResolvedValue(mockAppointment);

      await getAppointment(mockTopic, validMessage);

      expect(mockPublishMessage).toHaveBeenCalledWith(mockTopic, {
        status: 200,
        message: 'Successfully fetched appointment with ID: 12345',
        notificationPayload: {
          dentistId: '12345',
          patientId: '54321',
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'GetAppointment',
        },
      });
    });
  });
});
