import { Request, Response } from 'express';
import Notification, { NotificationDocument } from '../models/model';

/**
 * This file contains all the necessary methods for a notification service
 */

/*
 * httpCreateNotification write a new notification into the database.
 * Works as a HTTP wrapper in case we would need to use normal REST requests for  *creating notifications.
 */
export const httpCreateNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await createNotification(req.body);
    res.status(201).json({
      message: 'Notification created successfully!',
    });
  } catch (error: unknown) {
    console.error('Error creating notification:', error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

/**
 * Creates a notification and write it to the database
 * @returns a promise of a Notification Document
 */
export const createNotification = async (
  data: any
): Promise<NotificationDocument> => {
  try {
    const notification = new Notification(data);
    const savedNotification: NotificationDocument = await notification.save();
    return savedNotification;
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async (data: any) => {
  try {
    const { correlationId, payload } = data;

    const { userId, role } = JSON.parse(payload);

    const notifications =
      role === 'dentist'
        ? await Notification.find({ dentistId: userId })
        : await Notification.find({
            $or: [{ patientId: { $exists: false } }, { patientId: userId }],
          });

    return { notifications: notifications, correlationId };
  } catch (error) {}
};
