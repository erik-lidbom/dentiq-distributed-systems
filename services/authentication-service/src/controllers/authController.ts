import { Request, Response, NextFunction } from "express";
import { generateToken, validateToken } from "../utils/tokenUtils";
import { TOPICS } from "../mqtt/topics";

export const login = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { username, password } = req.body;

    if (username === "test" && password === "password") {
      const token = generateToken("12345");
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    next(error);
  }
};

export const revokeToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ message: "Token is required" });
    }
  } catch (error) {
    next(error);
  }
};

export const validateTokenEndpoint = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { token } = req.body;

    const { valid, payload } = validateToken(token);

    if (valid) {
      res.status(200).json({ valid: true, user: payload });
    } else {
      res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
  } catch (error) {
    next(error);
  }
};
