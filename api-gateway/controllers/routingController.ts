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
  }
};

export { routingController };
