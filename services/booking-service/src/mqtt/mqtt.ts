import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { subscribeTopics } from './subscribe';
import { publishMessage } from './publish';
import { TOPICS } from './topics';
import {
  createAppointment,
  getAppointments,
  deleteAppointment,
  bookAppointment,
  getAppointment,
  cancelAppointment,
  deleteAppointments,
} from '../controllers/appointmentController';

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

    // Ensure the message is a valid JSON object
    const payload = Buffer.isBuffer(message)
      ? JSON.parse(message.toString())
      : message;

    if (typeof payload !== 'object' || !payload) {
      throw new Error('Invalid payload format.');
    }

    switch (topic) {
      case TOPICS.SUBSCRIBE.CREATE:
        await createAppointment(TOPICS.PUBLISH.CREATE_RESPONSE, message);
        break;
      case TOPICS.SUBSCRIBE.BOOK:
        await bookAppointment(TOPICS.PUBLISH.BOOK_RESPONSE, message);
        break;
      case TOPICS.SUBSCRIBE.GET:
        await getAppointment(TOPICS.PUBLISH.GET_RESPONSE, message);
        break;
      case TOPICS.SUBSCRIBE.DELETE:
        await deleteAppointment(TOPICS.PUBLISH.DELETE_RESPONSE, message);
        break;
      case TOPICS.SUBSCRIBE.DELETE_MANY:
        await deleteAppointments(TOPICS.PUBLISH.DELETE_MANY_RESPONSE, message);
        break;
      case TOPICS.SUBSCRIBE.CANCEL:
        await cancelAppointment(TOPICS.PUBLISH.CANCEL_RESPONSE, message);
        break;
      case TOPICS.SUBSCRIBE.QUERY:
        await getAppointments(TOPICS.PUBLISH.QUERY_RESPONSE, message);
        break;
      default:
        console.error('[MQTT]: Unknown path received:', topic);
    }
  } catch (error: any) {
    console.error('[MQTT]: Error processing message:', error.message);

    const errorResponse = {
      status: false,
      error: error.message,
    };

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
