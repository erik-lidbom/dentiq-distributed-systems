import { TOPICS } from '../topics';

// Method that retrieves the topic that the gateway will publish to
export const retrievePublishTopic = (
  serviceName: string,
  path: string = ''
): string => {
  let publishTopic = '';
  switch (serviceName) {
    case 'booking':
      publishTopic = TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ;
      break;
  }
  return publishTopic;
};

// Method that retrieves the topic that the gateway needs to listen to, to be able to create a response.
export const retrieveSubscribedTopic = (topic: string): string => {
  let subscriptionTopic = '';

  switch (topic) {
    case TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ:
      subscriptionTopic = TOPICS.APPOINTMENT.PATIENT_BOOK_APP_GATEWAY;
      break;
  }
  return subscriptionTopic;
};
