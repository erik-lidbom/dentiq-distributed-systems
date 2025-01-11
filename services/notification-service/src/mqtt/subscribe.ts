import { client } from './mqtt';
import { TOPICS } from './topics';

export const subscribeTopics = async () => {
  client?.subscribe(TOPICS.SUBSCRIBE.APPOINTMENT_CREATED, (err) => {
    if (!err) {
      console.log(`Subscribed to ${TOPICS.SUBSCRIBE.APPOINTMENT_CREATED}`);
      return;
    }
    console.error('MQTT Subscription error:', err);
  });
  client?.subscribe(TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED, (err) => {
    if (!err) {
      console.log(`Subscribed to ${TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED}`);
      return;
    }
    console.error('MQTT Subscription error:', err);
  });
  client?.subscribe(
    TOPICS.SUBSCRIBE.APPOINTMENT_PATIENT_CANCEL_CONFIRMATION,
    (err) => {
      if (!err) {
        console.log(
          `Subscribed to ${TOPICS.SUBSCRIBE.APPOINTMENT_PATIENT_CANCEL_CONFIRMATION}`
        );
        return;
      }
      console.error('MQTT Subscription error:', err);
    }
  );
  client?.subscribe(
    TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION,
    (err) => {
      if (!err) {
        console.log(
          `Subscribed to ${TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION}`
        );
        return;
      }
      console.error('MQTT Subscription error:', err);
    }
  );
  client?.subscribe(
    TOPICS.SUBSCRIBE.APPOINTMENT_GET_NOTIFICATIONS,
    (err) => {
      if (!err) {
        console.log(
          `Subscribed to ${TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION}`
        );
        return;
      }
      console.error('MQTT Subscription error:', err);
    }
  );
};
