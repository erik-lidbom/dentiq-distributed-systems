import { client } from './mqtt';
import { TOPICS } from './topics';

const subscriptionTopics = [
  TOPICS.SUBSCRIBE.APPOINTMENT_CREATED,
  TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED,
  TOPICS.SUBSCRIBE.APPOINTMENT_PATIENT_CANCEL_CONFIRMATION,
  TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION,
  TOPICS.SUBSCRIBE.APPOINTMENT_GET_NOTIFICATIONS,
];

export const subscribeTopics = async () => {
  subscriptionTopics.map((topic: string) => {
    client?.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
      } else {
        console.log(
          '[MQTT]: Subscribed to topics:',
          subscriptionTopics.join(', ')
        );
      }
    });
  });
};
