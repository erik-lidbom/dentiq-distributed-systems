import { TOPICS } from '../topics';

// Method that retrieves the topic that the gateway will publish to
export const retrievePublishTopic = (
  serviceName: string,
  path: string | undefined
): string => {
  let publishTopic = '';
  switch (serviceName) {
    case 'booking':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.BOOKING_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.BOOKING_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.BOOKING_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.BOOKING_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.BOOKING_QUERY_RESPONSE;
          break;
      }
      break;
    case 'dentist':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.DENTIST_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.DENTIST_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.DENTIST_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.DENTIST_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.DENTIST_QUERY_RESPONSE;
          break;
      }
      break;

    case 'patient':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.PATIENT_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.PATIENT_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.PATIENT_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.PATIENT_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.PATIENT_QUERY_RESPONSE;
          break;
      }
      break;

    case 'notification':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.NOTIFICATION_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.NOTIFICATION_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.NOTIFICATION_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.NOTIFICATION_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.NOTIFICATION_QUERY_RESPONSE;
          break;
      }
      break;

    case 'auth':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.AUTH_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.AUTH_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.AUTH_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.AUTH_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.AUTH_QUERY_RESPONSE;
          break;
      }
      break;

    case 'clinic':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.CLINIC_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.CLINIC_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.CLINIC_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.CLINIC_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.CLINIC_QUERY_RESPONSE;
          break;
      }
      break;

    case 'logging':
      switch (path) {
        case 'create':
          publishTopic = TOPICS.PUBLISH.LOGGING_CREATE_RESPONSE;
          break;
        case 'get':
          publishTopic = TOPICS.PUBLISH.LOGGING_GET_RESPONSE;
          break;
        case 'update':
          publishTopic = TOPICS.PUBLISH.LOGGING_UPDATE_RESPONSE;
          break;
        case 'delete':
          publishTopic = TOPICS.PUBLISH.LOGGING_DELETE_RESPONSE;
          break;
        case 'query':
          publishTopic = TOPICS.PUBLISH.LOGGING_QUERY_RESPONSE;
          break;
      }
      break;
  }
  return publishTopic;
};

// Method that retrieves the topic that the gateway needs to listen to, to be able to create a response.
export const retrieveSubscribedTopic = (
  service: string,
  path: string | undefined
): string => {
  let subscriptionTopic = '';

  switch (service) {
    case 'booking':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.BOOKING_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.BOOKING_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.BOOKING_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.BOOKING_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.BOOKING_QUERY;
          break;
      }
      break;
    case 'dentist':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.DENTIST_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.DENTIST_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.DENTIST_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.DENTIST_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.DENTIST_QUERY;
          break;
      }
      break;

    case 'patient':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.PATIENT_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.PATIENT_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.PATIENT_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.PATIENT_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.PATIENT_QUERY;
          break;
      }
      break;

    case 'notification':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.NOTIFICATION_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.NOTIFICATION_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.NOTIFICATION_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.NOTIFICATION_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.NOTIFICATION_QUERY;
          break;
      }
      break;

    case 'auth':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.AUTH_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.AUTH_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.AUTH_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.AUTH_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.AUTH_QUERY;
          break;
      }
      break;

    case 'clinic':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.CLINIC_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.CLINIC_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.CLINIC_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.CLINIC_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.CLINIC_QUERY;
          break;
      }
      break;

    case 'logging':
      switch (path) {
        case 'create':
          subscriptionTopic = TOPICS.SUBSCRIBE.LOGGING_CREATE;
          break;
        case 'get':
          subscriptionTopic = TOPICS.SUBSCRIBE.LOGGING_GET;
          break;
        case 'update':
          subscriptionTopic = TOPICS.SUBSCRIBE.LOGGING_UPDATE;
          break;
        case 'delete':
          subscriptionTopic = TOPICS.SUBSCRIBE.LOGGING_DELETE;
          break;
        case 'query':
          subscriptionTopic = TOPICS.SUBSCRIBE.LOGGING_QUERY;
          break;
      }
      break;
  }
  return subscriptionTopic;
};
