import { describe, expect, it, jest } from "@jest/globals";
import { createPublishTopics } from "../helpers/helpers";
import { TOPICS } from "../mqtt/topics";
import Notification from "../models/model";
import { createNotification } from "../controllers/controller";

// Two instances of mockdata used in the test
const EXAMPLE_DOCUMENT = {
  email: "erik123@gmail.com",
  message: "this is a mock message",
  senderService: "appointmentService",
  patientId: "1234",
  dentistId: "12345",
  _id: "6759eb8f70f0e23148e7218a",
  createdAt: new Date("2024-12-11T19:44:15.166Z"),
  updatedAt: new Date("2024-12-11T19:44:15.166Z"),
  __v: 0,
};

const EXAMPLE_PUBLISHED_MESSAGE = {
  email: "erik123@gmail.com",
  message: "this is a mock message",
  senderService: "appointmentService",
  patientId: "1234",
  dentistId: "12345",
};

/**
 * Tests for creating topics to publish to and storing a notification into the database.
 * positives:
 *  - createAppointment(201) => appointment successfully created
 * negatives:
 *  - createAppointment(400) => missing required fields
 */
describe("should return topics to publish to", () => {
  it("return appointment created topics", () => {
    expect(
      createPublishTopics(
        TOPICS.SUBSCRIBE.APPOINTMENT_CREATED,
        EXAMPLE_DOCUMENT
      )
    ).toEqual(
      expect.arrayContaining([
        `${TOPICS.PUBLISH.APPOINTMENT_CREATED_DENTIST}/${EXAMPLE_DOCUMENT.dentistId}`,
        TOPICS.PUBLISH.APPOINTMENT_CREATED_PATIENT,
      ])
    );
  });
  it("return appointment booked topics", () => {
    expect(
      createPublishTopics(TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED, EXAMPLE_DOCUMENT)
    ).toEqual(
      expect.arrayContaining([
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_DENTIST}/${EXAMPLE_DOCUMENT.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT}/${EXAMPLE_DOCUMENT.patientId}`,
      ])
    );
  });
  it("return patient cancel topics", () => {
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
  it("return dentist cancel topics", () => {
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
  it("return empty array when input unrecognized topic", () => {
    expect(
      createPublishTopics("dentiq/exampleTopic/for/testing", EXAMPLE_DOCUMENT)
    ).toEqual(expect.arrayContaining([]));
  });
});

it("should create and save a notification successfully", async () => {
  const saveMock = jest
    .spyOn(Notification.prototype, "save")
    .mockResolvedValue(EXAMPLE_DOCUMENT);

  const inputBuffer = Buffer.from(JSON.stringify(EXAMPLE_PUBLISHED_MESSAGE));

  const result = await createNotification(inputBuffer);

  expect(saveMock).toHaveBeenCalledTimes(1);

  expect(result).toEqual(EXAMPLE_DOCUMENT);
});
