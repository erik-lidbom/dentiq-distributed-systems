import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";
import { TOPICS } from "./topics"; // Import MQTT topics
dotenv.config();

// Validate required environment variables
if (
  !process.env.MQTT_HOST ||
  !process.env.MQTT_PORT ||
  !process.env.MQTT_USERNAME ||
  !process.env.MQTT_PASSWORD
) {
  throw new Error(
    "Missing required MQTT environment variables. Check your .env file."
  );
}

// MQTT connection options
const mqttOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || "1883", 10),
  protocol: "mqtt", // Use "mqtts" if your broker requires SSL
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttOptions);

// On successful connection
mqttClient.on("connect", () => {
  console.log("[MQTT]: Successfully connected to the broker!");

  // Subscribe to relevant topics
  mqttClient.subscribe(TOPICS.SUBSCRIBE.TOKEN_REVOKE, (err) => {
    if (err) {
      console.error("[MQTT]: Could not establish subscription connections:", err);
    } else {
      console.log(`[MQTT]: Subscribed to topic: ${TOPICS.SUBSCRIBE.TOKEN_REVOKE}`);
    }
  });
});

// Handle connection errors
mqttClient.on("error", (err) => {
  console.error("[MQTT]: Error connecting to broker:", err);
  mqttClient.end();
});

// Handle incoming messages
mqttClient.on("message", async (topic, message) => {
  try {
    console.log(`[MQTT]: Raw message received from ${topic}:`, message.toString());

    // Parse and validate the message payload
    const payload = JSON.parse(message.toString());
    console.log(`[DEBUG]: Parsed payload:`, payload);

    if (topic === TOPICS.SUBSCRIBE.TOKEN_REVOKE) {
      console.log(`[INFO]: Token revocation request received:`, payload);
    } else {
      console.warn(`[MQTT]: Unknown topic received: ${topic}`);
    }
  } catch (err) {
    console.error("[MQTT]: Error processing received message:", err);
  }
});

// Publish a message helper function
export const publishMessage = (topic: string, message: object): void => {
  const payload = JSON.stringify(message);
  mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
    if (err) {
      console.error(`[MQTT]: Failed to publish message to topic ${topic}:`, err);
    } else {
      console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
    }
  });
};

// Default export of the MQTT client
export default mqttClient;
