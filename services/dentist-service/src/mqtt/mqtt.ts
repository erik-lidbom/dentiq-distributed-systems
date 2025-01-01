import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { subscribeTopics } from './subscribe';
import { publishMessage } from './publish';
import { getStatus, retrievePublishTopics } from './helpers';
import { TOPICS } from './topics';
import { Dentist } from '../models/dentistSchema';

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

// This function handles the dentist credential validation logic
const handleCredentialValidation = async (payload: any) => {
  try {
    const { email, password, correlationId } = payload;

    if (!email || !password || !correlationId) {
      console.error('[MQTT DentistService]: Invalid payload:', payload);
      throw new Error('Invalid payload: Missing required fields');
    }

    console.log(`[MQTT DentistService]: Validating credentials for email: ${email}, correlationId: ${correlationId}`);

    // Query the Dentist collection
    const dentist = await Dentist.findOne({ email, password });
    const success = !!dentist;

    const responsePayload = {
      correlationId,
      success,
      message: success
        ? 'Dentist credentials validated successfully.'
        : 'Invalid credentials.',
    };

    // Publish response back to AuthService using dynamic topic
    mqttClient.publish(
      TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE(correlationId),
      JSON.stringify(responsePayload),
      { qos: 2 },
      (err) => {
        if (err) {
          console.error('[MQTT DentistService]: Failed to publish validation response:', err);
        } else {
          console.log(
            `[MQTT DentistService]: Response published to ${TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE(correlationId)}:`,
            responsePayload
          );
        }
      }
    );
  } catch (err) {
    console.error('[MQTT DentistService]: Error during credential validation:', err);
  }
};

// Handle incoming messages
mqttClient.on('message', async (topic, message) => {
  try {
    console.log(`[MQTT]: Raw message received from ${topic}:`, message.toString());

    // Parse the message payload
    const payload = JSON.parse(message.toString());

    // STEP 1: If this is a credential validation request from AuthService
    if (topic === TOPICS.SUBSCRIBE.CREDENTIAL_VALIDATION_REQUEST) {
      await handleCredentialValidation(payload);

    // STEP 2: Otherwise, handle the existing "addSlot" logic
    } else if (topic === TOPICS.SUBSCRIBE.DENTIST_CREATE_APP) {
      const { correlationId } = payload;

    //Retrieve thhe response topic and status
    const responseTopic: string = retrievePublishTopics(topic);
    const responseStatus: boolean = await getStatus(topic, payload);

    // Publish response
    const responsePayload = { correlationId, responseStatus };
    publishMessage(responseTopic, responsePayload);
    console.log(
      `[MQTT]: Response published to ${responseTopic}:`,
       responsePayload);

    } else {
      // No-op for unrecognized topics
      console.warn(`[MQTT]: Unknown topic: ${topic}`);
    }
  } catch (err) {
    console.error('[MQTT]: Error processing message:', err);
  }
});

// Default export of the MQTT client
export default mqttClient;
