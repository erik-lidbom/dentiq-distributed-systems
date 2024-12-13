import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";
import { TOPICS } from "./topics";
import {
  createAppointment,
  bookAppointment,
  cancelAppointment,
  deleteAppointment,
  Message_Status_Message,
} from "../controllers/appointmentController";

dotenv.config();

const mqttConnOptions: IClientOptions = {
  host: process.env.MQTT_HOST,
  port: parseInt(process.env.MQTT_PORT || "8883", 10),
  protocol: "mqtts",
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};

const mqttClient: MqttClient = mqtt.connect(mqttConnOptions);

mqttClient.on("connect", () => {
  console.log("[MQTT]: Successfully connected to the broker!");

  mqttClient.subscribe(
    [
      TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ,
      TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ,
      TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ,
      TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ
    ],
    (err) => {
      if (err) {
        console.error(
          "[MQTT]: Could not establish subscription connection: ",
          err
        );
      } else {
        console.log(
          "[MQTT]: Subscribed to topic(s)",
          TOPICS.APPOINTMENT.DENTIST_CREATE_APP_REQ,
          TOPICS.APPOINTMENT.DENTIST_REMOVE_SLOT_REQ,
          TOPICS.APPOINTMENT.PATIENT_BOOKING_REQ,
          TOPICS.APPOINTMENT.PATIENT_BOOKING_CANCEL_REQ

        );
        console.log("-------------------------------------------------------");
      }
    }
  );
});

mqttClient.on("message", async (topic, message) => {
  const messageAndTopic = await appendToDatabase(topic, message);

  const topicsAndMessage = await whereToPublish(messageAndTopic)
  await publishMessage(topicsAndMessage);
  console.log(`[MQTT]: Message recieved from ${topic}:`, message.toString());
});

export default mqttClient;

const appendToDatabase = async (
  topic: string,
  message: Buffer
): Promise<Message_Status_Message> => {
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
        message: "Resource not found",
      };
      break;
  }
  return result;
};

type topicsAndMessage = {
  topics: string[];
  resPayload: Message_Status_Message;
};

const whereToPublish = async (
  resPayload: Message_Status_Message
): Promise<topicsAndMessage> => {
  const publishPayload = resPayload;
  let topics: string[] = [TOPICS.APPOINTMENT.RESPOND_TO_GATEWAY];
  if (publishPayload.notificationPayload) {
    const typeOfNotification =
      publishPayload.notificationPayload.typeOfNotification;
    if (typeOfNotification) {
      switch (typeOfNotification) {
        case "AppointmentCreated":
          // dentist create app -> dentiq/appointmentService/API_GATEWAY/createAppointment
          topics = [TOPICS.APPOINTMENT.DENTIST_CREATE_APP_GATEWAY, TOPICS.APPOINTMENT.APPOINTMENT_CREATED]
          break;
        case "AppointmentBooked":
          // dentiq/appointmentService/API_GATEWAY/bookAppointment
          topics = [TOPICS.APPOINTMENT.PATIENT_BOOK_APP_GATEWAY, TOPICS.APPOINTMENT.APPOINTMENT_BOOKED]
          break;
        case "AppointmentDeleted":
          // dentiq/appointmentService/API_GATEWAY/deleteAppointment
          topics = [TOPICS.APPOINTMENT.DENTIST_DELETE_APP_GATEWAY, TOPICS.APPOINTMENT.DENTIST_DELETE_SLOT]
          break;
        case "AppointmentCancelled":
          // dentiq/appointmentService/API_GATEWAY/cancelAppointment
          topics = [TOPICS.APPOINTMENT.PATIENT_CANCEL_APP_GATEWAY, TOPICS.APPOINTMENT.PATIENT_CANCEL_SLOT]
          break;
        default:
          
          break;
      }
    }
  }
  const topicsAndMessage = {
    topics: topics,
    resPayload: publishPayload,
  };
  return topicsAndMessage;
};

const publishMessage = async (
  publishPayload: topicsAndMessage
): Promise<void> => {
  const { topics, resPayload } = publishPayload;
  mqttClient.publish(
    topics[0],
    JSON.stringify({
      status: resPayload.status,
      message: resPayload.message,
    })
  );

  if (resPayload.notificationPayload) {
    mqttClient.publish(
      publishPayload.topics[1],
      JSON.stringify(resPayload.notificationPayload)
    );
  }
};
