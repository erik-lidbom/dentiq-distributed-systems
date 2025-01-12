import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import { subscribeTopics } from './subscribe';

const mqttConnOptions: IClientOptions = {
  protocol: 'wss',
  host: import.meta.env.VITE_MQTT_HOST,
  port: import.meta.env.VITE_MQTT_PORT,
  username: import.meta.env.VITE_MQTT_USERNAME,
  password: import.meta.env.VITE_MQTT_PASSWORD,
};

export let client: MqttClient;

export const mqttClient = {
  setup: async (userId: string): Promise<void> => {
    if (client) {
      console.log('[MQTT]: Client already initialized');
      return;
    }

    client = mqtt.connect(
      `wss://${mqttConnOptions.host}:${mqttConnOptions.port}/mqtt`,
      mqttConnOptions
    );
    await subscribeTopics(userId);

    return new Promise((resolve, reject) => {
      client.on('connect', () => {
        console.log('[MQTT]: Connected to broker');
        resolve();
      });

      client.on('error', (error) => {
        console.error('[MQTT]: Client connection error:', error);
        reject(error);
      });

      client.on('close', () => {
        console.log('[MQTT]: Disconnected from broker');
      });
    });
  },
};
