import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { TOPICS } from './topics';

dotenv.config();

const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

mqttClient.on('connect', () => {
  console.log('[MQTT]: Successfully connected to the broker!');

  mqttClient.subscribe(
    [
      TOPICS.APPOINTMENT.DENTIST_AWAIT_CONF,
      TOPICS.APPOINTMENT.PATIENT_AWAIT_CONFIRMATION,
    ],
    (err) => {
      if (err) {
        console.error(
          '[MQTT]: Could not establish subscription connection: ',
          err
        );
      } else {
        console.log(
          '[MQTT]: Subscribed to topic(s)',
          TOPICS.APPOINTMENT.APPOINTMENT_CREATED,
          TOPICS.APPOINTMENT.PATIENT_AWAIT_CONFIRMATION
        );
        console.log('-------------------------------------------------------');
      }
    }
  );
});

mqttClient.on('message', (topic, message) => {
  console.log(`[MQTT]: Message recieved from ${topic}:`, message.toString());
});

export default mqttClient;
