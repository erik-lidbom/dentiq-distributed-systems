import jwt from 'jsonwebtoken';
import Session from '../models/sessionModel';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret';
const TOKEN_EXPIRY = '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const validateToken = async (token: string, isRefreshToken = false) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Checks if the token exists in an active session
    const session = await Session.findOne({
      userId: (decoded as { id: string }).id,
      token,
    });

    if (!session) {
      throw new Error('Token does not exist in the database or is invalid');
    }
    return decoded;
  } catch (error) {
    return null;
  }
};
