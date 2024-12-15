import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { TOPICS } from './topics';
import {
  dispatchByTopic,
  determinePublishTopics,
  publishToDestinations,
} from './filters';

dotenv.config();

const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

mqttClient.on('connect', () => {
  console.log('[MQTT]: Connection established.');

  mqttClient.subscribe(
    [
      TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ,
      TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ,
      TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ,
      TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ,
    ],
    (err) => {
      if (err) {
        console.error(
          '[MQTT]: Could not establish subscription connection: ',
          err
        );
      } else {
        console.log(
          '[MQTT]: Subscribing to the following topics:',
          '\nDENTIQ CREATE APPOINTMENT, DENTIQ BOOK APPOINTMENT,\nDENTIQ DELETE APPOINTMENT & DENTIQ CANCEL APPOINTMENT'
        );
      }
    }
  );
});

mqttClient.on('message', async (topic, message) => {
  try {
    console.log(`[MQTT]: Message received from ${topic}:`, message.toString());

    const responsePayload = await dispatchByTopic(topic, message);

    const topicsAndMessage = await determinePublishTopics(responsePayload);

    await publishToDestinations(topicsAndMessage);
  } catch (error) {
    console.error(`[MQTT]: Error processing message from ${topic}:`, error);
  }
});

export default mqttClient;
