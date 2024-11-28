import { Request, Response } from 'express';
import axios from 'axios';
import { getService } from '../services/serviceRegistery';

const routingController = async (req: Request, res: Response) => {
  try {
    const { serviceName, path } = req.params;
    const service = getService(serviceName);

    if (!service) {
      res.status(404).json({ error: `Service ${serviceName} not found` });
      return;
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

    console.log(`Forwarding request to: ${targetUrl}`);

    // Forward the request to the target service
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error('Error in routingController:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export default routingController;
