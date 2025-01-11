import { Router } from 'express';
import { httpCreateNotification } from '../controllers/controller';

/**
 * API Router setup
 * Add a new route by adding http method, route and controller function
 */
export const router = Router();

router.post('/', httpCreateNotification);
