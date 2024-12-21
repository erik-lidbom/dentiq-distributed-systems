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
  port: parseInt(process.env.MQTT_PORT || "8883", 10),
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttOptions);

// On successful connection
mqttClient.on("connect", () => {
  console.log("[MQTT]: Successfully connected to the broker!");

  // Subscribe to necessary topics
  mqttClient.subscribe(
    [TOPICS.SUBSCRIBE.LOGIN, TOPICS.SUBSCRIBE.AUTH_REQUEST],
    (err) => {
      if (err) {
        console.error(
          "[MQTT]: Could not establish subscription connections:",
          err.message
        );
      } else {
        console.log(
          `[MQTT]: Subscribed to topics: ${TOPICS.SUBSCRIBE.LOGIN}, ${TOPICS.SUBSCRIBE.AUTH_REQUEST}`
        );
      }
    }
  );
});

// Handle connection errors
mqttClient.on("error", (err) => {
  console.error("[MQTT]: Error connecting to broker:", err.message);
  console.error(
    "[MQTT]: Ensure the broker details in the .env file are correct and the broker is running."
  );
});

// Pipe-and-Filter Processing
mqttClient.on("message", async (topic, message) => {
  try {
    console.log(`[MQTT]: Message received on topic ${topic}:`, message.toString());

    const payload = JSON.parse(message.toString());

    if (topic === TOPICS.SUBSCRIBE.LOGIN) {
      // Login Pipeline
      try {
        const validated = await validateCredentials(payload);
        const tokenGenerated = await generateAuthToken(validated);
        await publishAuthResult(tokenGenerated);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("[MQTT]: Error in login pipeline:", errorMessage);
        publishMessage(TOPICS.PUBLISH.AUTH_FAILURE, {
          success: false,
          error: errorMessage,
        });
      }
    } else if (topic === TOPICS.SUBSCRIBE.AUTH_REQUEST) {
      // Token Validation Pipeline
      try {
        const validatedToken = await validateAuthToken(payload);
        await publishValidationResult(validatedToken);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("[MQTT]: Error processing message:", errorMessage);
        publishMessage(TOPICS.PUBLISH.AUTH_RESPONSE, {
          success: false,
          error: errorMessage,
        });
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[MQTT]: General error processing message:", errorMessage);
  }
});

// Publish a message helper function
export const publishMessage = (topic: string, message: object): void => {
  const payload = JSON.stringify(message);
  mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
    if (err) {
      console.error(
        `[MQTT]: Failed to publish message to topic ${topic}:`,
        err.message
      );
    } else {
      console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
    }
  });
};

// Default export of the MQTT client
export default mqttClient;
