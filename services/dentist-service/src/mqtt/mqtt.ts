import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { subscribeTopics } from './subscribe';
import { publishMessage } from './publish';
import { getStatus, retrievePublishTopics } from './helpers';
import { TOPICS } from './topics';
import {
  createDentist,
  deleteDentist,
  getDentist,
  patchDentist,
  queryClinics,
  queryDentists,
} from '../controllers/dentistController';
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

// MQTT connection options
const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT, 10) || 8883,
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Create MQTT client
export const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

// On successful connection
mqttClient.on('connect', async () => {
  console.log('[MQTT]: Successfully connected to the broker!');

  // Subscribes to all topics
  await subscribeTopics();
});

// Handle connection errors
mqttClient.on('error', (err) => {
  console.error('[MQTT]: Connection error:', err);
  mqttClient.end();
});

// Handle incoming messages
mqttClient.on('message', async (topic, message) => {
  try {
    console.log(
      `[MQTT]: Raw message received from ${topic}:`,
      message.toString()
    );
    // Validate and parse the message
    const payload = Buffer.isBuffer(message)
      ? JSON.parse(message.toString())
      : message;
    const correlationId = payload?.correlationId || 'unknown';

    //Retrieve the response topic and status
    const responseTopic: string = retrievePublishTopics(topic);
    const responseStatus: boolean = await getStatus(topic, payload);

    // Publish response
    const responsePayload = { correlationId, responseStatus };
    publishMessage(responseTopic, responsePayload);
    console.log(
      `[MQTT]: Response published to ${responseTopic}:`,
      responsePayload
    );

    switch (topic) {
      case TOPICS.SUBSCRIBE.CREATE:
        await createDentist(payload);
        break;
      case TOPICS.SUBSCRIBE.GET:
        await getDentist(payload);
        break;
      case TOPICS.SUBSCRIBE.UPDATE:
        await patchDentist(payload);
        break;
      case TOPICS.SUBSCRIBE.DELETE:
        await deleteDentist(payload);
        break;
      case TOPICS.SUBSCRIBE.QUERY:
        await queryDentists(payload);
        break;
      case TOPICS.SUBSCRIBE.CLINICS.QUERY_RESPONSE:
        await queryClinics(payload);
        break;
      default:
        console.error('[MQTT]: Unknown topic:', topic);
    }
  } catch (err) {
    console.error('[MQTT]: Error processing message:', err);

    const errorResponse = {
      correlationId: 'unknown',
      status: false,
      error: 'Invalid message format',
    };

    // Publish error response
    const errorTopic = topic.replace('request', 'response');
    publishMessage(errorTopic, errorResponse);
    console.log(
      `[MQTT]: Error response published to ${errorTopic}:`,
      errorResponse
    );
  }
});

// Default export of the MQTT client
export default mqttClient;
