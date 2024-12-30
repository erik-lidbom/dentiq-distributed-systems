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
  throw new Error("Missing required MQTT environment variables. Check your .env file.");
}

const mqttOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || "8883", 10),
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000,
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
        console.error("[MQTT]: Subscription error:", err.message);
      } else {
        console.log("[MQTT]: Subscribed to necessary topics.");
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
    console.log(`[MQTT]: Message received on topic '${topic}':`, message.toString());

    const payload = JSON.parse(message.toString());

    if (topic === TOPICS.SUBSCRIBE.LOGIN) {
      console.log("[WORKFLOW]: Starting login workflow...");

      // Step 1: Validate Credentials
      console.log("[WORKFLOW]: Validating credentials...");
      const validated = await validateCredentials(payload);
      console.log("[WORKFLOW]: Credentials validated successfully:", validated);

      // Step 2: Generate Token
      console.log("[WORKFLOW]: Generating authentication token...");
      const tokenGenerated = await generateAuthToken(validated);
      console.log("[WORKFLOW]: Token generated successfully:", tokenGenerated);

      // Step 3: Publish Login Result
      console.log("[WORKFLOW]: Publishing login result...");
      await publishAuthResult(tokenGenerated);
      console.log("[WORKFLOW]: Login workflow completed successfully.");
    } else if (topic === TOPICS.SUBSCRIBE.AUTH_REQUEST) {
      console.log("[WORKFLOW]: Starting token validation workflow...");

      // Token Validation Workflow
      const validatedToken = await validateAuthToken(payload);
      console.log("[WORKFLOW]: Token validated successfully:", validatedToken);

      console.log("[WORKFLOW]: Publishing token validation result...");
      await publishValidationResult(validatedToken);
      console.log("[WORKFLOW]: Token validation workflow completed successfully.");
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[WORKFLOW ERROR]: Error in workflow execution:", errorMessage);
  }
});

// Publish-and-Subscribe Helper Function
export const publishAndSubscribe = (
  publishTopic: string,
  message: object,
  subscribeTopic: string,
  timeout: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(message);

    // Subscribe to the dynamic response topic with correlation ID
    mqttClient.subscribe(subscribeTopic, { qos: 2 }, (err) => {
      if (err) {
        return reject(
          new Error(`Failed to subscribe to topic ${subscribeTopic}: ${err.message}`)
        );
      }

      // Publish the request
      mqttClient.publish(publishTopic, payload, { qos: 2 }, (publishErr) => {
        if (publishErr) {
          return reject(
            new Error(`Failed to publish to topic ${publishTopic}: ${publishErr.message}`)
          );
        }
      });

      // Listen for the response on the subscribed topic
      const onMessage = (topic: string, msg: Buffer) => {
        if (topic === subscribeTopic) {
          mqttClient.removeListener("message", onMessage);
          resolve(JSON.parse(msg.toString()));
        }
      };

      mqttClient.on("message", onMessage);

      // Timeout handling
      setTimeout(() => {
        mqttClient.removeListener("message", onMessage);
        reject(new Error(`Timeout waiting for response on topic ${subscribeTopic}`));
      }, timeout);
    });
  });
};

// Publish a message
export const publishMessage = (topic: string, message: object): void => {
  const payload = JSON.stringify(message);
  mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
    if (err) {
      console.error(`[MQTT]: Failed to publish message to topic ${topic}:`, err.message);
    } else {
      console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
    }
  });
};

export default mqttClient;
