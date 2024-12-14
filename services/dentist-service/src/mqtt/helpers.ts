import { Dentist } from "../models/dentistSchema";
import { TOPICS } from "./topics";

//Method to retrieve the topics that will be published to.
export const retrievePublishTopics = (incomingTopic: string): string => {
  switch (incomingTopic) {
    case TOPICS.SUBSCRIBE.DENTIST_CREATE_APP:
      return TOPICS.PUBLISH.DENTIST_AWAIT_CONF;
    default:
      console.warn(`[MQTT]: Unknown topic received: ${incomingTopic}`);
      break;
  }
  return "";
};

// Method that performs and action and returns a status type of a boolean
export const getStatus = async (
  topic: string,
  payload: any
): Promise<boolean> => {
  let status: boolean = false;
  switch (topic) {
    case TOPICS.SUBSCRIBE.DENTIST_CREATE_APP:
      const dentist = await Dentist.findById({ _id: payload.dentistId });
      status = !!dentist;
      break;
    default:
      console.warn(`[MQTT]: Unknown topic received: ${topic}`);
      break;
  }
  return status;
};
