import mongoose, { Model, Schema } from 'mongoose';

export type IAppointment = {
  patientId: string | null;
  dentistId: string;
  start_time: number;
  end_time: number;
  status: 'unbooked' | 'booked' | 'cancelled';
};

export const appointmentSchema = new Schema<IAppointment>({
  patientId: { type: String, required: false, default: null },
  dentistId: { type: String, required: true },
  start_time: { type: Number, required: true },
  end_time: { type: Number, required: true },
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
