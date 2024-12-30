import { Appointment } from '../models/appointmentModel';
import { TOPICS } from './topics';

//Method to retrieve the topics that will be published to.
export const retrievePublishTopics = (path: string): string => {
  switch (path) {
    case 'create':
      return TOPICS.PUBLISH.CREATE_RESPONSE;
    case 'get':
      return TOPICS.PUBLISH.GET_RESPONSE;
    case 'update':
      return TOPICS.PUBLISH.UPDATE_RESPONSE;
    case 'delete':
      return TOPICS.PUBLISH.DELETE_RESPONSE;
    case 'query':
      return TOPICS.PUBLISH.QUERY_RESPONSE;

    default:
      console.warn(`[MQTT]: Unknown path received: ${path}`);
      break;
  }
  return '';
};

// Method that performs and action and returns a status type of a boolean
export const getStatus = async (
  path: string,
  payload: any
): Promise<boolean> => {
  let status: boolean = false;
  switch (path) {
    case 'create':
      const newAppointment = new Appointment(payload);
      await newAppointment.save();
      status = true;
      break;
    case 'get':
      const appointment = await Appointment.findById({
        _id: payload.appointmentId,
      });
      status = !!appointment;
      break;
    case 'update':
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        { _id: payload.appointmentId },
        { status: payload.status },
        { new: true }
      );
      status = !!updatedAppointment;
      break;
    case 'delete':
      const deletedAppointment = await Appointment.findByIdAndDelete({
        _id: payload.appointmentId,
      });
      status = !!deletedAppointment;
      break;
    case 'query':
      const appointments = await Appointment.find({
        dentistId: payload.dentistId,
        date: payload.date,
      });
      status = !!appointments;
      break;
    default:
      console.warn(`[MQTT]: Unknown path received: ${path}`);
      break;
  }
  return status;
};
