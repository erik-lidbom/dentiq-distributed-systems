import { createLogger, format, transports } from 'winston';
import 'winston-mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGO_URI) {
  throw new Error('[ERROR] Mongo URI Environment Variable Missing.');
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp, ...metadata }) => {
      const serviceName = metadata.serviceName;
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${serviceName}`;
    })
  ),
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: process.env.MONGO_URI,
      collection: 'logs',
    }),
    new transports.Console(),
  ],
});

export default logger;
