import { client } from './mqtt';
import { TOPICS } from './mqttTopics';

export const subscribeToTopics = async () => {
  if (client) {
    const SUB_TOPICS = [
      TOPICS.SUBSCRIBE.DENTIST,
      TOPICS.SUBSCRIBE.NOTIFICATION,
      TOPICS.SUBSCRIBE.NOTIFICATION_2,
      TOPICS.SUBSCRIBE.BOOKING,
      TOPICS.SUBSCRIBE.BOOKING_2,
      TOPICS.SUBSCRIBE.AUTH,
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
