import { generateToken, validateToken } from "../utils/tokenUtils";
import { publishMessage } from "../mqtt/mqttClient";
import { TOPICS } from "../mqtt/topics";

// Filter 1: Validate Credentials
export const validateCredentials = async (payload: any): Promise<any> => {
  const { username, password } = payload;

  if (!username || !password) {
    throw new Error("Missing username or password");
  }

  //for testing purpose
  const isValid = username === "test" && password === "password";
  return { ...payload, isValid };
};

// Filter 2: Generate Token
export const generateAuthToken = async (payload: any): Promise<any> => {
  if (!payload.isValid) {
    throw new Error("Invalid username or password");
  }
  
  //for testing purpose
  const token = generateToken("12345"); 
  return { ...payload, token };
};

// Filter 3: Publish Login Result
export const publishAuthResult = async (payload: any): Promise<void> => {
  const topic = payload.isValid
    ? TOPICS.PUBLISH.AUTH_SUCCESS
    : TOPICS.PUBLISH.AUTH_FAILURE;

  publishMessage(topic, {
    success: payload.isValid,
    token: payload.token || null,
  });
};

// Filter 4: Validate Token
export const validateAuthToken = async (payload: any): Promise<any> => {
  const { token } = payload;

  const { valid, payload: decoded } = validateToken(token);

  if (!valid) {
    throw new Error("Invalid or expired token");
  }

  return { ...payload, valid, decoded };
};

// Publish Validation Result
export const publishValidationResult = async (payload: any): Promise<void> => {
  publishMessage(TOPICS.PUBLISH.AUTH_RESPONSE, {
    success: payload.valid,
    user: payload.decoded || null,
  });
};
