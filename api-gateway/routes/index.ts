import express from 'express';
import routingController from '../controllers/routingController';
import authMiddleware from '../middleware/authMiddleware';
import { rateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Dynamic route to handle optional path
router.all(
  '/:serviceName/:path*?',
  (req, res, next) => {
    const { serviceName } = req.params;

    // Apply rate limiter dynamically based on the serviceName
    const limiter = rateLimiter(serviceName);
    limiter(req, res, next);
  }
  // Authentication middleware
    // ,authMiddleware, 
    // TODO: Uncomment the line above to enable authentication
  // Routing controller to forward requests to the appropriate service
  ,routingController
);

export default router;
