import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { createPublishTopics } from '../helpers/helpers';
import { TOPICS } from '../mqtt/topics';

import * as publishModule from '../mqtt/publish';
import { publishToAllTopics } from '../mqtt/publish';
import mqtt, { IClientOptions } from 'mqtt';

/**
 * Tests for creating topics to publish to and storing a notification into the database.
 */

// MQTT Configuration
const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || '8883', 10),
  protocol: 'mqtts',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

// Two instances of mockdata used in the test
const EXAMPLE_DOCUMENT = {
  email: 'erik123@gmail.com',
  message: 'this is a mock message',
  senderService: 'appointmentService',
  patientId: '1234',
  dentistId: '12345',
  _id: '6759eb8f70f0e23148e7218a',
  createdAt: new Date('2024-12-11T19:44:15.166Z'),
  updatedAt: new Date('2024-12-11T19:44:15.166Z'),
  __v: 0,
};

describe('shall return topics to publish to', () => {
  it('return topics for appointment created', () => {
    expect(
      createPublishTopics(
        TOPICS.SUBSCRIBE.APPOINTMENT_CREATED,
        EXAMPLE_DOCUMENT
      )
    ).toEqual(
      expect.arrayContaining([
        `${TOPICS.PUBLISH.APPOINTMENT_CREATED_DENTIST}/${EXAMPLE_DOCUMENT.dentistId}`,
        TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT,
      ])
    );
  });
  it('return topics for appointment booked', () => {
    expect(
      createPublishTopics(TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED, EXAMPLE_DOCUMENT)
    ).toEqual(
      expect.arrayContaining([
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT}/${EXAMPLE_DOCUMENT.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT}/${EXAMPLE_DOCUMENT.patientId}`,
      ])
    );
  });
  it('return topics for appointment cancelled by patient', () => {
    expect(
      createPublishTopics(
        TOPICS.SUBSCRIBE.APPOINTMENT_PATIENT_CANCEL_CONFIRMATION,
        EXAMPLE_DOCUMENT
      )
    ).toEqual(
      expect.arrayContaining([
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST}/${EXAMPLE_DOCUMENT.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT}/${EXAMPLE_DOCUMENT.patientId}`,
      ])
    );
  });
  it('return topics for appointment cancelled by dentist', () => {
    expect(
      createPublishTopics(
        TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION,
        EXAMPLE_DOCUMENT
      )
    ).toEqual(
      expect.arrayContaining([
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST}/${EXAMPLE_DOCUMENT.dentistId}`,
        TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT,
      ])
    );
  });
  it('return empty array when input unrecognized topic', () => {
    expect(
      createPublishTopics('dentiq/this/topic/is/unrecognized', EXAMPLE_DOCUMENT)
    ).toEqual(expect.arrayContaining([]));
  });
});

describe('publishToAllTopics', () => {
  let client: mqtt.MqttClient;

  beforeAll(async () => {
    // Setup MQTT client and connect to HiveMQ or your test broker
    client = mqtt.connect(mqttConnOptions); // Replace with your broker URL

    // Wait for the connection to establish
    await new Promise<void>((resolve, reject) => {
      client.on('connect', () => {
        console.log('Connected to MQTT broker');
        resolve();
      });
      client.on('error', reject);
    });
  });

  afterAll(() => {
    // Clean up after tests: disconnect from MQTT broker
    client.end();
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock history before each test
  });

  it('should call publishNotification for each topic and succeed', async () => {
    // Arrange: Spy on the publishNotification and mock it to resolve with undefined
    const spy = jest
      .spyOn(publishModule, 'publishNotification')
      .mockResolvedValueOnce(undefined);

    const topics = ['topic/appointment/created', 'topic/appointment/cancelled'];
    const message = 'Test message';

    // Act: Call the publishNotification function
    await publishModule.publishNotification(client, topics[0], message);

    // Assert: Ensure the mock was called with the correct arguments
    expect(spy).toHaveBeenCalledWith(client, topics[0], message); // Added client as the first argument
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call publishNotification if topics array is empty', async () => {
    // Arrange: Create an empty topics array
    const emptyTopics: string[] = [];

    // Spy on the publishNotification function
    const publishNotificationSpy = jest.spyOn(
      publishModule,
      'publishNotification'
    );

    // Act: Call the function with an empty topics array
    await publishToAllTopics(emptyTopics, {
      message: 'Test message',
      createdAt: new Date(),
    });

    // Assert: Ensure publishNotification was never called
    expect(publishNotificationSpy).not.toHaveBeenCalled();

    // Clean up: Restore the original function
    publishNotificationSpy.mockRestore();
  });
});
