import Session from '../models/sessionModel';
import User from '../models/userModel';
import {
  generateRefreshToken,
  generateToken,
  validateToken,
} from '../utils/tokenUtils';
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

export const createAccount = async (
  email: string,
  password: string,
  role: string
): Promise<any> => {
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return { success: false, message: `User with role ${role} already exists` };

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashPassword, role });
  await newUser.save();

  return {
    success: true,
    message: `${role.toUpperCase()} account created successfully`,
  };
};

/**
 * Checks if the credentials are valid, and if it is valid it creates a new session that is stored in the database.
 * Lastly the method returns a status, token and refreshToken.
 * @param {string} email - Email provided.
 * @param {string} password - Password provided.
 * @returns {any} - Returns an object with success status, token and a refresh token
 */

export const login = async (email: string, password: string): Promise<any> => {
  const user: any = await User.findOne({ email });
  const decodedPassword = await bcrypt.compare(password, user?.password);

  if (!user || !decodedPassword) {
    return { success: false, message: 'Invalid credentials' };
  }

  const token = generateToken(user.email);
  const refreshToken = generateRefreshToken(user.email);

  await Session.create({ userId: user._id, refreshToken });

  return { success: true, token, refreshToken };
};

/**
 * Checks if the token provided is valid or expired
 * @param {string} token - Token provided.
 * @returns {any} - Returns an object with success status and the decoded token
 */

export const validateAuthToken = async (token: string): Promise<any> => {
  const decoded = validateToken(token);
  if (!decoded) {
    return { success: false, message: 'Invalid or expired token' };
  }
  return { success: true, user: decoded };
};

/**
 * Checks if the token provided is valid or expired
 * @param {string} refreshToken - Refresh Token provided.
 * @returns {any} - Returns an object with success status and a new token
 */
export const refreshAuthToken = async (refreshToken: string): Promise<any> => {
  const decoded: any = validateToken(refreshToken, true);
  if (!decoded) {
    return { success: false, message: 'Invalid or expired refresh token' };
  }

  const newToken = generateToken(decoded.email);

  return { success: true, token: newToken };
};
