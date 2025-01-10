import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { TOPICS } from './topics';
import {
  validateAuthToken,
  createAccount,
  login,
  refreshAuthToken,
  getTokensBySessionId,
} from '../controllers/authController';

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

const mqttOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  reconnectPeriod: 1000,
};

// Create MQTT client
const mqttClient: MqttClient = mqtt.connect(mqttOptions);

// On successful connection
mqttClient.on('connect', () => {
  console.log('[MQTT]: Successfully connected to the broker!');

  // Subscribe to necessary topics
  mqttClient.subscribe(
    [
      TOPICS.SUBSCRIBE.AUTH_CREATE_ACCOUNT,
      TOPICS.SUBSCRIBE.AUTH_LOGIN,
      TOPICS.SUBSCRIBE.AUTH_VALIDATE_TOKEN,
      TOPICS.SUBSCRIBE.AUTH_VALIDATE_SESSION,
    ],
    { qos: 2 },
    (err) => {
      if (err) {
        console.error('[MQTT]: Subscription error:', err.message);
      } else {
        console.log('[MQTT]: Subscribed to necessary topics.');
      }
    }
  );
});

// Handle connection errors
mqttClient.on('error', (err) => {
  console.error('[MQTT]: Error connecting to broker:', err.message);
  console.error(
    '[MQTT]: Ensure the broker details in the .env file are correct and the broker is running.'
  );
});

mqttClient.on('message', async (topic, message) => {
  try {
    console.log(
      `[MQTT]: Message received on topic '${topic}':`,
      message.toString()
    );

    const payload = JSON.parse(message.toString());

    if (topic === TOPICS.SUBSCRIBE.AUTH_CREATE_ACCOUNT) {
      const result = await createAccount(payload);
      publishMessage(TOPICS.PUBLISH.AUTH_CREATE_ACCOUNT, result);
    } else if (topic === TOPICS.SUBSCRIBE.AUTH_LOGIN) {
      const result = await login(payload);
      publishMessage(TOPICS.PUBLISH.AUTH_LOGIN, result);
    } else if (topic === TOPICS.SUBSCRIBE.AUTH_VALIDATE_TOKEN) {
      const { token } = payload;
      const result = await validateAuthToken(token);
      publishMessage(TOPICS.PUBLISH.AUTH_VALIDATE_TOKEN, result);
    } else if (topic === TOPICS.SUBSCRIBE.AUTH_VALIDATE_SESSION) {
      const { sessionId } = payload;
      const result = await getTokensBySessionId(sessionId);

      publishMessage(TOPICS.PUBLISH.AUTH_VALIDATE_SESSION, result);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(
      '[WORKFLOW ERROR]: Error in workflow execution:',
      errorMessage
    );
  }
});

// Publish a message
export const publishMessage = (topic: string, message: object): void => {
  const payload = JSON.stringify(message);
  mqttClient.publish(topic, payload, { qos: 2 }, (err) => {
    if (err) {
      console.error(
        `[MQTT]: Failed to publish message to topic ${topic}:`,
        err.message
      );
    } else {
      console.log(`[MQTT]: Message published to topic ${topic}:`, payload);
    }
  });
};

export default mqttClient;
