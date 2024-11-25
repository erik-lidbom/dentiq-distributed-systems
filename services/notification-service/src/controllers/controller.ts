import { Request, Response } from "express";
import Notification, { NotificationDocument } from "../models/model";
import { publistMqtt } from "../mqtt/mqtt";

/**
 * This file contains all the necessary methods for a notification service
 * createNotification creates a new notification into the database. If the write is successfull, the function will publish the * * * notification to the receiverID
 * TODO --> Currently the message is only publishing to the MQTT if the write to the database is successfull. Shall we follow that * structure or should we publish a message no matter what
 */
export const createNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notification = new Notification(req.body);
    const savedNotification: NotificationDocument = await notification.save();

    // Refining message to make sure to not leak any sensitive information
    const { email, message, senderService, receiverClient, receiverId } =
      savedNotification;
    const payload = JSON.stringify({
      email: email,
      message: message,
      senderService: senderService,
    });

    // Every topic follows this structure: `receiverClient/receiverId` --> Eg. `patientClient/userId`
    await publistMqtt(`${receiverClient}/${receiverId}`, payload);

    res.status(201).json({
      message: "Notification created successfully!",
      notification: savedNotification,
    });
  } catch (error: unknown) {
    console.error("Error creating notification:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getPatientNotifications = async (req: Request, res: Response) => {
  try {
  } catch (error) {}
};
