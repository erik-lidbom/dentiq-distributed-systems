import mqtt, { IClientOptions } from 'mqtt';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { publishNotification } from '../mqtt/publish';
import dotenv from 'dotenv';
import { TOPICS } from '../mqtt/topics';

dotenv.config();

// MQTT Configuration
const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const TEST_TOPIC = TOPICS.PUBLISH.APPOINTMENT_CREATED_DENTIST;
const TEST_MESSAGE = {
  message: 'Appointment booked by dentist',
  createdAt: new Date().toISOString(),
};

/**
 * Integration tests for publishing messages through HiveMQ.
 */

describe('Integration Test: publishNotification', () => {
  let client: mqtt.MqttClient;

  beforeAll(async () => {
    // Connects to the HiveMQ broker
    client = mqtt.connect(mqttConnOptions); // Replace with your broker URL

    // Establishing connection
    await new Promise<void>((resolve, reject) => {
      client.once('connect', () => {
        console.log('Connected to MQTT broker');
        resolve();
      });
      client.once('error', reject);
    });
  });

  // Disconnect after running all tasks
  afterAll(async () => {
    if (client) {
      await new Promise<void>((resolve) => {
        client.end(false, () => {
          console.log('MQTT client disconnected');
          resolve();
        });
      });
    }
  });

  it('shall successfully publish a notification to the topic', async () => {
    // Simulate a message received from broker
    const message = JSON.stringify(TEST_MESSAGE);

    // Listens to the same topic to verify that the message has been published
    const messageReceived = new Promise<void>((resolve) => {
      client.subscribe(TEST_TOPIC, (err) => {
        if (err) {
          console.error('Error subscribing:', err);
          return;
        }
        client.once('message', (topic, payload) => {
          if (topic === TEST_TOPIC) {
            expect(JSON.parse(payload.toString())).toEqual(TEST_MESSAGE);
            resolve();
          }
        });
      });
    });

    // Publish notification
    await publishNotification(client, TEST_TOPIC, message);

    // Verifies that the message was received
    await messageReceived;
  });

  it('should reject with an error if the MQTT client is not connected', async () => {
    // Simulates a disconnected client by closing the client
    client.end();

    // Makes sure that the client is closed
    await new Promise<void>((resolve, reject) => {
      client.on('close', resolve);
      client.on('error', reject);
    });

    // Verifies that the client is disconnected
    expect(client.connected).toBe(false);

    // The publishNotification shall reject with an error
    await expect(
      publishNotification(client, TEST_TOPIC, TEST_MESSAGE)
    ).rejects.toThrowError(
      expect.objectContaining({
        message: expect.stringContaining('MQTT client not connected'),
      })
    );
  });
});
