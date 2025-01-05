import {
    createPatient,
    deletePatient,
    getPatient,
    patchPatient,
    handleCredentialValidation,
  } from '../controllers/patientController';
  import { Patient } from '../models/patientSchema';
  import mqttClient from '../mqtt/mqtt';
  import { TOPICS } from '../mqtt/topics';
  import { Request, Response, NextFunction } from 'express';
  
  // Mock the dependencies
  jest.mock('../models/patientSchema');
  jest.mock('../mqtt/mqtt', () => ({
    publish: jest.fn((topic, message, options, callback) => {
      // Simulate successful publish callback
      if (callback) callback(null);
    }),
    on: jest.fn(),
  }));
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  
  // A helper to create mock Express Request/Response/Next
  function mockReqResNext() {
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;
  
    // Provide mock implementations of res.status and res.json
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
  
    return { req, res, next };
  }
  
  describe('PATIENT-SERVICE CONTROLLER', () => {

    //create patient
    describe('createPatient()', () => {
      it('should return 400 if required fields are missing', async () => {
        const { req, res, next } = mockReqResNext();
  
        // Missing Lastname, password, email
        req.body = {
          Personnummer: '123456-7890',
          Firstname: 'Test',
        };
  
        await createPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Missing required field(s).',
          })
        );
      });
  
      it('should return 201 and publish MQTT message on successful create', async () => {
        const { req, res, next } = mockReqResNext();
  
        req.body = {
          Personnummer: '123456-7890',
          Firstname: 'Test',
          Lastname: 'Test2',
          password: 'somePassword',
          email: 'Test.test2@example.com',
        };
  
        // Mock Patient.save() success
        (Patient as any).mockImplementationOnce(function (this: any, data: any) {
          Object.assign(this, data);
        });
        (Patient.prototype.save as jest.Mock).mockResolvedValueOnce({
          _id: 'mockPatientId',
          ...req.body,
        });
        await createPatient(req, res, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'New patient registered successfully',
            patient: expect.objectContaining({
              _id: 'mockPatientId',
              Firstname: 'Test',
              Lastname: 'Test2',
            }),
          })
        );
        // Check MQTT publish
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.PATIENT_REGISTERED,
          expect.any(String),
          { qos: 2 },
          expect.any(Function)
        );
      });
  
      it('should return 409 if MongoError code 11000 (duplicate key)', async () => {
        const { req, res, next } = mockReqResNext();
  
        req.body = {
          Personnummer: '111111-1111',
          Firstname: 'Ut',
          Lastname: 'Test2',
          password: 'somePassword',
          email: 'ut.test2@example.com',
        };
  
        (Patient.prototype.save as jest.Mock).mockRejectedValueOnce({
          code: 11000,
          keyValue: { email: 'ut.test2@example.com' },
        });
  
        await createPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining("Duplicate value for field 'email'"),
          })
        );
      });
  
      it('should return 500 on unexpected errors', async () => {
        const { req, res, next } = mockReqResNext();
  
        req.body = {
          Personnummer: '222222-2222',
          Firstname: 'Error',
          Lastname: 'User',
          password: 'brokenPassword',
          email: 'error.user@example.com',
        };
  
        (Patient.prototype.save as jest.Mock).mockRejectedValueOnce(
          new Error('DB error')
        );
  
        await createPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'An unexpected error occurred.',
          })
        );
      });
    });
  
    //delete patient
    describe('deletePatient()', () => {
      it('should return 400 if patientId is missing', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = {};
  
        await deletePatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Missing required field: patientId.',
          })
        );
      });
  
      it('should return 404 if patient not found', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = { patientId: 'nonExistingId' };
  
        (Patient.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);
  
        await deletePatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Patient not found.',
          })
        );
      });
  
      it('should return 200 if deletion is successful', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = { patientId: 'existingId' };
  
        (Patient.findByIdAndDelete as jest.Mock).mockResolvedValueOnce({
          _id: 'existingId',
          Personnummer: '123456-7890',
        });
  
        await deletePatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Patient deleted',
            patientId: 'existingId',
          })
        );
      });
  
      it('should return 500 on unexpected error', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = { patientId: 'someId' };
  
        (Patient.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(
          new Error('DB error')
        );
  
        await deletePatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'An unexpected error occurred.',
          })
        );
      });
    });
  
    //get patient
    describe('getPatient()', () => {
      it('should return 400 if patientId query is missing', async () => {
        const { req, res, next } = mockReqResNext();
        req.query = {};
  
        await getPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Missing required field: patientId.',
          })
        );
      });
  
      it('should return 404 if no patient found', async () => {
        const { req, res, next } = mockReqResNext();
        req.query = { patientId: 'nonExistingId' };
  
        (Patient.findById as jest.Mock).mockResolvedValueOnce(null);
  
        await getPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Patient not found.',
          })
        );
      });
  
      it('should return 200 and the patient data if found', async () => {
        const { req, res, next } = mockReqResNext();
        req.query = { patientId: 'existingId' };
  
        (Patient.findById as jest.Mock).mockResolvedValueOnce({
          _id: 'existingId',
          Firstname: 'Test',
          Lastname: 'Test2',
        });
  
        await getPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          _id: 'existingId',
          Firstname: 'Test',
          Lastname: 'Test2',
        });
      });
  
      it('should return 500 on unexpected error', async () => {
        const { req, res, next } = mockReqResNext();
        req.query = { patientId: 'errorId' };
  
        (Patient.findById as jest.Mock).mockRejectedValueOnce(
          new Error('DB error')
        );
  
        await getPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'An unexpected error occurred.',
          })
        );
      });
    });
  
   // patch patient
    describe('patchPatient()', () => {
      it('should return 400 if patientId or updates are missing', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = {};
  
        await patchPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Missing required field(s).',
          })
        );
      });
  
      it('should return 404 if patient to update is not found', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = {
          patientId: 'nonExistingId',
          updates: { Firstname: 'Ut' },
        };
  
        (Patient.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
  
        await patchPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Patient not found.',
          })
        );
      });
  
      it('should return 200 and the updated patient if successful', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = {
          patientId: 'existingId',
          updates: { Firstname: 'Ut', Lastname: 'Johnson' },
        };
  
        (Patient.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce({
          _id: 'existingId',
          Firstname: 'Ut',
          Lastname: 'Johnson',
        });
  
        await patchPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Patient updated',
            patient: {
              _id: 'existingId',
              Firstname: 'Ut',
              Lastname: 'Johnson',
            },
          })
        );
      });
  
      it('should return 500 on unexpected error', async () => {
        const { req, res, next } = mockReqResNext();
        req.body = {
          patientId: 'errorId',
          updates: { Firstname: 'ErrorCase' },
        };
  
        (Patient.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(
          new Error('DB error')
        );
  
        await patchPatient(req, res, next);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'An unexpected error occurred.',
          })
        );
      });
    });
  
    // handle credential
    describe('handleCredentialValidation()', () => {
      // Helper: mock the Patient.findOne result
      const mockPatient = {
        _id: 'mockedPatientId',
        email: 'test@example.com',
        password: 'testpassword',
      };
  
      it('should throw an error if missing email, password, or correlationId', async () => {
        const invalidPayload = { email: 'test@example.com', password: 'testpass' };
        // correlationId missing
  
        await expect(handleCredentialValidation(invalidPayload)).rejects.toThrow(
          'Invalid payload: Missing required fields'
        );
      });
  
      it('should publish a success response if patient is found', async () => {
        (Patient.findOne as jest.Mock).mockResolvedValueOnce(mockPatient);
  
        const payload = {
          email: 'test@example.com',
          password: 'testpassword',
          correlationId: 'corId123',
        };
  
        await handleCredentialValidation(payload);
  
        // Check that findOne was called properly
        expect(Patient.findOne).toHaveBeenCalledWith({
          email: payload.email,
          password: payload.password,
        });
  
        // Check MQTT publish for success
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE(payload.correlationId),
          JSON.stringify({
            correlationId: 'corId123',
            success: true,
            message: 'Credentials validated successfully.',
          }),
          { qos: 2 },
          expect.any(Function)
        );
      });
  
      it('should publish a failure response if patient is NOT found', async () => {
        (Patient.findOne as jest.Mock).mockResolvedValueOnce(null);
  
        const payload = {
          email: 'wrong@example.com',
          password: 'wrongPassword',
          correlationId: 'corIdFail',
        };
  
        await handleCredentialValidation(payload);
  
        // Check that findOne was called properly
        expect(Patient.findOne).toHaveBeenCalledWith({
          email: 'wrong@example.com',
          password: 'wrongPassword',
        });
  
        // Check MQTT publish for failure
        expect(mqttClient.publish).toHaveBeenCalledWith(
          TOPICS.PUBLISH.CREDENTIAL_VALIDATION_RESPONSE('corIdFail'),
          JSON.stringify({
            correlationId: 'corIdFail',
            success: false,
            message: 'Invalid credentials.',
          }),
          { qos: 2 },
          expect.any(Function)
        );
      });
  
      it('should catch and log errors thrown during validation', async () => {
        // Simulate DB error
        (Patient.findOne as jest.Mock).mockRejectedValueOnce(
          new Error('Database error')
        );
  
        const payload = {
          email: 'error@example.com',
          password: 'fail',
          correlationId: 'corIdErr',
        };
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  
        await expect(handleCredentialValidation(payload)).rejects.toThrow('Database error');
  
        expect(consoleSpy).toHaveBeenCalledWith(
          '[MQTT]: Error during credential validation:',
          expect.any(Error)
        );
        consoleSpy.mockRestore();
      });
    });
  });
  