import { NotificationDocument } from '../models/model';
import { TOPICS } from '../mqtt/topics';

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
    case TOPICS.SUBSCRIBE.APPOINTMENT_PATIENT_CANCEL_CONFIRMATION:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST}/${data.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT}/${data.patientId}`,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST}/${data.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT}`,
      ];
      break;
    default:
      [];
  }
  return topics;
};
