import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default-secret";
const TOKEN_EXPIRY = "1h";

export const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
};

export const validateToken = (token: string): { valid: boolean; payload?: any } => {
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false };
  }
};
