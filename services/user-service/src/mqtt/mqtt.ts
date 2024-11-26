import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";
dotenv.config();

// Validate required environment variables
if (!process.env.MQTT_HOST || !process.env.MQTT_PORT || !process.env.MQTT_USERNAME || !process.env.MQTT_PASSWORD || !process.env.PATIENT_TOPIC || !process.env.DENTIST_TOPIC) {
    throw new Error("Missing required MQTT environment variables. Check your .env file.");
}

// MQTT connection options
const mqttConnOptions: IClientOptions = {
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT, 10) || 8883,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

// On successful connection
mqttClient.on("connect", () => {
    console.log("[MQTT]: Successfully connected to the broker!");

    // Subscribe to patient and dentist topics
    const topics = [process.env.PATIENT_TOPIC!, process.env.DENTIST_TOPIC!];
    mqttClient.subscribe(topics, (err) => {
        if (err) {
            console.error("[MQTT]: Could not establish subscription connections:", err);
        } else {
            console.log("[MQTT]: Subscribed to topics:", topics.join(", "));
            console.log("-------------------------------------------------------");
        }
    });
});

// Handle incoming messages
mqttClient.on("message", (topic, message) => {
  try {
      const messageString = message.toString(); // Convert the message to a string
      let payload;

      // Attempt to parse JSON. If it fails, treat it as a plain string.
      try {
          payload = JSON.parse(messageString); // Parse as JSON
      } catch {
          payload = messageString; // If parsing fails, treat it as a plain string
      }

      console.log(`[MQTT]: Message received from ${topic}:`, payload);

      if (topic === process.env.PATIENT_TOPIC) {
          console.log(`[MQTT]: Patient message received:`, payload);
          // Add patient-specific logic here
      } else if (topic === process.env.DENTIST_TOPIC) {
          console.log(`[MQTT]: Dentist message received:`, payload);
          // Add dentist-specific logic here
      } else {
          console.log(`[MQTT]: Unknown topic (${topic}). Message:`, payload);
      }
  } catch (err) {
      console.error("[MQTT]: Error processing received message:", err);
  }
});

// Publish a message helper function
export const publishMessage = (topic: string, message: object) => {
    const payload = JSON.stringify(message);
    mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
        if (err) {
            console.error(`[MQTT]: Failed to publish message to topic ${topic}:`, err);
        } else {
            console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
        }
    });
};

export default mqttClient;
