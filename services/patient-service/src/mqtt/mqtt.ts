import mqtt, { MqttClient, IClientOptions } from "mqtt";
import mongoose from "mongoose"; // For ObjectId validation
import dotenv from "dotenv";
import { TOPICS } from "./topics"; // Import MQTT topics
import { Patient } from "../models/patientSchema"; // Import Patient model
dotenv.config();

// Validate required environment variables
if (
  !process.env.MQTT_HOST ||
  !process.env.MQTT_PORT ||
  !process.env.MQTT_USERNAME ||
  !process.env.MQTT_PASSWORD
) {
  throw new Error(
    'Missing required MQTT environment variables. Check your .env file.'
  );
}

// MQTT connection options
const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT, 10) || 8883,
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

// On successful connection
mqttClient.on('connect', () => {
  console.log('[MQTT]: Successfully connected to the broker!');

  // Subscribe to topics
  mqttClient.subscribe(TOPICS.SUBSCRIBE.PATIENT_BOOKING, (err) => {
    if (err) {
      console.error("[MQTT]: Could not establish subscription connections:", err);
    } else {
      console.log(
        `[MQTT]: Subscribed to topic: ${TOPICS.SUBSCRIBE.PATIENT_BOOKING}`
      );
    }
  });
});

// Handle connection errors
mqttClient.on("error", (err) => {
  console.error("[MQTT]: Connection error:", err);
  mqttClient.end();
});

// Handle incoming messages
mqttClient.on("message", async (topic, message) => {
  try {
    console.log(`[MQTT]: Raw message received from ${topic}:`, message.toString());

    // Validate and parse the message
    console.log(`[DEBUG]: Raw message: ${message.toString()}`);
    const payload = JSON.parse(message.toString());
    console.log(`[DEBUG]: Parsed payload:`, payload);

    const { correlationId, patientId } = payload;

    if (!correlationId || !patientId) {
      throw new Error("Missing required fields in the message payload");
    }

    console.log(`[DEBUG]: Checking if patientId is valid: ${patientId}`);
    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      console.error(`[DEBUG]: patientId is invalid: ${patientId}`);
      throw new Error("Invalid patientId format");
    }

    let status = false;

    if (topic === TOPICS.SUBSCRIBE.PATIENT_BOOKING) {
      const patient = await Patient.findById(patientId); // Query the database
      status = !!patient; // Convert to boolean (true if patient exists)
    } else {
      console.warn(`[MQTT]: Unknown topic received: ${topic}`);
      return;
    }

    // Publish response
    const responsePayload = { correlationId, status };
    publishMessage(TOPICS.PUBLISH.PATIENT_AWAIT_CONFIRMATION, responsePayload);
    console.log(`[MQTT]: Response published to ${TOPICS.PUBLISH.PATIENT_AWAIT_CONFIRMATION}:`, responsePayload);
  } catch (err) {
    console.error("[MQTT]: Error processing received message:", err);
  
    const errorResponse = {
      correlationId: "unknown",
      status: false,
      error: (err as Error).message || "Invalid message format or internal error",
    };
  
    publishMessage(TOPICS.PUBLISH.PATIENT_AWAIT_CONFIRMATION, errorResponse);
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
