import mqttClient from "./mqtt";

// Publish a message helper function
export const publishMessage = (topic: string, message: object): void => {
  const payload = JSON.stringify(message);
  mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
    if (err) {
      console.error(
        `[MQTT]: Failed to publish message to topic ${topic}:`,
        err
      );
    } else {
      console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
    }
  });
};
