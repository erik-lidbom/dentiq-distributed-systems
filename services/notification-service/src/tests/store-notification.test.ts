import { describe, expect, it, jest } from "@jest/globals";
import Notification from "../models/model";
import { createNotification } from "../controllers/controller";

/**
 * Unit test for simulating a database write
 */

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

describe("publishToAllTopics", () => {
  it("should create and save a notification successfully", async () => {
    const saveMock = jest
      .spyOn(Notification.prototype, "save")
      .mockResolvedValue(EXAMPLE_DOCUMENT);

    const inputBuffer = Buffer.from(JSON.stringify(EXAMPLE_PUBLISHED_MESSAGE));

    const result = await createNotification(inputBuffer);

    expect(saveMock).toHaveBeenCalledTimes(1);

    expect(result).toEqual(EXAMPLE_DOCUMENT);
  });
});
