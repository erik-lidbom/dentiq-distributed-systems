import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { getService } from '../services/serviceRegistery';
import { ServiceError } from '../utils/customError'; // Custom Error Classes

const routingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceName, path } = req.params;
    const service = getService(serviceName);

    if (!service) {
      throw new ServiceError(`Service ${serviceName} not found`, 404);
    }

    // Construct target URL dynamically
    let targetUrl = service.url;

    if (path) {
      targetUrl += `/${path}`;
    }

    // Append query parameters if present
    const queryString = Object.entries(req.query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
      .join('&');

    if (queryString) {
      targetUrl += `?${queryString}`;
    }

    console.log(`[INFO]: Forwarding request to: ${targetUrl}`);

    // Forward the request to the target service
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).send(response.data);
  } catch (error: any) {
    if (error.response) {
      // Backend service error
      console.error(`[ERROR]: Backend service error at ${error.config.url}`);
      return next(
        new ServiceError(
          `Error from service ${req.params.serviceName}: ${error.response.data.message || 'Unknown error'}`,
          error.response.status
        )
      );
    }

    console.error(`[ERROR]: Internal error in routingController: ${error.message}`);
    // Pass unexpected errors to global error handler
    next(error); 
  }
};

export default routingController;
