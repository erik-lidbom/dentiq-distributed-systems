interface Service {
  name: string;
  host: string;
  port: number;
  url: string;
}

const services: Record<string, Service> = {
  booking: { name: "booking", host: "http://localhost", port: 3001, url: "http://localhost:3001/api/appointments" },
  fake: { name: "fake", host: "http://localhost", port: 3002, url: "http://localhost:3002/api" },
};

export const getService = (serviceName: string): Service | undefined => {
  return services[serviceName];
};
