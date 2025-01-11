import Session from '../models/sessionModel';
import User from '../models/userModel';
import { generateToken, validateToken } from '../utils/tokenUtils';
import bcrypt from 'bcrypt';

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

/**
 * Creates a new dentist or patient account in the database
 * @param {string} email - Email provided.
 * @param {string} password - Password provided.
 * @param {string} role - Role provided.
 * @returns {any} - Returns an object with success status and a message
 */

export const createAccount = async (payload: any): Promise<any> => {
  const { email, fullname, personnummer, role, password } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return { status: 403, message: `User with role ${role} already exists` };

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    email,
    password: hashPassword,
    role,
    personnummer,
    fullname,
  });
  await newUser.save();

  return {
    status: 201,
    message: `${role.toUpperCase()} account created successfully`,
  };
};

/**
 * Checks if the credentials are valid, and if it is valid it deletes the previous session and  creates a new session that is stored in the database.
 * Lastly the method returns a status, token and refreshToken.
 * @param {string} payload - Payload containing the email and password
 * @returns {any} - Returns an object with success status, token and a refresh token
 */

export const login = async (payload: any): Promise<any> => {
  const { email, password } = payload;

  const user: any = await User.findOne({ email });
  const decodedPassword = user
    ? await bcrypt.compare(password, user?.password)
    : null;

  if (!user || !decodedPassword) {
    return { status: 401, message: 'Invalid credentials' };
  }
  const token = generateToken(user._id);
  console.log('Token:', token);

  await Session.deleteMany({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    token,
  });

  return {
    status: 200,
    sessionId: session._id,
    userId: user._id,
  };
};

/**
 * Checks if the token provided is valid or expired
 * @param {string} token - Token provided.
 * @returns {any} - Returns an object with success status and the decoded token
 */

export const validateAuthToken = async (token: string): Promise<any> => {
  const decoded = await validateToken(token);

  if (!decoded) {
    console.log('Access token invalid or expired.');
    try {
      await Session.findOneAndDelete({ token });
      console.log('Session successfully deleted.');
    } catch (error) {
      console.error('Error deleting session:', error);
    }
    return { status: 401, message: 'Access token invalid or expired.' };
  }

  return { status: 200, user: decoded };
};

/**
 * Checks if the token provided is valid or expired
 * @param {string} refreshToken - Refresh Token provided.
 * @returns {any} - Returns an object with success status and a new token
 */
export const refreshAuthToken = async (refreshToken: string): Promise<any> => {
  const decoded: any = validateToken(refreshToken, true);
  if (!decoded) {
    return { status: 401, message: 'Invalid or expired refresh token' };
  }

  const newToken = generateToken(decoded.email);

  return { status: 200, token: newToken };
};

/**
 * Retrieves the accessToken and refreshToken for a given sessionId.
 * @param {string} sessionId - The session ID.
 * @returns {any} - Returns an object with the tokens or an error message.
 */
export const getTokensBySessionId = async (sessionId: string): Promise<any> => {
  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return { status: 404, message: 'Session not found' };
    }
    return {
      status: 200,
      token: session.token,
      // refreshToken: session.refreshToken,
    };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return { status: 500, message: 'Internal server error' };
  }
};
