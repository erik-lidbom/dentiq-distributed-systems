import { Request, Response, NextFunction } from 'express';
import { publishAndSubscribe } from '../mqtt/mqtt';

const routingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceName, path } = req.params;
    console.log(`[INFO]: Routing request to ${serviceName}`);
    console.log(`[INFO]: Path: ${path}`);

    const data = req.body || {};
    const header = req.headers;

    // Authorization header is required on every path excepts these ones.
    if (
      path !== 'login' &&
      path !== 'validate-session' &&
      serviceName !== 'auth' &&
      path !== 'create'
    ) {
      // Checks if authorization header is included in the requests. Returns authorization error if not.
      if (!header.authorization) {
        return res.status(401).json({
          success: false,
          message: 'Authorization header is required for this route',
        });
      }

      // Splits the Bearer token
      const authHeader = header.authorization;
      const token = authHeader.split(' ')[1];

      try {
        const mqttResponse: any = await publishAndSubscribe(
          'auth',
          'validate-token',
          JSON.stringify({ token }),
          10000
        );

        const parsedResponse = JSON.parse(mqttResponse);
        if (!parsedResponse.success) {
          return res.status(401).json({
            message: 'Session expired or invalid. Please re-authenticate.',
          });
        }
      } catch (error) {
        console.error('Error validating token:', error);
        return res.status(500).json({
          success: false,
          message: 'Error validating token',
        });
      }
    }

    const stringifiedData = JSON.stringify(data);

    const mqttResponse: any = await publishAndSubscribe(
      serviceName,
      path,
      stringifiedData,
      10000
    );

    const parsedResponse = JSON.parse(mqttResponse);
    console.log(
      `[INFO]: Response from ${serviceName}: ${parsedResponse.status}`
    );

    res
      .status(parsedResponse.status)
      .json({ message: parsedResponse.message, data: parsedResponse });
  } catch (error: any) {
    console.error(`[ERROR]: Internal error in routingController: ${error}`);
    return res.status(500).json({
      message: 'Internal error',
    });
  }
};

export { routingController };
