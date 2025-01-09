// src/test/dentistController.test.ts
import {
    createDentist,
    getDentist,
    patchDentist,
    deleteDentist,
    queryDentists,
    queryClinics,
  } from '../controllers/dentistController';
  import { TOPICS } from '../mqtt/topics';
  
  /**
   * 1. Create a custom type so TypeScript knows our mock is a "constructor" function
   *    that also has static methods (findById, findByIdAndUpdate, etc.).
   */
  type TMockDentistConstructor = jest.Mock & {
    findById: jest.Mock<any, any>;
    findByIdAndUpdate: jest.Mock<any, any>;
    findByIdAndDelete: jest.Mock<any, any>;
    find: jest.Mock<any, any>;
  };
  
  // 2. Mock the Dentist model
  jest.mock('../models/dentistSchema', () => {
    // A. Create the mock constructor
    const mockDentistConstructor: TMockDentistConstructor = jest
      .fn()
      .mockImplementation((fields: any) => {
        // This object is what "new Dentist(fields)" returns
        return {
          ...fields,
          // doc-level .populate() 
          populate: jest.fn().mockReturnThis(),
          // doc-level .save()
          save: jest.fn().mockResolvedValue({
            _id: 'mockedDentistId',
            ...fields,
          }),
        };
      }) as unknown as TMockDentistConstructor;
  
    // B. Add static methods
    mockDentistConstructor.findById = jest.fn();
    mockDentistConstructor.findByIdAndUpdate = jest.fn();
    mockDentistConstructor.findByIdAndDelete = jest.fn();
    mockDentistConstructor.find = jest.fn();
  
    // C. Return an object containing our mock constructor
    return {
      Dentist: mockDentistConstructor,
    };
  });
  
  // 3. Mock the Clinic model
  jest.mock('../models/clinicSchema', () => ({
    Clinic: {
      find: jest.fn(),
    },
  }));
  
  // 4. Mock mqttClient as a named export
  jest.mock('../mqtt/mqtt', () => ({
    mqttClient: {
      publish: jest.fn(),
      on: jest.fn(),
    },
  }));
  
  describe('DENTIST-CONTROLLER TEST SUITE', () => {
    // Access the mocks in test code
    const { Dentist } = require('../models/dentistSchema');
    const { Clinic } = require('../models/clinicSchema');
    const { mqttClient } = require('../mqtt/mqtt');
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('createDentist()', () => {
      it('should publish 400 if required fields are missing', async () => {
        // Missing lastName, password, etc.
        const payload = { firstName: 'John' };
        await createDentist(payload);
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREATE_RESPONSE,
          expect.stringContaining('"status":400')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREATE_RESPONSE,
          expect.stringContaining('"Missing required fields"')
        );
      });
  
      it('should create a dentist and publish 201 on success', async () => {
        const payload = {
          personnummer: '123456-7890',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'secret123',
          clinic: 'clinicId',
        };
  
        await createDentist(payload);
  
        // Expect success publish
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREATE_RESPONSE,
          expect.stringContaining('"status":201')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREATE_RESPONSE,
          expect.stringContaining('"New dentist registered"')
        );
      });
      
      it('should publish 500 if save() rejects with an error', async () => {
        // Temporarily override the default mock constructor just for this test
        Dentist.mockImplementationOnce((fields: any) => {
          return {
            ...fields,
            populate: jest.fn().mockReturnThis(),
            save: jest.fn().mockRejectedValueOnce(new Error('DB error')),
          };
        });
  
        const payload = {
          personnummer: '999999-9999',
          firstName: 'Error',
          lastName: 'Case',
          email: 'error@example.com',
          password: 'fail',
        };
        await createDentist(payload);
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREATE_RESPONSE,
          expect.stringContaining('"status":500')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREATE_RESPONSE,
          expect.stringContaining('"DB error"')
        );
      });
    });
  
    describe('getDentist()', () => {
      it('should publish 400 if dentistId is missing', async () => {
        await getDentist({});
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"status":400')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"Missing required field: dentistId"')
        );
      });
  
      it('should publish 404 if dentist is not found', async () => {
        Dentist.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
        await getDentist({ dentistId: 'unknownId' });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"status":404')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"Dentist not found"')
        );
      });
  
      it('should publish 200 with the found dentist', async () => {
        Dentist.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue({ _id: 'dentist123' }),
        });
        await getDentist({ dentistId: 'dentist123' });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"status":200')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"dentist123"')
        );
      });
  
      it('should publish 500 if an error is thrown while retrieving', async () => {
        Dentist.findById.mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('DB error')),
        });
        await getDentist({ dentistId: 'errorId' });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"status":500')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.GET_RESPONSE,
          expect.stringContaining('"DB error"')
        );
      });
    });
  
    describe('patchDentist()', () => {
      it('should publish 400 if dentistId or updates are missing', async () => {
        await patchDentist({});
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"status":400')
        );
      });
  
      it('should publish 404 if dentist is not found for update', async () => {
        Dentist.findByIdAndUpdate.mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        });
        await patchDentist({ dentistId: 'missing', updates: { name: 'New' } });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"status":404')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"Dentist not found"')
        );
      });
  
      it('should publish 200 with the updated dentist', async () => {
        Dentist.findByIdAndUpdate.mockReturnValue({
          populate: jest.fn().mockResolvedValue({
            _id: 'updatedDentistId',
            name: 'UpdatedName',
          }),
        });
        await patchDentist({
          dentistId: 'updatedDentistId',
          updates: { name: 'UpdatedName' },
        });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"status":200')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"Dentist updated"')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"UpdatedName"')
        );
      });
  
      it('should publish 500 if update fails', async () => {
        Dentist.findByIdAndUpdate.mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('DB error')),
        });
        await patchDentist({ dentistId: 'failId', updates: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"status":500')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.UPDATE_RESPONSE,
          expect.stringContaining('"DB error"')
        );
      });
    });
  
    describe('deleteDentist()', () => {
      it('should publish 400 if dentistId is missing', async () => {
        await deleteDentist({});
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"status":400')
        );
      });
  
      it('should publish 404 if dentist is not found', async () => {
        Dentist.findByIdAndDelete.mockResolvedValueOnce(null);
        await deleteDentist({ dentistId: 'missingId' });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"status":404')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"Dentist not found"')
        );
      });
  
      it('should publish 200 if dentist is successfully deleted', async () => {
        Dentist.findByIdAndDelete.mockResolvedValueOnce({ _id: 'existingId' });
        await deleteDentist({ dentistId: 'existingId' });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"status":200')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"Dentist deleted"')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"existingId"')
        );
      });
  
      it('should publish 500 if delete fails', async () => {
        Dentist.findByIdAndDelete.mockRejectedValue(new Error('DB error'));
        await deleteDentist({ dentistId: 'errorId' });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"status":500')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.DELETE_RESPONSE,
          expect.stringContaining('"DB error"')
        );
      });
    });
  
    describe('queryDentists()', () => {
      it('should publish 404 if no dentists found', async () => {
        Dentist.find.mockResolvedValue([]);
        await queryDentists({ filters: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"status":404')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"No dentists found"')
        );
      });
  
      it('should publish 200 if dentists are found', async () => {
        Dentist.find.mockResolvedValue([{ _id: 'd1' }, { _id: 'd2' }]);
        await queryDentists({ filters: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"status":200')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"d1"')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"d2"')
        );
      });
  
      it('should publish 500 if querying fails', async () => {
        Dentist.find.mockRejectedValue(new Error('DB error'));
        await queryDentists({ filters: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"status":500')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.QUERY_RESPONSE,
          expect.stringContaining('"DB error"')
        );
      });
    });
  
    describe('queryClinics()', () => {
      it('should publish 404 if no clinics found', async () => {
        Clinic.find.mockResolvedValue([]);
        await queryClinics({ filters: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"status":404')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"No clinics found"')
        );
      });
  
      it('should publish 200 with clinics if found', async () => {
        Clinic.find.mockResolvedValue([{ _id: 'c1' }, { _id: 'c2' }]);
        await queryClinics({ filters: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"status":200')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"c1"')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"c2"')
        );
      });
  
      it('should publish 500 if clinics query fails', async () => {
        Clinic.find.mockRejectedValue(new Error('DB error'));
        await queryClinics({ filters: {} });
  
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"status":500')
        );
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
          expect.stringContaining('"DB error"')
        );
      });
    });
  });
  