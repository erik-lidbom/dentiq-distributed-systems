import { publishAndSubscribe, publishMessage } from "../mqtt/mqttClient"; // Ensure publishMessage is imported
import { TOPICS } from "../mqtt/topics";
import { generateToken, validateToken } from "../utils/tokenUtils";

interface ValidationPayload {
  isValid: any;
  email: string;
  password: string;
  role: string;
  correlationId: string;
}

interface AuthTokenPayload {
  decoded: null;
  token: string;
  valid: boolean;
  payload?: any;
}

// Filter 1: Validate Credentials with Patient/Dentist Service
export const validateCredentials = async (payload: ValidationPayload): Promise<any> => {
  const { email, password, role } = payload;

  console.log("[LOGIN WORKFLOW]: Starting credential validation...");
  console.log(`[LOGIN WORKFLOW]: Payload received - Email: ${email}, Role: ${role}`);

  if (!email || !password || !role) {
    console.error("[LOGIN WORKFLOW]: Validation failed - Missing email, password, or role.");
    throw new Error("Missing email, password, or role");
  }

  const correlationId = `${role}_${Date.now()}`;
  const validationRequest = { email, password, correlationId };

  console.log(`[LOGIN WORKFLOW]: Publishing validation request with Correlation ID: ${correlationId}`);
  const validationResponse = await publishAndSubscribe(
    TOPICS.PUBLISH.CREDENTIAL_VALIDATION_REQUEST(role),
    validationRequest,
    TOPICS.SUBSCRIBE.CREDENTIAL_VALIDATION_RESPONSE(correlationId),
    5000
  );

  console.log("[LOGIN WORKFLOW]: Validation response received:", validationResponse);

  if (!validationResponse || !validationResponse.success) {
    console.error("[LOGIN WORKFLOW]: Validation failed - Invalid credentials.");
    throw new Error("Invalid credentials");
  }

  console.log("[LOGIN WORKFLOW]: Credentials validated successfully.");
  return { ...payload, isValid: true };
};

// Filter 2: Generate Token
export const generateAuthToken = async (payload: ValidationPayload): Promise<any> => {
  console.log("[LOGIN WORKFLOW]: Generating token...");

  if (!payload.isValid) {
    console.error("[LOGIN WORKFLOW]: Token generation failed - Invalid credentials.");
    throw new Error("Invalid email or password");
  }

  const token = generateToken(payload.email);
  console.log("[LOGIN WORKFLOW]: Token generated successfully:", token);

  return { ...payload, token };
};

// Filter 3: Publish Login Result
export const publishAuthResult = async (payload: any): Promise<void> => {
  const topic = payload.isValid
    ? TOPICS.PUBLISH.AUTH_SUCCESS
    : TOPICS.PUBLISH.AUTH_FAILURE;

  console.log(`[LOGIN WORKFLOW]: Publishing login result to topic: ${topic}`);
  console.log("[LOGIN WORKFLOW]: Login Result Payload:", {
    success: payload.isValid,
    token: payload.token || null,
  });

  publishMessage(topic, {
    success: payload.isValid,
    token: payload.token || null,
  });
  console.log("[LOGIN WORKFLOW]: Login result published successfully.");
};

// Filter 4: Validate Token
export const validateAuthToken = async (payload: AuthTokenPayload): Promise<any> => {
  console.log("[TOKEN VALIDATION]: Validating token...");
  const { token } = payload;

  // Await the token validation before destructuring
  const { valid, payload: decoded } = await validateToken(token);

  if (!valid) {
    console.error("[TOKEN VALIDATION]: Token validation failed - Invalid or expired token.");
    throw new Error("Invalid or expired token");
  }

  console.log("[TOKEN VALIDATION]: Token validated successfully:", decoded);
  return { ...payload, valid, decoded };
};

// Publish Validation Result
export const publishValidationResult = async (payload: AuthTokenPayload): Promise<void> => {
  console.log("[TOKEN VALIDATION]: Publishing validation result...");
  console.log("[TOKEN VALIDATION]: Validation Result Payload:", {
    success: payload.valid,
    user: payload.decoded || null,
  });

  // Ensure publishMessage is properly used
  publishMessage(TOPICS.PUBLISH.AUTH_RESPONSE, {
    success: payload.valid,
    user: payload.decoded || null,
  });
  console.log("[TOKEN VALIDATION]: Validation result published successfully.");
};
