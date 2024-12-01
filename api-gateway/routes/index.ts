import express from 'express';
import routingController from '../controllers/routingController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

// Dynamic route to handle optional path
router.all('/:serviceName/:path*?', authMiddleware, routingController);

export default router;
