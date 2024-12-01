import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index";
import morgan from 'morgan';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Add this to your API Gateway setup
app.use(morgan('combined')); // Logs requests with details like method, path, status, etc.


// Dynamic routes
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`[API Gateway]: Running on http://localhost:${PORT}`);
});
