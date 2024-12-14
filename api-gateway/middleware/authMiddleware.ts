import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { User } from '../types';
import { getService } from '../services/serviceRegistery';
import { ServiceError } from '../utils/customError';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    console.error(`[AUTH ERROR]: Missing Authorization header`);
    return next(new ServiceError('Authorization header missing', 401));
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  // Retrieve the authentication service from the service registry
  const authService = getService('auth');

  if (!authService) {
    console.error(
      `[AUTH ERROR]: Authentication service not found in service registry`
    );
    return next(new ServiceError('Authentication service not available', 500));
  }

  try {
    // Validate token via the authentication service
    const response = await axios.post(`${authService.url}/validate-token`, {
      token,
    });

    if (response.data.valid) {
      // Attach user info to the request object for downstream use
      req.user = response.data.user as User;
      console.log(
        `[AUTH SUCCESS]: User ${response.data.user.id} authenticated successfully`
      );
      next();
    } else {
      console.error(`[AUTH ERROR]: Invalid token`);
      return next(new ServiceError('Invalid token', 401));
    }
  } catch (error: any) {
    // Handle errors from the authentication service
    if (error.response) {
      console.error(
        `[AUTH ERROR]: Authentication service responded with status ${error.response.status}: ${error.response.data.message || 'Unknown error'}`
      );
      return next(
        new ServiceError(
          `Authentication service error: ${error.response.data.message || 'Unknown error'}`,
          error.response.status
        )
      );
    }

    // Handle unexpected errors
    console.error(
      `[AUTH ERROR]: Error validating token: ${(error as Error).message}`
    );
    next(new ServiceError('Unauthorized', 401));
  }
};

export default authMiddleware;
