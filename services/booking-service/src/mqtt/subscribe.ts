import { mqttClient } from './mqtt';
import { TOPICS } from './topics';

// Subscribe to topics
const subscriptionTopics = [
  TOPICS.SUBSCRIBE.CREATE,
  TOPICS.SUBSCRIBE.GET,
  TOPICS.SUBSCRIBE.UPDATE,
  TOPICS.SUBSCRIBE.DELETE,
  TOPICS.SUBSCRIBE.DELETE_MANY,
  TOPICS.SUBSCRIBE.QUERY,
  TOPICS.SUBSCRIBE.BOOK,
  TOPICS.SUBSCRIBE.CANCEL,
];

export const subscribeTopics = async () => {
  subscriptionTopics.map((topic: string) => {
    mqttClient?.subscribe(topic, { qos: 2 }, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
        return;
      } else {
        console.log(
          '[MQTT]: Subscribed to topics:',
          subscriptionTopics.join(', ')
        );
      }
    });
  });
};
