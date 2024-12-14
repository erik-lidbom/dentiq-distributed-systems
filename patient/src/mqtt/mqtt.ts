import mqtt, { type IClientOptions, type MqttClient } from 'mqtt';
import { subscribeTopics } from './subscribe';

const mqttConnOptions: IClientOptions = {
  protocol: 'wss',
  host: '1171f0a21d314f5097e5278b94005ce9.s1.eu.hivemq.cloud',
  port: 8884,
  username: 'hivemq.webclient.1734134728690',
  password: 'iDqw3l5:6Z4,EA?IVzx>',
};

export let client: MqttClient;

export const mqttClient = {
  setup: async (): Promise<void> => {
    if (client) {
      console.log('[MQTT]: Client already initialized');
      return;
    }

    client = mqtt.connect(
      `wss://${mqttConnOptions.host}:${mqttConnOptions.port}/mqtt`,
      mqttConnOptions
    );
    await subscribeTopics();

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
