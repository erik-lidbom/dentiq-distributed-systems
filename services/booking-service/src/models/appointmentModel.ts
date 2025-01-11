import mongoose, { Model, Schema } from 'mongoose';

export interface IAppointment {
  patientId: string | null;
  dentistId: string;
  date: string;
  start_time: string;
  reason_for_visit?: string;
  status: 'unbooked' | 'booked' | 'cancelled';
}

export const appointmentSchema = new Schema<IAppointment>({
  patientId: { type: String, required: false, default: null },
  dentistId: { type: String, required: true },
  date: {type: String, required: true},
  start_time: { type: String, required: true },
  reason_for_visit: { type: String, required: false },
  status: {
    type: String,
    enum: ['unbooked', 'booked', 'cancelled'],
    default: 'unbooked',
    required: true,
  },
});

export const Appointment: Model<IAppointment> = mongoose.model<IAppointment>(
  'Appointment',
  appointmentSchema
);
