import mqtt, { IClientOptions, MqttClient } from "mqtt";
import dotenv from "dotenv";
dotenv.config();

const APPOINTMENT_TOPIC = "/appointment";
const CLINIC_TOPIC = "/clinic";

const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || "8883", 10),
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

export let client: MqttClient;

export const mqttClient = {
  setup: async (): Promise<void> => {
    client = mqtt.connect(mqttConnOptions);

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client?.subscribe(APPOINTMENT_TOPIC, (err) => {
        if (!err) {
          console.log(`Subscribed to ${APPOINTMENT_TOPIC}`);
          return;
        }
        console.error("MQTT Subscription error:", err);
      });
      client?.subscribe(CLINIC_TOPIC, (err) => {
        if (!err) {
          console.log(`Subscribed to ${CLINIC_TOPIC}`);
          return;
        }
        console.error("MQTT Subscription error:", err);
      });
    });

    client.on("message", (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      // TODO --> How do we handle the communication here? Do we listen to a message and then redirects to the relevant API route, or does the server directly call the controller whenever it does a request.
    });
    client.on("close", () => {
      console.log("Disconnected from MQTT broker");
    });
    client.on("error", (error) => {
      console.error("MQTT Client Error:", error);
      // Optionally, attempt reconnection here
    });
  },
};

/**
 * Publish functions that is used within the controllers. The function retrieves a topic and message as arguments and then returns * a promise.
 * The function uses guard clauses do ensure readability.
 */
export const publistMqtt = async (
  topic: string,
  message: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!client.connected) {
      console.log("MQTT client not connected.");
      client.reconnect();
      return reject(new Error("MQTT client not connected"));
    }
    client.publish(topic, message, { qos: 0 }, (error) => {
      if (error) {
        console.error("MQTT Publish error:", error);
        return reject(error);
      }
      console.log(`MQTT message published to ${topic}`);
      return resolve();
    });
  });
};
