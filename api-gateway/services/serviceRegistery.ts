interface ServiceRateLimit {
  // Time window in milliseconds
  windowMs: number; 
   // Maximum allowed requests per window
  max: number;     
}

interface Service {
  name: string;
  host: string;
  port: number;
  url: string;
  rateLimit: ServiceRateLimit;
}

const services: Record<string, Service> = {
  user: {
    name: "user",
    host: "http://localhost",
    port: 3001,
    url: "http://localhost:3001/api",
    rateLimit: { windowMs: 1 * 60 * 1000, max: 20 },
  },
  booking: {
    name: "booking",
    host: "http://localhost",
    port: 3002,
    url: "http://localhost:3002/api/appointments",
    rateLimit: { windowMs: 1 * 60 * 1000, max: 25 },
  },
  fake: {
    name: "fake",
    host: "http://localhost",
    port: 3002,
    url: "http://localhost:3002/api",
    rateLimit: { windowMs: 1 * 60 * 1000, max: 25 },
  },
  auth: {
    name: "authentication",
    host: "http://localhost",
    port: 3003,
    url: "http://localhost:3003",
    // Stricter limit for authentication service
    rateLimit: { windowMs: 1 * 60 * 1000, max: 10 },
  },
};

export const getService = (serviceName: string): Service | undefined => {
  return services[serviceName];
};