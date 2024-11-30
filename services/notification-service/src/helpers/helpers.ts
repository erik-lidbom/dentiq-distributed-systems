import { NotificationDocument } from "../models/model";
import { TOPICS } from "../mqtt/topics";

export const createPublishTopics = (
  topic: string,
  data: NotificationDocument
): string[] => {
  let topics: string[] = [];
  switch (topic) {
    case TOPICS.SUBSCRIBE.APPOINTMENT_CREATED:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_CREATED_DENTIST}/${data.dentistId}`,
        TOPICS.PUBLISH.APPOINTMENT_CREATED_PATIENT,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_DENTIST}/${data.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT}/${data.patientId}`,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_CANCEL_CONFIRMATION:
      topics = [
        TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST,
        TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT,
      ];
    default:
      [];
  }
  return topics;
};
