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
  rateLimit?: ServiceRateLimit;
}

const services: Record<string, Service> = {
  dentist: {
    name: "dentist",
    host: "http://localhost",
    port: 3002,
    url: "http://localhost:3001/api/dentist/",
    rateLimit: {
      windowMs: 60000,
      max: 20
    }
  },
  patient: {
    name: "patient",
    host: "http://localhost",
    port: 3001,
    url: "http://localhost:3002/api/patient/",
    rateLimit: {
      windowMs: 60000,
      max: 20
    }
  },
  auth: {
    name: "authentication",
    host: "http://localhost",
    port: 3003,
    url: "http://localhost:3003/api/auth/",
    rateLimit: {
      windowMs: 60000,
      max: 10
    }
  },
  logging: {
    name: "logging",
    host: "http://localhost",
    port: 3004,
    url: "http://localhost:3004/api/logging/",
    rateLimit: {
      windowMs: 60000,
      max: 50
    }
  },
  booking: {
    name: "booking",
    host: "http://localhost",
    port: 3005,
    url: "http://localhost:3005/api/appointments/",
    rateLimit: {
      windowMs: 60000,
      max: 25
    }
  },
  notification: {
    name: "notification",
    host: "http://localhost",
    port: 3006,
    url: "http://localhost:3006/api/notification",
    rateLimit: {
      windowMs: 60000,
      max: 15
    }
  },
  fake: {
    name: "fake",
    host: "http://localhost",
    port: 3007,
    url: "http://localhost:3007/api",
    rateLimit: {
      windowMs: 60000,
      max: 25
    }
  }
};

export const getService = (serviceName: string): Service | undefined => {
  return services[serviceName];
};
