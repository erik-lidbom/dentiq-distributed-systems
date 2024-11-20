import express, { Express } from "express";
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Express app
const app: Express = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests

// MQTT
const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || "8883", 10),
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};

const mqttClient = mqtt.connect(mqttConnOptions);

mqttClient.on("connect", () => {
  console.log("[MQTT]: Successfully connected to the broker!\n");

  // Example: Subscribe to a topic
  mqttClient.subscribe(process.env.APPOINTMENT_TOPIC!, (err) => {
    if (err) {
      console.error("[mqtt]: Subscription error", err);
    } else {
      console.log("[mqtt]: Subscribed to topic", process.env.APPOINTMENT_TOPIC);
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`[mqtt]: Received message on ${topic}:`, message.toString());
});

// Routes
app.get("/", (req, res) => {
  res.send("Express + TypeScript App");
});

// Export the configured app
export default app;
