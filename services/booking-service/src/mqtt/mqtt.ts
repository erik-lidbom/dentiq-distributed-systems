import mqtt, { MqttClient, IClientOptions } from "mqtt";
import dotenv from "dotenv";
import { TOPICS } from "./topics";
import {
  bookAppointment,
  cancelAppointment,
  deleteAppointment,
  Message_Status_Message,
} from "../controllers/appointmentController";
import { createAppointment } from "../controllers/appointmentController";

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
      TOPICS.APPOINTMENT.DENTIST_AWAIT_CONF,
      TOPICS.APPOINTMENT.PATIENT_AWAIT_CONFIRMATION,
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
          TOPICS.APPOINTMENT.APPOINTMENT_CREATED,
          TOPICS.APPOINTMENT.PATIENT_AWAIT_CONFIRMATION
        );
        console.log("-------------------------------------------------------");
      }
    }
  );
});

mqttClient.on("message", (topic, message) => {
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
      result = await createAppointment(message); // -> publish to broker
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
          topics.push(TOPICS.APPOINTMENT.APPOINTMENT_CREATED);
          break;
        case "AppointmentBooked":
          topics.push(TOPICS.APPOINTMENT.APPOINTMENT_BOOKED);
          break;
        case "AppointmentDeleted":
          topics.push(TOPICS.APPOINTMENT.DENTIST_DELETE_SLOT);
          break;
        case "AppointmentCancelled":
          topics.push(TOPICS.APPOINTMENT.PATIENT_CANCEL_SLOT);
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
