import { NotificationDocument } from "../models/model";
import { client } from "./mqtt";

/*
 * Publishes all the messages parallel. The method retrieves the message and timestamp *field that will be sent to the client
 */
export const publishToAllTopics = async (
  topics: string[],
  notificationDocument: NotificationDocument
): Promise<void> => {
  try {
    const { message, createdAt } = notificationDocument;
    //Extract the appropiated message that should be messaged out
    const messageStringified = JSON.stringify({ message, createdAt });
    await Promise.all(
      topics.map((topic: string) =>
        publishNotification(topic, messageStringified)
      )
    );
  } catch (error) {
    console.log(error);
  }
};

// Method to publish a notification
const publishNotification = async (
  topic: string,
  message: any
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!client.connected) {
      console.log("MQTT client not connected.");
      client.reconnect();
      return reject(new Error("MQTT client not connected"));
    }
    client.publish(topic, message, { qos: 2 }, (error) => {
      if (error) {
        console.error("MQTT Publish error:", error);
        return reject(error);
      }
      console.log(`MQTT message published to ${topic}`);
      return resolve();
    });
  });
};
