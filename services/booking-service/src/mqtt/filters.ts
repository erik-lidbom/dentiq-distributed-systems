import { bookAppointment, cancelAppointment, createAppointment, deleteAppointment, ResponsePayload } from "../controllers/appointmentController";
import mqttClient from "./mqtt";
import { TOPICS } from "./topics";

/**
 * FILTER 1: Dispatch by topic
 * 
 * Determines the correct method to call based on the
 * MQTT topic where the message was received.
 * @param {string} topic - Topic indicating the source of the message
 * @param {Buffer} message - The message payload
 * @returns {Promise<ResponsePayload>} - The result of the invoked method.
 */
export const dispatchByTopic = async (
  topic: string,
  message: Buffer
): Promise<ResponsePayload> => {
  try {
    let result;
    switch (topic) {
      case TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ:
        result = await createAppointment(message);
        break;
      case TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ:
        result = await deleteAppointment(message);
        break;
      case TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ:
        result = await bookAppointment(message);
        break;
      case TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ:
        result = await cancelAppointment(message);
        break;
      default:
        result = {
          status: 404,
          message: 'Resource not found',
        };
        break;
    }
    return result;
  } catch (error) {
    console.error(
      `[appendToDatabase]: Error processing topic ${topic}:`,
      error
    );
    return {
      status: 500,
      message: 'Internal server error, unable to process the request',
    };
  }
};

type TopicsAndResponsePayload = {
  topics: string[];
  resPayload: ResponsePayload;
};

/**
 * FILTER 2: Determine Publish Topics
 * 
 * Determines what topics to publish to based on the ResponsePayload
 * @param {ResponsePayload} resPayload The result payload from the previous processing step, 
 * including status, message, and optional notification details.
 * @returns {Promise<TopicsAndResponsePayload>} - An object containing the topics to publish to 
 * and the corresponding response payload.
 */
export const determinePublishTopics = async (
  resPayload: ResponsePayload
): Promise<TopicsAndResponsePayload> => {
  const publishPayload = resPayload;
  let publishTopics: string[] = [];
  if (publishPayload.notificationPayload) {
    const hasError = publishPayload.notificationPayload.error;
    const typeOfNotification =
      publishPayload.notificationPayload.typeOfNotification;
    if (typeOfNotification) {
      switch (typeOfNotification) {
        case 'AppointmentCreated':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.DENTIST_CREATE_APP_GATEWAY];
            break;
          }
          publishTopics = [
            TOPICS.APPOINTMENT.DENTIST_CREATE_APP_GATEWAY,
            TOPICS.APPOINTMENT.APPOINTMENT_CREATED,
          ];
          break;
        case 'AppointmentBooked':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.PATIENT_BOOK_APP_GATEWAY];
            break;
          }
          publishTopics = [
            TOPICS.APPOINTMENT.PATIENT_BOOK_APP_GATEWAY,
            TOPICS.APPOINTMENT.APPOINTMENT_BOOKED,
          ];
          break;
        case 'AppointmentDeleted':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.DENTIST_DELETE_APP_GATEWAY];
            break;
          }
          publishTopics = [
            TOPICS.APPOINTMENT.DENTIST_DELETE_APP_GATEWAY,
            TOPICS.APPOINTMENT.DENTIST_DELETE_SLOT,
          ];
          break;
        case 'AppointmentCancelled':
          if (hasError) {
            publishTopics = [TOPICS.APPOINTMENT.PATIENT_CANCEL_APP_GATEWAY];
            break;
          }
          publishTopics = [
            TOPICS.APPOINTMENT.PATIENT_CANCEL_APP_GATEWAY,
            TOPICS.APPOINTMENT.PATIENT_CANCEL_SLOT,
          ];
          break;
        default:
          publishTopics = ['dentiq/appointmentService/API_GATEWAY/ISE'];
          break;
      }
    }
  }
  const topicsAndMessage = {
    topics: publishTopics,
    resPayload: publishPayload,
  };
  return topicsAndMessage;
};

/**
 * FILTER 3: Publish to Destinations
 * 
 * Publishes the processed response payload to the determined topics.
 * 
 * @param {TopicsAndResponsePayload} publishPayload - An object containing:
 *    - `topics` (string[]): The list of topics to publish the message to.
 *    - `resPayload` (ResponsePayload): The response payload containing the status, 
 *      message, and optional notification details to be published.
 * @returns {Promise<void>} - Resolves when publishing is complete, or logs an error 
 * if the MQTT client is not connected or if there are issues during publication.
 */
export const publishToDestinations = async (
  publishPayload: TopicsAndResponsePayload
): Promise<void> => {
  if (!mqttClient.connected) {
    console.error('[MQTT]: Client not connected, cannot publish messages');
    return;
  }

  const { topics, resPayload } = publishPayload;
  if (!topics || topics.length === 0 || !topics[0]) {
    console.error('[MQTT]: No valid topics to publish to.');
    return;
  }
  mqttClient.publish(
    topics[0],
    JSON.stringify({
      status: resPayload.status,
      message: resPayload.message,
    }),
    (err) => {
      if (err) {
        console.error(`[MQTT]: Error publishing to topic ${topics[0]}:`, err);
      } else {
        console.log(`[MQTT]: Successfully published to topic ${topics[0]}`);
      }
    }
  );

  if (resPayload.notificationPayload && topics[1]) {
    const { typeOfNotification, ...filteredPayload } = resPayload.notificationPayload;
    mqttClient.publish(
      topics[1],
      JSON.stringify(filteredPayload),
      (err) => {
        if (err) {
          console.error(`[MQTT]: Error publishing to topic ${topics[1]}:`, err);
        } else {
          console.log(`[MQTT]: Successfully published to topic ${topics[1]}`);
        }
      }
    );
  }
};