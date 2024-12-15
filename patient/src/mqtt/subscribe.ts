import { client } from './mqtt';
import { TOPICS } from './topics';

export const subscribeTopics = async (): Promise<void> => {
  if (!client) {
    console.error('[MQTT]: Client is not initialized');
    return;
  }

  try {
    client.subscribe(TOPICS.SUBSCRIBE.NOTIFICATION_CREATED, (err) => {
      if (err) {
        console.error('[MQTT]: Subscription error:', err);
        throw err;
      } else {
        console.log(
          `[MQTT]: Subscribed to ${TOPICS.SUBSCRIBE.NOTIFICATION_CREATED}`
        );
      }
    });
    client.subscribe(TOPICS.SUBSCRIBE.NOTIFICATION_ADDED_SLOT, (err) => {
      if (err) {
        console.error('[MQTT]: Subscription error:', err);
        throw err;
      } else {
        console.log(
          `[MQTT]: Subscribed to ${TOPICS.SUBSCRIBE.NOTIFICATION_ADDED_SLOT}`
        );
      }
    });
    client.subscribe(TOPICS.SUBSCRIBE.NOTIFICATION_BOOKED_SLOT, (err) => {
      if (err) {
        console.error('[MQTT]: Subscription error:', err);
        throw err;
      } else {
        console.log(
          `[MQTT]: Subscribed to ${TOPICS.SUBSCRIBE.NOTIFICATION_BOOKED_SLOT}`
        );
      }
    });
    client.subscribe(TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_SLOT, (err) => {
      if (err) {
        console.error('[MQTT]: Subscription error:', err);
        throw err;
      } else {
        console.log(
          `[MQTT]: Subscribed to ${TOPICS.SUBSCRIBE.NOTIFICATION_CANCELLED_SLOT}`
        );
      }
    });
  } catch (error) {
    console.error('[MQTT]: Error in subscribeTopics:', error);
    throw error;
  }
};
