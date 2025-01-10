import { client } from './mqtt';
import { TOPICS } from './mqttTopics';

export const subscribeToTopics = async () => {
  console.log('In here?');
  if (client) {
    const SUB_TOPICS = [
      TOPICS.SUBSCRIBE.PATIENT,
      TOPICS.SUBSCRIBE.DENTIST,
      TOPICS.SUBSCRIBE.CLINIC,
      TOPICS.SUBSCRIBE.NOTIFICATION,
      TOPICS.SUBSCRIBE.BOOKING,
      TOPICS.SUBSCRIBE.AUTH,
      TOPICS.SUBSCRIBE.GATEWAY,
    ];

    SUB_TOPICS.forEach((topic) => {
      client?.subscribe(topic, (err) => {
        if (!err) {
          return console.log(`[INFO]: Sucessfully subscribed to ${topic}`);
        } else if (err) {
          console.error('[ERROR] Failed to subscribe: ', err);
        }
      });
    });
  } else {
    console.error('[ERROR] No client intialized');
  }
};

/*


*/
