import { client } from './mqtt';
import { TOPICS } from './mqttTopics';
import logger from '../logger/logger';

const SUB_TOPICS = {
  'patient/': true,
  'dentist/': true,
  'clinic/': true,
  'notification/': true,
  'booking/': true,
  'auth/': true,
  'gateway/': true,
}

export const messageHandler = () => {
  client.on('message', async (topic: string, message: Buffer) => {
    try {
      // Parse the payload once
      const payload = Buffer.isBuffer(message)
        ? JSON.parse(message.toString())
        : message;

      const serviceName = getServiceName(topic);

      const matchingTopic = Object.keys(SUB_TOPICS).find((key) => topic.startsWith(key));

      if(matchingTopic) {
        logTopicAndMessage(determineLogLevel(payload), topic, payload, serviceName)
      } else {
        logger.warn('Unknown topic received', { topic, payload, serviceName })
      }
    } catch (error) {
      logger.error('Error handling MQTT message', { topic, error });
    }
  });
};

// Method to determine what level of log to be added to logs (info, warn, error)
const determineLogLevel = (payload: any): string => {
  if (payload && payload.status) {
    const statusCode = payload.status;

    if (statusCode >= 200 && statusCode < 300) {
      return 'info';
    } else if (statusCode >= 400 && statusCode < 500) {
      return 'warn';
    } else if (statusCode >= 500) {
      return 'error';
    } else {
      return 'info';
    }
  }
  return 'warn';
};

// method to log 
const logTopicAndMessage = (logLevel: string, topic: string, payload: any, serviceName: string) => {
  if (['info', 'warn', 'error'].includes(logLevel)) {
    logger[logLevel as 'info' | 'warn' | 'error'](`log added for`, {
      serviceName,
      topic,
      payload,
    });
  } else {
    logger.warn(`Unknown log level: ${logLevel}`, { topic, payload });
  }
};

const getServiceName = (topic: string): string => {
  const match = topic.match(/^(\w+)\//);
  return match ? `${match[1]}-service` : 'unknown';
}
