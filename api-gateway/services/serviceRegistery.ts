interface Service {
  name: string;
  host: string;
  port: number;
  url: string;
}

const services: Record<string, Service> = {
  user: { name: "user", host: "http://localhost", port: 3001, url: "http://localhost:3001/api" },
  booking: { name: "booking", host: "http://localhost", port: 3002, url: "http://localhost:3002/api/appointments" },
  fake: { name: "fake", host: "http://localhost", port: 3002, url: "http://localhost:3002/api" }, // TODO: Remove this later
  authentication: { name: 'authentication', host: 'http://localhost', port: 3003, url: 'http://localhost:3003' },
};

export const getService = (serviceName: string): Service | undefined => {
  return services[serviceName];
};
