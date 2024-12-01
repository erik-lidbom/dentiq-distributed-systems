import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";
import { TOPICS } from "./topics";
import { Dentist} from "../models/dentistSchema"; // Import Dentist model
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

  // Subscribe to topics
  const subscriptionTopics = [
    TOPICS.SUBSCRIBE.DENTIST_CREATE_APP,
  ];

  mqttClient.subscribe(subscriptionTopics, (err) => {
    if (err) {
      console.error("[MQTT]: Could not establish subscription connections:", err);
    } else {
      console.log("[MQTT]: Subscribed to topics:", subscriptionTopics.join(", "));
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
    const payload = JSON.parse(message.toString());
    const { correlationId, dentistId } = payload;

    let responseTopic = "";
    let status: boolean;

    if (topic === TOPICS.SUBSCRIBE.DENTIST_CREATE_APP) {
      responseTopic = TOPICS.PUBLISH.DENTIST_AWAIT_CONF;
      //const exists = await Dentist.exists(JSON.parse(payload.dentistId));
      const dentist = await Dentist.findById({ _id: payload.dentistId })
      status = !!dentist;
    } else {
      console.warn(`[MQTT]: Unknown topic received: ${topic}`);
      return;
    }

    // Publish response
    const responsePayload = { correlationId, status };
    publishMessage(responseTopic, responsePayload);
    console.log(`[MQTT]: Response published to ${responseTopic}:`, responsePayload);
  } catch (err) {
    console.error("[MQTT]: Error processing message:", err);

    const errorResponse = {
      correlationId: "unknown",
      status: false,
      error: "Invalid message format",
    };
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
