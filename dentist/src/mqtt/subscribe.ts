import { client } from './mqtt';
import { TOPICS } from './topics';

// Subscribe to topics

export const subscribeTopics = async (userId: string) => {
  const subscriptionTopics = [
    `${TOPICS.SUBSCRIBE.NOTIFICATION_ADDED_SLOT}/${userId}`,
    `${TOPICS.SUBSCRIBE.NOTIFICATION_BOOKED_SLOT}/${userId}`,
    `${TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_SLOT_DENTIST}/${userId}`,
    `${TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_SLOT_PATIENT}/${userId}`,
    TOPICS.SUBSCRIBE.NOTIFICATION_REMOVED,
  ];

  subscriptionTopics.map((topic: string) => {
    client?.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.log(
          '[MQTT]: Subscribed to topics:',
          subscriptionTopics.join(', ')
        );
      }
    });
  });
};
