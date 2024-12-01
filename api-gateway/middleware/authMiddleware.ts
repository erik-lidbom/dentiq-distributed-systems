import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { User } from '../types';
import { getService } from '../services/serviceRegistery'; 

// Authentication middleware
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  // For "Bearer <token>"
  const token = authHeader.split(' ')[1];

  // Retrieve the authentication service from the service registry
  const authService = getService('auth');

  if (!authService) {
    console.error('Authentication service not found in service registry');
    return res.status(500).json({ error: 'Authentication service not available' });
  }

  try {
    const response = await axios.post(`${authService.url}/validate-token`, { token });

    if (response.data.valid) {
      // Attach user info to the request
      req.user = response.data.user as User;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error validating token:', (error as Error).message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;
