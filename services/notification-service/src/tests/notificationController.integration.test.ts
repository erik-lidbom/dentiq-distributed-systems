import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { createNotification } from '../controllers/controller'; // Adjust the path as necessary
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.setTimeout(30000);

let mongoServer: MongoMemoryServer;
/*
 * Tests for creating a notification and sotiring in database
 */

// Mock test data
const TEST_DATA = {
  email: 'testuser@example.com',
  message: 'This is a test notification.',
  senderService: 'testService',
  patientId: '123',
  dentistId: '456',
};
describe('Integration Test: createNotification', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    // Connects to an in-memory MongoDB instance
  });

  afterAll(async () => {
    // Disconnects from the database after running all tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create and save a notification successfully', async () => {
    // Create a notification document by calling creatingNotification
    const savedNotification = await createNotification(TEST_DATA);

    // Check if the notification was successfully stored and returned
    expect(savedNotification).toHaveProperty('_id');
    expect(savedNotification.email).toBe('testuser@example.com');
    expect(savedNotification.message).toBe('This is a test notification.');
    expect(savedNotification.senderService).toBe('testService');
    expect(savedNotification.patientId).toBe('123');
    expect(savedNotification.dentistId).toBe('456');
  });

  it('shall throw an error if data is invalid', async () => {
    // Calls createNotification with invalid data (e.g., invalid JSON in Buffer)
    const invalidData = Buffer.from('invalid data');

    //Checks if the error is thrown
    await expect(createNotification(invalidData)).rejects.toThrow();
  });
});
