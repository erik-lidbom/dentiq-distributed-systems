import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret';
const TOKEN_EXPIRY = '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const validateToken = (token: string, isRefreshToken = false) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    return null;
  }
};
