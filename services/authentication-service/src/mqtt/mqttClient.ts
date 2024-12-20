import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";
import { TOPICS } from "./topics";
import {
  validateCredentials,
  generateAuthToken,
  publishAuthResult,
  validateAuthToken,
  publishValidationResult,
} from "../controllers/authController";

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
  protocol: "mqtt",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttOptions);

// On successful connection
mqttClient.on("connect", () => {
  console.log("[MQTT]: Successfully connected to the broker!");

  mqttClient.subscribe([TOPICS.SUBSCRIBE.LOGIN, TOPICS.SUBSCRIBE.AUTH_REQUEST], (err) => {
    if (err) {
      console.error("[MQTT]: Could not establish subscription connections:", (err as Error).message);
    } else {
      console.log(
        `[MQTT]: Subscribed to topics: ${TOPICS.SUBSCRIBE.LOGIN}, ${TOPICS.SUBSCRIBE.AUTH_REQUEST}`
      );
    }
  });
});

// Pipe-and-Filter Processing
mqttClient.on("message", async (topic, message) => {
  try {
    console.log(`[MQTT]: Message received on topic ${topic}:`, message.toString());

    const payload = JSON.parse(message.toString());

    if (topic === TOPICS.SUBSCRIBE.LOGIN) {
      // Login Pipeline
      const validated = await validateCredentials(payload);
      const tokenGenerated = await generateAuthToken(validated);
      await publishAuthResult(tokenGenerated);
    } else if (topic === TOPICS.SUBSCRIBE.AUTH_REQUEST) {
      // Token Validation Pipeline
      const validatedToken = await validateAuthToken(payload);
      await publishValidationResult(validatedToken);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[MQTT]: Error processing message:", errorMessage);

    // Handle validation errors
    if (topic === TOPICS.SUBSCRIBE.AUTH_REQUEST) {
      publishMessage(TOPICS.PUBLISH.AUTH_RESPONSE, {
        success: false,
        error: errorMessage,
      });
    }
  }
});

// Publish a message helper function
export const publishMessage = (topic: string, message: object): void => {
  const payload = JSON.stringify(message);
  mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
    if (err) {
      console.error(`[MQTT]: Failed to publish message to topic ${topic}:`, (err as Error).message);
    } else {
      console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
    }
  });
};

// Default export of the MQTT client
export default mqttClient;
