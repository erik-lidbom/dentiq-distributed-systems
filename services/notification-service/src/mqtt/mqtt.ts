import mqtt, { IClientOptions, MqttClient } from 'mqtt';
import dotenv from 'dotenv';
import { TOPICS } from './topics';
import { createNotification } from '../controllers/controller';
import { NotificationDocument } from '../models/model';
import { subscribeTopics } from './subscribe';
import { publishToAllTopics } from './publish';
import { createPublishTopics } from '../helpers/helpers';
dotenv.config();

// MQTT Configuration
const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

export let client: MqttClient;

export const mqttClient = {
  setup: async (): Promise<void> => {
    client = mqtt.connect(mqttConnOptions);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    // Subscribes to all topics
    await subscribeTopics();

    client.on('message', async (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);

      // When a message is received, the service calls the createNotification method to store the notification
      const res = await createNotification(message);

      // Retrieve all the topics that the service will publish to
      const topics: string[] = createPublishTopics(topic, res);

      // Publishes the notification
      await publishToAllTopics(topics, res);

      // Close connection?
    });
    client.on('close', () => {
      console.log('Disconnected from MQTT broker');
    });
    client.on('error', (error) => {
      console.error('MQTT Client Error:', error);
      // Optionally, attempt reconnection here
    });
  },
};
