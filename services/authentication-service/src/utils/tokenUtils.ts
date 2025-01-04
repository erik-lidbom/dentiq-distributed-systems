import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default-secret';
const SECRET_REFRESH_SECRET = 'SECRET_KEY';
const TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const generateRefreshToken = (email: string) => {
  return jwt.sign({ email }, SECRET_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

export const validateToken = (token: string, isRefreshToken = false) => {
  try {
    const secret = isRefreshToken ? SECRET_REFRESH_SECRET : SECRET_KEY;
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
};
