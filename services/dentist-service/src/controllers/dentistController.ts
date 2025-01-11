import { Dentist } from '../models/dentistSchema';
import { mqttClient } from '../mqtt/mqtt';
import { TOPICS } from '../mqtt/topics';
import { Clinic } from '../models/clinicSchema';

/**
 * Helper function to publish error responses.
 */
const publishError = (topic: string, message: string, status: number): void => {
  const errorResponse = { status, message };
  mqttClient.publish(topic, JSON.stringify(errorResponse));
  console.log(
    `[INFO] Query response message: ${errorResponse.message} with status code: ${errorResponse.status}`
  );
};

/**
 * Helper function to extract error messages from unknown types.
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

/**
 * Handles creating a new dentist.
 */
export const createDentist = async (payload: any): Promise<void> => {
  const { payload: data, correlationId } = payload;
  try {
    const { personnummer, firstName, lastName, password, email, clinic } = data;

    // Validate required fields
    if (!personnummer || !firstName || !lastName || !password || !email) {
      return publishError(
        `${TOPICS.PUBLISH.CREATE_RESPONSE}/${correlationId}`,
        'Missing required fields',
        400
      );
    }

    const newDentist = new Dentist({
      personnummer,
      firstName,
      lastName,
      password,
      email,
      clinic,
    }).populate('clinic');

    const savedDentist = await newDentist;

    await savedDentist.save();

    const response = {
      status: 201,
      message: 'New dentist registered',
      dentist: savedDentist,
    };

    mqttClient.publish(
      `${TOPICS.PUBLISH.CREATE_RESPONSE}/${correlationId}`,
      JSON.stringify(response)
    );
    console.log('[INFO] Query response:', response);
  } catch (error) {
    console.error('[ERROR] Could not create dentist:', getErrorMessage(error));
    publishError(
      `${TOPICS.PUBLISH.CREATE_RESPONSE}/${correlationId}`,
      getErrorMessage(error),
      500
    );
  }
};

/**
 * Handles retrieving a dentist by ID.
 */
export const getDentist = async (payload: any): Promise<void> => {
  const { payload: data, correlationId } = payload;
  try {
    const { dentistId } = data;

    if (!dentistId) {
      return publishError(
        `${TOPICS.PUBLISH.GET_RESPONSE}/${correlationId}`,
        'Missing required field: dentistId',
        400
      );
    }

    const dentist = await Dentist.findById(dentistId).populate('clinic');

    if (!dentist) {
      return publishError(
        `${TOPICS.PUBLISH.GET_RESPONSE}/${correlationId}`,
        'Dentist not found',
        404
      );
    }

    const response = { status: 200, dentist };
    mqttClient.publish(
      `${TOPICS.PUBLISH.GET_RESPONSE}/${correlationId}`,
      JSON.stringify(response)
    );
    console.log('[INFO] Query response:', response);
  } catch (error) {
    console.error('[ERROR] Could not fetch dentist:', getErrorMessage(error));
    publishError(
      `${TOPICS.PUBLISH.GET_RESPONSE}/${correlationId}`,
      getErrorMessage(error),
      500
    );
  }
};

/**
 * Handles updating a dentist.
 */
export const patchDentist = async (payload: any): Promise<void> => {
  const { payload: data, correlationId } = payload;
  try {
    const { dentistId, updates } = data;

    if (!dentistId || !updates) {
      return publishError(
        `${TOPICS.PUBLISH.UPDATE_RESPONSE}/correlationId`,
        'Missing required fields',
        400
      );
    }

    const updatedDentist = await Dentist.findByIdAndUpdate(dentistId, updates, {
      new: true,
    }).populate('clinic');

    if (!updatedDentist) {
      return publishError(
        `${TOPICS.PUBLISH.UPDATE_RESPONSE}/correlationId`,
        'Dentist not found',
        404
      );
    }

    const response = {
      status: 200,
      message: 'Dentist updated',
      dentist: updatedDentist,
    };
    mqttClient.publish(
      `${TOPICS.PUBLISH.UPDATE_RESPONSE}/correlationId`,
      JSON.stringify(response)
    );
    console.log('[INFO] Query response:', response);
  } catch (error) {
    console.error('[ERROR] Could not update dentist:', getErrorMessage(error));
    publishError(
      `${TOPICS.PUBLISH.UPDATE_RESPONSE}/correlationId`,
      getErrorMessage(error),
      500
    );
  }
};

/**
 * Handles deleting a dentist.
 */
export const deleteDentist = async (payload: any): Promise<void> => {
  const { payload: data, correlationId } = payload;
  try {
    const { dentistId } = data;

    if (!dentistId) {
      return publishError(
        `${TOPICS.PUBLISH.DELETE_RESPONSE}/${correlationId}`,
        'Missing required field: dentistId',
        400
      );
    }

    const deletedDentist = await Dentist.findByIdAndDelete(dentistId);

    if (!deletedDentist) {
      return publishError(
        `${TOPICS.PUBLISH.DELETE_RESPONSE}/${correlationId}`,
        'Dentist not found',
        404
      );
    }

    const response = { status: 200, message: 'Dentist deleted', dentistId };
    mqttClient.publish(
      `${TOPICS.PUBLISH.DELETE_RESPONSE}/${correlationId}`,
      JSON.stringify(response)
    );
    console.log('[INFO] Query response:', response);
  } catch (error) {
    console.error('[ERROR] Could not delete dentist:', getErrorMessage(error));
    publishError(
      `${TOPICS.PUBLISH.DELETE_RESPONSE}/${correlationId}`,
      getErrorMessage(error),
      500
    );
  }
};

/**
 * Handles querying multiple dentists.
 */
export const queryDentists = async (payload: any): Promise<void> => {
  const { payload: data, correlationId } = payload;
  try {
    const filters = data.filters || {};

    const dentists = await Dentist.find(filters);

    if (!dentists || dentists.length === 0) {
      return publishError(
        `${TOPICS.PUBLISH.QUERY_RESPONSE}/${correlationId}`,
        'No dentists found',
        404
      );
    }

    const response = { status: 200, data: dentists };
    mqttClient.publish(
      `${TOPICS.PUBLISH.QUERY_RESPONSE}/${correlationId}`,
      JSON.stringify(response)
    );

    console.log(
      '[INFO] Query response:',
      response,
      ' to topic:',
      `${TOPICS.PUBLISH.QUERY_RESPONSE}/${correlationId}`
    );
  } catch (error) {
    console.error('[ERROR] Could not query dentists:', getErrorMessage(error));
    publishError(
      `${TOPICS.PUBLISH.QUERY_RESPONSE}/${correlationId}`,
      getErrorMessage(error),
      500
    );
  }
};

export const queryClinics = async (payload: any): Promise<void> => {
  const { correlationId } = payload;
  try {
    const filters = payload.filters || {};

    const clinics = await Clinic.find();

    if (!clinics || clinics.length === 0) {
      return publishError(
        TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
        'No clinics found',
        404
      );
    }

    const response = { status: 200, clinics };

    mqttClient.publish(
      `${TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE}/${correlationId}`,
      JSON.stringify(response)
    );
  } catch (error) {
    console.error('[ERROR] Could not query clinic:', getErrorMessage(error));
    publishError(
      TOPICS.PUBLISH.CLINICS.QUERY_RESPONSE,
      getErrorMessage(error),
      500
    );
  }
};
