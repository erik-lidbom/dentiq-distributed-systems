import supertest from "supertest";
import { app, server } from "../app";
import mongoose, { Types } from "mongoose";
import mqttClient from "../mqtt/mqtt";
import { Appointment } from "../models/appointmentModel";

const request = supertest(app);
let createdAppointmentId: string;

afterEach(async () => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  mqttClient.end(true); // Ensure MQTT client is closed after tests
  await mongoose.connection.close();
  server.close();
  jest.resetAllMocks();
});

const EXAMPLE_APPOINTMENT = {
  dentistId: "erik123@gmail.com",
  start_time: "this is a mock message",
  end_time: "appointmentService",
};


/**
 * Tests for creating appointments, including the following:
 * positives:
 *  - createAppointment(201) => appointment successfully created
 * negatives:
 *  - createAppointment(400) => missing required fields
 *  - createAppointment(500) => db down
 */
describe("API for APPOINTMENT-SERVICE", () => {

  describe("POST /api/appointments", () => {
    it("should return status 201 if appointment is created", async () => {

      const response = await request.post("/api/appointments").send({
        dentistId: "1",
        start_time: "1",
        end_time: "2",
      });
      jest.spyOn(Appointment.prototype, 'save').mockResolvedValue(response);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message");

      const message = response.body.message;
      createdAppointmentId = message.split(":")[1]?.trim();
      expect(response.body.message).toMatch(
        `Appointment successfully created with id: ${createdAppointmentId}`
      );
    });

    it("should return status 400 for missing required fields", async () => {
      const response = await request.post("/api/appointments").send({
        dentistId: "1",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch("Missing required field(s).");
    });

    it("should return status 500 if MongoDB is down", async () => {
        jest.spyOn(Appointment.prototype, "save").mockRejectedValueOnce(new Error("Database connection failed"));


      const response = await request.post("/api/appointments").send({
        dentistId: "1",
        start_time: "1",
        end_time: "2",
      });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(
        "An unexpected error occured, please try again"
      );
      expect(response.body).toHaveProperty("error");
    });
  });

  /**
   * Tests for booking appointments, including the following:
   * positives:
   *  - bookAppointment(200) => appointment booked successfully
   * negatives:
   *  - bookAppointment(400) => missing required fields
   *  - bookAppointment(404) => appointment not found
   *  - bookAppointment(400) => appointment already booked
   *  - bookAppointment(500) => db down
   */
  describe("PATCH /api/bookAppointment", () => {
    it("should book appointment with valid data", async () => {
      const response = await request.patch("/api/bookAppointment").send({
        patientId: "1",
        appointmentId: createdAppointmentId,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(
        `Appointment successfully booked with id: ${createdAppointmentId}`
      );
    });

    it("should return status 400 for missing required fields", async () => {
      const response = await request.patch("/api/bookAppointment").send({
        patientId: "1",
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch("Missing required field(s).");
    });

    it("should return status 404 appointment not found", async () => {
        const randomId = new Types.ObjectId().toHexString();
        const response = await request.patch("/api/bookAppointment").send({
        patientId: "1",
        appointmentId: randomId,
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch("Appointment could not be found.");
    });

    it("should return status 400 appointment already booked", async () => {
      const response = await request.patch("/api/bookAppointment").send({
        patientId: "1",
        appointmentId: createdAppointmentId,
      });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch("Appointment already booked. ");
    });

    it('should return status 500 unexpected error', async () => {
        await Appointment.findByIdAndUpdate(createdAppointmentId, { status: 'unbooked' });
        const randomId = new Types.ObjectId().toHexString();
        jest.spyOn(Appointment.prototype, "save").mockRejectedValueOnce(new Error("Database error"));
        const response = await request.patch("/api/bookAppointment").send({
            patientId: randomId,
            appointmentId: createdAppointmentId
        });

        expect(response.status).toBe(500);

        expect(response.body).toHaveProperty("message");
        expect(response.body.message).toMatch(
          "An unexpected error occured, please try again"
        );
        expect(response.body).toHaveProperty("error");
    }) 
  });

  /**
   * Tests for deleting appointments, including the following:
   * positives:
   *  - deleteAppointment(200) => appointment deleted
   * negatives:
   *  - deleteAppointment(400) => missing required field
   *  - deleteAppointment(404) => appointment not found
   *  - deleteAppointment(500) => db down
   */
  describe("DELETE /api/deleteAppointment", () => {
    it("should return 200 if appointment is deleted", async () => {
      const response = await request.delete("/api/deleteAppointment").send({
        appointmentId: createdAppointmentId,
      });
      // yo
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(
        `Appointment deleted with id: ${createdAppointmentId}`
      );
    });

    it('should return 400 if there are missing fields', async () => {
        const response = await request.delete('/api/deleteAppointment').send({
            appointmentId: null
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch('Missing required field.');
    });

    it('should return 404 if appointment is not found', async () => {
        const randomId = new Types.ObjectId().toHexString();
        const response = await request.delete('/api/deleteAppointment').send({
            appointmentId: randomId
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(`Appointment with id: ${randomId} not found`);
    });

    it('should return 500 if db is down', async () => {
        const dentistId = new Types.ObjectId().toHexString()
        const testAppointment = await Appointment.create({
            dentistId: dentistId,
            start_time: 1,
            end_time: 2,
            status: 'unbooked'
        });
        jest.spyOn(Appointment, "deleteOne").mockRejectedValueOnce(new Error("Database error"));
        const response = await request.delete('/api/deleteAppointment').send({
            appointmentId: testAppointment._id.toHexString()
        });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('error');
        expect(response.body.message).toMatch(
          'An unexpected error occured, please try again'
        );
    });

    
  });
  /**
   * Tests for GET appointments, including the following:
   * positives:
   *  - getAppointment(200) => appointment found
   * negatives:
   *  - getAppointment(400) => missing required field
   *  - getAppointment(404) => appointment not found
   *  - getAppointment(500) => db down
   */
  describe('GET /api/getAppointment', () => {
    it('should return status 400 if appointmentId is missing', async () => {
        const response = await request.get('/api/getAppointment');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch('Missing required field.');
    });

    it('should return status 404 if appointment not found', async () => {
        const randomAppId = new Types.ObjectId().toHexString();
        const response = await request.get(`/api/getAppointment?appointmentId=${randomAppId}`)

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(`Could not find appointment with ID: ${randomAppId}`);
    });

    it('should return status 200 if appointment is found', async () => {
        const mockAppointment = await Appointment.create({
            dentistId: new Types.ObjectId().toHexString(),
            start_time: 1,
            end_time: 2,
            status: 'unbooked',
        });
        jest.spyOn(Appointment, 'findById').mockResolvedValue(mockAppointment);
        const response = await request.get(`/api/getAppointment?appointmentId=${mockAppointment._id}`);

        expect(response.status).toBe(200);
    });

    it('should return status 500 if db is down', async () => {
        const mockAppointment = await Appointment.create({
            dentistId: new Types.ObjectId().toHexString(),
            start_time: 1,
            end_time: 2,
            status: 'unbooked',
        });
        jest.spyOn(Appointment, 'findById').mockRejectedValueOnce(new Error("Database down."));
        const response = await request.get(`/api/getAppointment?appointmentId=${mockAppointment._id}`);
        
        expect(response.status).toBe(500);

    });
  });
  /**
   * Tests for cancelling appointments, including the following:
   * positives:
   *  - cancelAppointment(200) => appointment cancelled successfully
   * negatives:
   *  - cancelAppointment(400) => missing required field
   *  - cancelAppointment(404) => appointment not found
   *  - cancelAppointment(500) => db down
   */
  describe('PATCH /api/cancelAppointment', () => {
    it('should return status 400 if appointment id is missing', async () => {
        const response = await request.patch('/api/cancelAppointment').send({
            appointmentId: null
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch('Missing required field.')
    }); 

    it('should return status 404 if appointment is not found', async () => {
        const randomAppId = new Types.ObjectId().toHexString();
        const response = await request.patch('/api/cancelAppointment').send({
            appointmentId: randomAppId
        });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(`Could not find appointment with ID: ${randomAppId}`);
    });

    it('should return status 200 if appointment is cancelled', async () => {
        const mockAppointment = await Appointment.create({
            dentistId: new Types.ObjectId().toHexString(),
            start_time: 1,
            end_time: 2,
            status: 'unbooked',
        });
        jest.spyOn(Appointment, 'findById').mockResolvedValue(mockAppointment);
        jest.spyOn(Appointment.prototype, 'save').mockResolvedValue(mockAppointment)
        const response = await request.patch('/api/cancelAppointment').send({
            appointmentId: mockAppointment._id.toHexString()
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(`Appointment with ID successfully canceled: ${mockAppointment._id.toHexString()}`);
    });

    it('should return status 500 if db is down', async () => {
        const mockAppointment = await Appointment.create({
            dentistId: new Types.ObjectId().toHexString(),
            start_time: 1,
            end_time: 2,
            status: 'unbooked',
        });

        jest.spyOn(Appointment, 'findById').mockRejectedValueOnce(new Error("Database down."));
        const response = await request.patch('/api/cancelAppointment').send({
            appointmentId: mockAppointment._id.toHexString()
        })

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('error');
        expect(response.body.message).toMatch('An unexpected error occured, please try again')

    })
  });
});
  /**
   * Tests for API routes in general, including the following:
   * positives:
   *  - '/'(200) => route valid
   * negatives:
   *  - '/invalidRoute(404) => invalid route

   */
describe('Testing API routes', () => {
    it('should return status 200 for a valid route', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
        expect(response.text).toMatch('BASIC MQTT + EXPRESS + NODE + TS SETUP');
    });

    it("should return 404 for an invalid route", async () => {
        const response = await request.get("/invalidRoute");
        expect(response.status).toBe(404);
    });
})