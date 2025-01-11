import { v4 as uuidv4 } from 'uuid';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { retrievePublishTopic, retrieveSubscribedTopic } from './helpers';

export type MqttResponse = {
  status: string;
  message: string;
};

dotenv.config();

const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8884', 10),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  protocol: 'mqtts', // Secure MQTT connection
};

const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

mqttClient.on('connect', () => {
  console.log('[MQTT]: Connection established.');
});

mqttClient.on('error', (err) => {
  console.error('[MQTT]: Connection error:', err);
});

/**
 * The method publishes to a topic and subscribes to it for a specific amount of time to listen for responses. The response will be the end response for the gateway to send to client
 * to listen for responses.
 *
 * @param {string} service - The service the request is coming from. This is used to know what topic to publish to.
 * @param path
 * @param {any} data - The request data sent from client
 * @param {number} duration - The time in milliseconds that the mqtt will listen to the topic
 */
export const publishAndSubscribe = (
  service: string,
  path: string | undefined,
  data: any,
  duration: number
) => {
  return new Promise((resolve, reject) => {
    const correlationId = uuidv4();
    const formatData =
      typeof data === 'string' ? data : JSON.stringify(data) || '*';

    const payload = JSON.stringify({ payload: formatData, correlationId });
    const publishToTopic = retrievePublishTopic(service, path);
    const subscribeToTopic = retrieveSubscribedTopic(service, path);

    // Publish the message
    mqttClient.publish(publishToTopic, payload, { qos: 2 }, (err) => {
      if (err) {
        console.error(`Failed to publish to ${publishToTopic}:`, err);
        reject(`Failed to publish to ${publishToTopic}`);
        return;
      }
      console.log(`Successfully published message to ${publishToTopic}`);
    });

    // Subscribe to the topic
    mqttClient.subscribe(
      `${subscribeToTopic}/${correlationId}`,
      { qos: 2 },
      (err) => {
        if (err) {
          console.error(
            `Failed to subscribe to ${subscribeToTopic}/${correlationId}:`,
            err
          );
          reject(
            `Failed to subscribe to ${subscribeToTopic}/${correlationId}: ${err.message}`
          );
          return;
        }
        console.log(
          `Subscribing to topic "${subscribeToTopic}/${correlationId}" for ${duration}ms.`
        );
      }
    );

    console.log('Waiting for response...');
    // Message handler to process and return the response from the subsribed topic
    const onMessage = (incomingTopic: string, message: Buffer) => {
      const receivedMessage = message.toString();
      console.log(
        `Response received on topic "${incomingTopic}":`,
        receivedMessage
      );

      // Resolves the promise with the return message from the topic
      resolve(receivedMessage);

      // Unsubscribes and cleanup listener
      mqttClient.unsubscribe(`${subscribeToTopic}/${correlationId}`, (err) => {
        if (err) {
          console.error(
            `Failed to unsubscribe from ${subscribeToTopic}/${correlationId}:`,
            err
          );
        } else {
          console.log(
            `Successfully unsubscribed from ${subscribeToTopic}/${correlationId}`
          );
        }
      });

      mqttClient.off('message', onMessage);
    };

    // Message listener
    mqttClient.on('message', onMessage);

    // If the duration has expired, unsubscribes and cleanup
    setTimeout(() => {
      mqttClient.unsubscribe(`${subscribeToTopic}/${correlationId}`, (err) => {
        if (err) {
          console.error(
            `Failed to unsubscribe from ${subscribeToTopic}/${correlationId}:`,
            err
          );
        } else {
          console.log(
            `Successfully unsubscribed from ${subscribeToTopic}/${correlationId}`
          );
        }
      });

      // Disable the message listener
      mqttClient.off('message', onMessage);

      // Rejects the promise if the duration has expired
      reject(
        `No response received for topic "${subscribeToTopic}/${correlationId}" within ${duration}ms`
      );
    }, duration);
  });
};

export default mqttClient;
