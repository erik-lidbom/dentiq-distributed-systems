import mqtt, { MqttClient } from 'mqtt';

// Create an MQTT client
const client: MqttClient = mqtt.connect('mqtt://127.0.0.1:1883');

const wildcardTopic = '/PatientInterface/Notification';

// Connect to the MQTT broker
client.on('connect', () => {
  console.log('[Patient Interface]: Connected to MQTT broker');

  // Subscribe to all topics
  client.subscribe(wildcardTopic, (err: Error) => {
    if (err) {
      console.error(
        `[Patient Interface]: Failed to subscribe to ${wildcardTopic}`,
        err
      );
    } else {
      console.log(
        `[Patient Interface]: Subscribed to all topics using ${wildcardTopic}`
      );
    }
  });
});

// Listen for messages on any topic
client.on('message', (topic, message) => {
  console.log(`[Patient Interface]: Received message on topic "${topic}"`);
  console.log(`[Patient Interface]: Message payload: ${message.toString()}`);

  // Add your custom handling logic here
  // For example, save messages to a database or trigger specific workflows
});

// Handle connection errors
client.on('error', (err: Error) => {
  console.error('[Patient Service]: MQTT connection error', err);
});
