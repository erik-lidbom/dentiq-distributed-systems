import { client } from './mqtt';
import { TOPICS } from './topics';

// Subscribes to all topics
export const subscribeTopics = async (userId: string): Promise<void> => {
  const subscriptionTopics = [
    TOPICS.SUBSCRIBE.NOTIFICATION_ADDED_SLOT,
    `${TOPICS.SUBSCRIBE.NOTIFICATION_BOOKED_SLOT}/${userId}`,
    `${TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_PATIENT_SLOT}/${userId}`,
    TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_DENTIST_SLOT,
    TOPICS.SUBSCRIBE.NOTIFICATION_REMOVED,
  ];

  if (!client) {
    console.error('[MQTT]: Client is not initialized');
    return;
  }

  try {
    subscriptionTopics.map((topic: string) => {
      client?.subscribe(topic, (err) => {
        if (err) {
          console.error(`[MQTT]: Failed to subscribe to ${topic}`, err);
        } else {
          console.log(`[MQTT]: Successfully subscribed to ${topic}`);
        }
      });
    });
  } catch (error) {
    console.error('[MQTT]: Error in subscribeTopics:', error);
    throw error;
  }
};
