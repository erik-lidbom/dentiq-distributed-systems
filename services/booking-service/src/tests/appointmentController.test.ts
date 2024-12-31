import {
  createAppointment,
  bookAppointment,
  deleteAppointment,
  cancelAppointment,
  getAppointment,
  getAppointments,
} from '../controllers/appointmentController';
import { Appointment } from '../models/appointmentModel';
import { publishMessage } from '../mqtt/publish';
import mongoose from 'mongoose';

jest.mock('../models/appointmentModel');
jest.mock('../mqtt/publish');

const mockPublishMessage = jest.fn();
(publishMessage as jest.Mock).mockImplementation(mockPublishMessage);

beforeEach(() => {
  jest.clearAllMocks();
});

// Define Appointment Interface for Mock
interface AppointmentDoc extends mongoose.Document {
  patientId: string | null;
  dentistId: string;
  date: string;
  start_time: string;
  reason_for_visit?: string;
  status: 'unbooked' | 'booked' | 'cancelled';
}

// Mock Data
const mockAppointment: Partial<AppointmentDoc> = {
  _id: new mongoose.Types.ObjectId('123456789012345678901234'),
  patientId: null,
  dentistId: '54321',
  date: '2024-12-25',
  start_time: '10:00',
  status: 'unbooked',
  reason_for_visit: '',
  save: jest.fn().mockResolvedValue({
    _id: new mongoose.Types.ObjectId('123456789012345678901234'),
    patientId: '67890',
    dentistId: '54321',
    date: '2024-12-25',
    start_time: '10:00',
    status: 'booked',
    reason_for_visit: 'General checkup',
  }),
  deleteOne: jest
    .fn()
    .mockResolvedValue({ acknowledged: true, deletedCount: 1 }),
};

const mockDeleteResult = {
  acknowledged: true,
  deletedCount: 1,
};

// Payloads
const mockPayload = {
  dentistId: '54321',
  date: '2024-12-25',
  start_times: ['10:00', '11:00'],
};

const mockBookPayload = {
  dentistId: '54321',
  date: '2024-12-25',
  time: '10:00',
  patientId: '67890',
  reason_for_visit: 'General checkup',
};

