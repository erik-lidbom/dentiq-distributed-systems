import { mqttClient } from "./mqtt";
import { TOPICS } from "./topics";

// Subscribe to topics
const subscriptionTopics = [
  TOPICS.SUBSCRIBE.DENTIST_CREATE_APP,
  TOPICS.SUBSCRIBE.CREDENTIAL_VALIDATION_REQUEST,
];

export const subscribeTopics = async () => {
  subscriptionTopics.map((topic: string) => {
    mqttClient?.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.error(`[MQTT]: Error subscribing to ${topic}:`, err.message);
      }
    });
  });
};
