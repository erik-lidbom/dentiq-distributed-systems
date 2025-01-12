import mqtt from 'mqtt/*';
import { client } from './mqtt';
import { TOPICS } from './topics';

/*
 * Publishes all the messages parallel. The method retrieves the message and timestamp *field that will be sent to the client
 */
export const publishToAllTopics = async (
  topics: string[],
  data: any
): Promise<void> => {
  try {
    if (topics.length === 0)
      throw new Error('Something went wrong! No topics to publish to');

    const { message, createdAt } = data;
    //Extract the appropiated message that should be messaged out
    const messageStringified = JSON.stringify({
      message,
      createdAt,
    });

    await Promise.all(
      topics.map((topic: string) => {
        // Checks if the receiving topic is a get request or not.

        topic ===
        `${TOPICS.PUBLISH.APPOINTMENT_GET_NOTIFICATIONS}/${data.correlationId}`
          ? publishNotification(
              client,
              topic,
              JSON.stringify({ status: 200, message: data.notifications })
            )
          : publishNotification(client, topic, messageStringified);
      })
    );
  } catch (error) {
    console.log(error);
  }
};

// Method to publish a notification
export const publishNotification = async (
  client: mqtt.MqttClient,
  topic: string,
  message: any
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!client.connected) {
      console.log('MQTT client not connected.');
      client.reconnect();
      return reject(new Error('MQTT client not connected'));
    }
    client.publish(topic, message, { qos: 2 }, (error) => {
      if (error) {
        console.error('MQTT Publish error:', error);
        return reject(error);
      }
      console.log(`MQTT message published to ${topic}`);
      return resolve();
    });
  });
};
