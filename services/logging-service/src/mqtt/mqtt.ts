import mqtt, { IClientOptions, MqttClient } from 'mqtt'
import { subscribeToTopics } from './mqttSubscribe';
import dotenv from 'dotenv';
import { messageHandler } from './mqttMessageHandler';

dotenv.config();
let mqttPort;

if(process.env.MQTT_PORT) {
    mqttPort = parseInt(process.env.MQTT_PORT)
} else {
    throw new Error('MQTT Port Envrionment Variable Not Defined')
}
const mqttConnOptions: IClientOptions = {
    host: process.env.MQTT_HOST,
    port: mqttPort,
    protocol: 'mqtts',
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
};

export let client: MqttClient;

export const mqttClient = {
    setup: async (): Promise<void> => {
      client = mqtt.connect(mqttConnOptions);
      console.log('Connecting?')
      client.on('connect', () => {
        console.log('Connected to MQTT broker');
      });
  
      await subscribeToTopics();
      messageHandler();

      client.on('close', () => {
        console.log('Disconnected from MQTT broker');
      });
      client.on('error', (error) => {
        console.error('MQTT Client Error:', error);
        // Optionally, attempt reconnection here
      });
    },
  };