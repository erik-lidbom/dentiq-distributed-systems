import supertest from 'supertest';
import { app, server } from '../app'
import mongoose from 'mongoose';
import mqttClient from '../mqtt/mqtt';

const request = supertest(app)

let createdAppointmentId: any;

afterAll(async () => {
    mqttClient.end(true); // Ensure MQTT client is closed after tests
    await mongoose.connection.close()
    server.close();
});

/**
 * Tests for creating appointments, including the following:
 * positives:
 *  - createAppointment(201) => appointment successfully created
 * negatives:
 *  - createAppointment(400) => missing required fields
 */
describe('POST /api/appointments', () => {
    it('should create a new appointment with valid data', async () => {
        const response = await request.post('/api/appointments').send({
            dentistId: '1',
            start_time: '1',
            end_time: '2'
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message');

        const message = response.body.message;
        createdAppointmentId = message.split(':')[1]?.trim();
        console.log(createdAppointmentId);
        expect(response.body.message).toMatch(`Appointment successfully created with id: ${createdAppointmentId}`)
        
    });

    it('should return status 400 for missing required fields', async () => {
        const response = await request.post('/api/appointments').send({
            dentistId: '1'
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toMatch('Missing required field(s).')
    });

    it('should return status 500 if MongoDB is down', async () => {
        // not working yet
        const response = await request.post('/api/appointments').send({
            dentistId: '1',
            start_time: '1',
            end_time: '2'
        });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toMatch('An unexpected error occured, please try again');
    })
});

/**
 * Tests for booking appointments, including the following:
 * positives: 
 *  - bookAppointment(200) => appointment booked successfully
 * negatives: 
 *  - bookAppointment(400) => missing required fields
 *  - bookAppointment(404) => appointment not found
 *  - bookAppointment(400) => appointment already booked
 */
describe('PATCH /api/bookAppointment', () => {
    it('should book appointment with valid data', async () => {
        const response = await request.patch('/api/bookAppointment').send({
            patientId: '1',
            appointmentId: createdAppointmentId
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(`Appointment successfully booked with id: ${createdAppointmentId}`);
    });

    it('should return status 400 for missing required fields', async () => {
        const response = await request.patch('/api/bookAppointment').send({
            patientId: '1'
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toMatch('Missing required field(s).')
    });

    it('should return status 404 appointment not found', async () => {
        const response = await request.patch('/api/bookAppointment').send({
            patientId: '1',
            appointmentId: '123'
        })
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch('Appointment could not be found.');
    });

    it('should return status 400 appointment already booked', async () => {
        const response = await request.patch('/api/bookAppointment').send({
            patientId: '1',
            appointmentId: createdAppointmentId
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch('Appointment already booked. ')
    })
});

/**
 * Tests for deleting appointments, including the following:
 * positives:
 *  - deleteAppointment(200) => appointment deleted successfully
 */
describe('DELETE /api/deleteAppointment', () => {
    it('should delete appointment with valid data', async () => {
        const response = await request.delete('/api/deleteAppointment').send({
            appointmentId: createdAppointmentId
        });
        // yo
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(`Appointment deleted with id: ${createdAppointmentId}`);
    });
});