// Tests
describe('Appointment Controller', () => {
  describe('createAppointment', () => {
    it('should publish 400 if required fields are missing', async () => {
      const invalidPayload = Buffer.from(
        JSON.stringify({ dentistId: '54321' })
      );
      await createAppointment('test/topic', invalidPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentCreated',
          error: true,
        },
      });
    });

    it('should create appointments and publish success', async () => {
      jest.spyOn(Appointment, 'insertMany').mockResolvedValue([
        { ...mockAppointment, start_time: '10:00' },
        { ...mockAppointment, start_time: '11:00' },
      ]);

      const validPayload = Buffer.from(JSON.stringify(mockPayload));
      await createAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 201,
        message: 'Successfully created 2 appointment(s).',
        notificationPayload: {
          dentistId: '54321',
          senderService: 'AppointmentService',
          message: '10:00,11:00',
          typeOfNotification: 'AppointmentCreated',
        },
      });
    });
  });

  describe('bookAppointment', () => {
    it('should publish 400 if required fields are missing', async () => {
      const invalidPayload = Buffer.from(
        JSON.stringify({ dentistId: '54321', date: '2024-12-25' })
      );
      await bookAppointment('test/topic', invalidPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 400,
        message: 'Missing required field(s).',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      });
    });

    it('should publish 404 if appointment not found', async () => {
      jest.spyOn(Appointment, 'findOne').mockResolvedValue(null);

      const validPayload = Buffer.from(JSON.stringify(mockBookPayload));
      await bookAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 404,
        message: 'Appointment not available for booking.',
        notificationPayload: {
          typeOfNotification: 'AppointmentBooked',
          error: true,
        },
      });
    });

    it('should book appointment and publish success', async () => {
      jest.spyOn(Appointment, 'findOne').mockResolvedValue(mockAppointment);

      const validPayload = Buffer.from(JSON.stringify(mockBookPayload));
      await bookAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 200,
        message: 'Appointment successfully booked for 2024-12-25 at 10:00.',
        notificationPayload: {
          dentistId: '54321',
          patientId: '67890',
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'AppointmentBooked',
        },
      });
    });
  });

  describe('deleteAppointment', () => {
    it('should publish 400 if appointmentId is missing', async () => {
      const invalidPayload = Buffer.from(JSON.stringify({}));

      await deleteAppointment('test/topic', invalidPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      });
    });

    it('should publish 404 if appointment is not found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);

      const validPayload = Buffer.from(
        JSON.stringify({ appointmentId: 'invalidId' })
      );
      await deleteAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 404,
        message: 'Appointment with ID invalidId not found.',
        notificationPayload: {
          typeOfNotification: 'AppointmentDeleted',
          error: true,
        },
      });
    });

    it('should delete the appointment and publish success', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(mockAppointment);
      jest.spyOn(Appointment, 'deleteOne').mockResolvedValue(mockDeleteResult);

      const validPayload = Buffer.from(
        JSON.stringify({ appointmentId: mockAppointment._id!.toString() })
      );
      await deleteAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 200,
        message: `Appointment with ID ${mockAppointment._id} successfully deleted.`,
        notificationPayload: {
          dentistId: '54321',
          patientId: null,
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'AppointmentDeleted',
        },
      });
    });
  });

  describe('getAppointments', () => {
    it('should fetch all appointments and publish success', async () => {
      jest.spyOn(Appointment, 'find').mockResolvedValue([mockAppointment]);

      await getAppointments('test/topic');

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 200,
        message: 'Successfully fetched 1 appointments.',
        data: [mockAppointment],
      });
    });

    it('should publish 404 if no appointments are found', async () => {
      jest.spyOn(Appointment, 'find').mockResolvedValue([]);

      await getAppointments('test/topic');

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 404,
        message: 'No appointments found.',
      });
    });
  });

  describe('cancelAppointment', () => {
    it('should publish 400 if required fields are missing', async () => {
      const invalidPayload = Buffer.from(JSON.stringify({}));
      await cancelAppointment('test/topic', invalidPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 400,
        message: 'Missing required field.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      });
    });

    it('should publish 404 if appointment not found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);

      const validPayload = Buffer.from(
        JSON.stringify({ appointmentId: 'invalidId' })
      );
      await cancelAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 404,
        message: 'Appointment with ID invalidId not found.',
        notificationPayload: {
          typeOfNotification: 'AppointmentCancelled',
          error: true,
        },
      });
    });

    it('should cancel a booked appointment and publish success', async () => {
      jest
        .spyOn(Appointment, 'findById')
        .mockResolvedValue({ ...mockAppointment, status: 'booked' });

      const validPayload = Buffer.from(
        JSON.stringify({ appointmentId: mockAppointment._id.toString() })
      );
      await cancelAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 200,
        message: `Appointment with ID ${mockAppointment._id} successfully cancelled.`,
        notificationPayload: {
          dentistId: '54321',
          patientId: null,
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'AppointmentCancelled',
        },
      });
    });
  });

  describe('getAppointment', () => {
    it('should publish 400 if appointmentId is missing', async () => {
      const invalidPayload = Buffer.from(JSON.stringify({}));
      await getAppointment('test/topic', invalidPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 400,
        message: 'Missing required field: appointmentId.',
        notificationPayload: {
          typeOfNotification: 'GetAppointment',
          error: true,
        },
      });
    });

    it('should publish 404 if appointment not found', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(null);

      const validPayload = Buffer.from(
        JSON.stringify({ appointmentId: 'invalidId' })
      );
      await getAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 404,
        message: 'Appointment with ID invalidId not found.',
        notificationPayload: {
          typeOfNotification: 'GetAppointment',
          error: true,
        },
      });
    });

    it('should fetch an appointment and publish success', async () => {
      jest.spyOn(Appointment, 'findById').mockResolvedValue(mockAppointment);

      const validPayload = Buffer.from(
        JSON.stringify({ appointmentId: mockAppointment._id.toString() })
      );
      await getAppointment('test/topic', validPayload);

      expect(mockPublishMessage).toHaveBeenCalledWith('test/topic', {
        status: 200,
        message: `Successfully fetched appointment with ID: ${mockAppointment._id}`,
        data: mockAppointment,
        notificationPayload: {
          dentistId: '54321',
          patientId: null,
          senderService: 'AppointmentService',
          message: '10:00',
          typeOfNotification: 'GetAppointment',
        },
      });
    });
  });
});
