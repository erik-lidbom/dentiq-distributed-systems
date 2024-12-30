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
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

// On successful connection
mqttClient.on("connect", () => {
  console.log("[MQTT]: Successfully connected to the broker!");

  // Subscribe to Credential Validation and Patient Booking topics
  mqttClient.subscribe(
    [
      TOPICS.SUBSCRIBE.PATIENT_BOOKING,
      TOPICS.SUBSCRIBE.CREDENTIAL_VALIDATION_REQUEST,
    ],
    (err) => {
      if (err) {
        console.error("[MQTT]: Could not establish subscription connections:", err);
      } else {
        console.log(`[MQTT]: Subscribed to necessary topics.`);
      }
    }
  );
});

// Handle connection errors
mqttClient.on("error", (err) => {
  console.error("[MQTT]: Connection error:", err);
  mqttClient.end();
});

// Handle incoming messages
mqttClient.on("message", async (topic, message) => {
  try {
    console.log(`[MQTT]: Message received on topic ${topic}:`, message.toString());

    const payload = JSON.parse(message.toString());

    if (topic === TOPICS.SUBSCRIBE.PATIENT_BOOKING) {
      handlePatientBooking(payload);
    } else if (topic === TOPICS.SUBSCRIBE.CREDENTIAL_VALIDATION_REQUEST) {
      handleCredentialValidation(payload);
    } else {
      console.warn(`[MQTT]: Unknown topic received: ${topic}`);
    }
  } catch (err) {
    console.error("[MQTT]: Error processing received message:", err);
  }
});

// Handle Credential Validation Requests
const handleCredentialValidation = async (payload: any) => {
  try {
    const { username, password, correlationId } = payload;

    if (!username || !password || !correlationId) {
      throw new Error("Invalid payload: Missing required fields");
    }

    console.log(
      `[DEBUG]: Validating credentials for username: ${username}, correlationId: ${correlationId}`
    );

    // Query database for username and password
    const patient = await Patient.findOne({ email: username, password });

    const responsePayload = {
      correlationId,
      success: !!patient,
      message: patient
        ? "Credentials validated successfully."
        : "Invalid credentials.",
    };

    mqttClient.publish(
      TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE(correlationId),
      JSON.stringify(responsePayload),
      { qos: 2 },
      (err) => {
        if (err) {
          console.error(
            `[MQTT]: Failed to publish response to topic ${TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE(
              correlationId
            )}:`,
            err
          );
        } else {
          console.log(
            `[MQTT]: Response published to topic ${TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE(
              correlationId
            )}:`,
            responsePayload
          );
        }
      }
    );
  } catch (err) {
    console.error("[MQTT]: Error during credential validation:", err);
  }
};

// Handle Patient Booking
const handlePatientBooking = async (payload: any) => {
  try {
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

    const patient = await Patient.findById(patientId); // Query the database
    status = !!patient; // Convert to boolean (true if patient exists)

    // Publish response
    const responsePayload = { correlationId, status };
    mqttClient.publish(
      TOPICS.PUBLISH.PATIENT_AWAIT_CONFIRMATION,
      JSON.stringify(responsePayload),
      { qos: 2 },
      (err) => {
        if (err) {
          console.error(
            `[MQTT]: Failed to publish response to topic ${TOPICS.PUBLISH.PATIENT_AWAIT_CONFIRMATION}:`,
            err
          );
        } else {
          console.log(
            `[MQTT]: Response published to topic ${TOPICS.PUBLISH.PATIENT_AWAIT_CONFIRMATION}:`,
            responsePayload
          );
        }
      }
    );
  } catch (err) {
    console.error("[MQTT]: Error during patient booking:", err);
  }
};

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
