import mongoose, { Document } from "mongoose";

export interface Notification {
  email: string;
  message: string;
  senderId: string;
  receiverId: string;
  senderService: string;
  receiverClient: "patientClient" | "dentistClient";
}

export type NotificationDocument = Notification & Document;
/**
 * Mongoose schema for notifications. Every field is required, which means that the request body must contain these fields.
 * Also added timestamp to ensure that we can sort the notification logs.
 */

const notificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "message is required"],
    },
    senderId: {
      type: String,
      required: [true, "senderId is required"],
    },
    receiverId: {
      type: String,
      required: [true, "receiverId is required"],
    },
    senderService: {
      type: String,
      required: [true, "senderService is required"],
    },
    receiverClient: {
      type: String,
      enum: ["patientClient", "dentistClient"],
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema
);

export default Notification;
