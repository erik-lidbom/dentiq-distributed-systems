import { mqttClient } from "./mqtt";
import { TOPICS } from "./topics";

// Subscribe to topics
const subscriptionTopics = [TOPICS.SUBSCRIBE.DENTIST_CREATE_APP];

export const subscribeTopics = async () => {
  subscriptionTopics.map((topic: string) => {
    mqttClient?.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
        return;
      } else {
        console.log(
          "[MQTT]: Subscribed to topics:",
          subscriptionTopics.join(", ")
        );
      }
    });
  });
};
