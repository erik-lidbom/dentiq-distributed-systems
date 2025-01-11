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
  data: Buffer
): Promise<NotificationDocument> => {
  try {
    const payload = Buffer.isBuffer(data) ? JSON.parse(data.toString()) : data;
    const notification = new Notification(payload);
    const savedNotification: NotificationDocument = await notification.save();
    return savedNotification;
  } catch (error) {
    throw error;
  }
};

export const getNotifications = async (data: any) => {
  try {
    const payload = Buffer.isBuffer(data) ? JSON.parse(data.toString()) : data;

    const { userId } = payload;
    // TODO --> Retrieve role to decide whether it should retrieve dentist or patient notifications
    const notifications = await Notification.find({
      patientId: userId,
    });

    return notifications;
  } catch (error) {}
};
