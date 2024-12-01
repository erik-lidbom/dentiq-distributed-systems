import rateLimit from 'express-rate-limit';
import { getService } from '../services/serviceRegistery';

const rateLimiters: Record<string, ReturnType<typeof rateLimit>> = {};

// Initialize rate limiters for each service
export const initRateLimiters = () => {
  const services = ['user', 'booking', 'auth', 'notification', 'logging'];

  services.forEach((serviceName) => {
    const service = getService(serviceName);

    if (service) {
      const { windowMs = 1 * 60 * 1000, max = 20 } = service.rateLimit || {};
      rateLimiters[serviceName] = rateLimit({
        windowMs,
        max,
        message: `Too many requests to ${serviceName}. Please try again in ${Math.ceil(windowMs - Date.now()) / 1000} seconds.`,
      });
    }
  });

  // Set up a default rate limiter
  rateLimiters.default = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
  });
};

// Get rate limiter for a service
export const rateLimiter = (serviceName: string) => {
  return rateLimiters[serviceName] || rateLimiters.default;
};
