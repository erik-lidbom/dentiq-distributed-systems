import mongoose, { Document } from "mongoose";

export interface Notification {
  email?: string;
  message: string;
  senderService: string;
  patientId?: string;
  dentistId?: string;
}

export interface NotificationDocument extends Document {
  email?: string;
  message: string;
  senderService: string;
  patientId?: string;
  dentistId?: string;
  createdAt: Date;
  updatedAt: Date;
}
/**
 * Mongoose schema for notifications. Every field is required except for patientId and * dentistId.
 * patientId and dentistId always needs to be provided whenever we shall notify a specific dentist or patient
 * Also added timestamp to ensure that we can sort the notification logs.
 */

const notificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "message is required"],
    },
    senderService: {
      type: String,
      required: [true, "senderService is required"],
    },
    patientId: {
      type: String,
      required: false,
    },
    dentistId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema
);

export default Notification;
