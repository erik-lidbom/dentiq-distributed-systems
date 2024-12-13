import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import dotenv from 'dotenv';
import { TOPICS } from './topics';
import {
  createAppointment,
  bookAppointment,
  cancelAppointment,
  deleteAppointment,
  Message_Status_Message,
  NotificationPayload,
} from '../controllers/appointmentController';

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
      TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ,
      TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ,
      TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ,
      TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ,
      'dentiq/appointmentService/API_GATEWAY/bookAppointment',
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
          TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ,
          TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ,
          TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ,
          TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ,
          'dentiq/appointmentService/API_GATEWAY/bookAppointment'
        );
      }
    }
  );
});

mqttClient.on('message', async (topic, message) => {
  try {
    console.log(`[MQTT]: Message recieved from ${topic}:`, message.toString());
    const messageAndTopic = await appendToDatabase(topic, message);
    console.log('1. ', topic, message.toString());
    const topicsAndMessage = await whereToPublish(messageAndTopic);
    console.log('5. ', topicsAndMessage);
    await publishMessage(topicsAndMessage);
  } catch (error) {
    console.error(`[MQTT]: Error processing message from ${topic}:`, error);
  }
});

export default mqttClient;

const appendToDatabase = async (
  topic: string,
  message: Buffer
): Promise<Message_Status_Message> => {
  try {
    let result;
    switch (topic) {
      case TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ:
        result = await createAppointment(message);
        break;
      case TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ:
        result = await deleteAppointment(message);
        break;
      case TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ:
        result = await bookAppointment(message);
        break;
      case TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ:
        result = await cancelAppointment(message);
        break;
      default:
        result = {
          status: 404,
          message: 'Resource not found',
        };
        break;
    }
    return result;
  } catch (error) {
    console.error(
      `[appendToDatabase]: Error processing topic ${topic}:`,
      error
    );
    return {
      status: 500,
      message: 'Internal server error, unable to process the request',
    };
  }
};

type topicsAndMessage = {
  topics: string[];
  resPayload: Message_Status_Message;
};

const whereToPublish = async (
  resPayload: Message_Status_Message
): Promise<topicsAndMessage> => {
  console.log('2 :');
  const publishPayload = resPayload;
  let publishTopics: string[] = [];
  if (publishPayload.notificationPayload) {
    const hasError = publishPayload.notificationPayload.error;
    const typeOfNotification =
      publishPayload.notificationPayload.typeOfNotification;
    if (typeOfNotification) {
      switch (typeOfNotification) {
        case 'AppointmentCreated':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.DENTIST_CREATE_APP_GATEWAY];
            break;
          }
          // dentist create app -> dentiq/appointmentService/API_GATEWAY/createAppointment
          publishTopics = [
            TOPICS.APPOINTMENT.DENTIST_CREATE_APP_GATEWAY,
            TOPICS.APPOINTMENT.APPOINTMENT_CREATED,
          ];
          break;
        case 'AppointmentBooked':
          console.log('3. We are out here bitch');
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.PATIENT_BOOK_APP_GATEWAY];
            break;
          }
          // dentiq/appointmentService/API_GATEWAY/bookAppointment
          publishTopics = [
            TOPICS.APPOINTMENT.PATIENT_BOOK_APP_GATEWAY,
            TOPICS.APPOINTMENT.APPOINTMENT_BOOKED,
          ];
          break;
        case 'AppointmentDeleted':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.DENTIST_DELETE_APP_GATEWAY];
            break;
          }
          // dentiq/appointmentService/API_GATEWAY/deleteAppointment
          publishTopics = [
            TOPICS.APPOINTMENT.DENTIST_DELETE_APP_GATEWAY,
            TOPICS.APPOINTMENT.DENTIST_DELETE_SLOT,
          ];
          break;
        case 'AppointmentCancelled':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.PATIENT_CANCEL_APP_GATEWAY];
            break;
          }
          // dentiq/appointmentService/API_GATEWAY/cancelAppointment
          publishTopics = [
            TOPICS.APPOINTMENT.PATIENT_CANCEL_APP_GATEWAY,
            TOPICS.APPOINTMENT.PATIENT_CANCEL_SLOT,
          ];
          break;
        default:
          publishTopics = ['dentiq/appointmentService/API_GATEWAY/ISE'];
          break;
      }
    }
  }
  const topicsAndMessage = {
    topics: publishTopics,
    resPayload: publishPayload,
  };
  console.log('4: ', topicsAndMessage.topics, topicsAndMessage.resPayload);
  return topicsAndMessage;
};

const publishMessage = async (
  publishPayload: topicsAndMessage
): Promise<void> => {
  if (!mqttClient.connected) {
    console.error('[MQTT]: Client not connected, cannot publish messages');
    return;
  }

  console.log('6. WE ARE HERE');
  const { topics, resPayload } = publishPayload;
  console.log('Publishing to topics:', topics);
  if (!topics || topics.length === 0 || !topics[0]) {
    console.error('[MQTT]: No valid topics to publish to.');
    return;
  }

  console.log(
    'Payload for first topic:',
    JSON.stringify({
      status: resPayload.status,
      message: resPayload.message,
    })
  );

  if (resPayload.notificationPayload) {
    console.log(
      'Payload for second topic:',
      JSON.stringify(resPayload.notificationPayload)
    );
  }
  console.log(topics, resPayload);
  console.log('7. ');
  console.log('8. the TOPIC: ', topics[0]);
  mqttClient.publish(
    topics[0],
    JSON.stringify({
      status: resPayload.status,
      message: resPayload.message,
    }),
    (err) => {
      if (err) {
        console.error(`[MQTT]: Error publishing to topic ${topics[0]}:`, err);
      } else {
        console.log(`[MQTT]: Successfully published to topic ${topics[0]}`);
      }
    }
  );

  if (resPayload.notificationPayload && topics[1]) {
    mqttClient.publish(
      topics[1],
      JSON.stringify(resPayload.notificationPayload),
      (err) => {
        if (err) {
          console.error(`[MQTT]: Error publishing to topic ${topics[1]}:`, err);
        } else {
          console.log(`[MQTT]: Successfully published to topic ${topics[1]}`);
        }
      }
    );
  }
};
