import { Notification } from '../models/model';
import { TOPICS } from '../mqtt/topics';

export const createPublishTopics = (topic: string, data: any): string[] => {
  let topics: string[] = [];
  switch (topic) {
    case TOPICS.SUBSCRIBE.APPOINTMENT_CREATED:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_CREATED_DENTIST}/${data.dentistId}`,
        TOPICS.PUBLISH.APPOINTMENT_CREATED_DENTIST,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_BOOKED:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT}/${data.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_BOOKED_PATIENT}/${data.patientId}`,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_PATIENT_CANCEL_CONFIRMATION:
      //TODO --> Lägg till topic för alla andra
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT}/${data.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_PATIENT}/${data.patientId}`,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_DENTIST_CANCEL_CONFIRMATION:
      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST}/${data.dentistId}`,
        `${TOPICS.PUBLISH.APPOINTMENT_CANCEL_DENTIST}`,
      ];
      break;
    case TOPICS.SUBSCRIBE.APPOINTMENT_GET_NOTIFICATIONS:
      console.log('CORRELATION DATA');
      console.log(data);
      const { correlationId } = data;

      topics = [
        `${TOPICS.PUBLISH.APPOINTMENT_GET_NOTIFICATIONS}/${correlationId}`,
      ];
      break;
    default:
      [];
  }
  return topics;
};
