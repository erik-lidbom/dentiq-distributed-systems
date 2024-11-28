import express from 'express';
import routingController from '../controllers/routingController';

const router = express.Router();

// Dynamic route to handle optional path
router.all('/:serviceName/:path*?', routingController);

export default router;
