import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { initRateLimiters } from './middleware/rateLimiter';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize rate limiters
initRateLimiters();

// Dynamic routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`[API Gateway]: Running on http://localhost:${PORT}`);
});
