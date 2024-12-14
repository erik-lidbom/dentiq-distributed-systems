import express, { Express } from "express";
import dotenv from "dotenv";
import mqttClient from "./mqtt/mqttClient";
import authRouter from "./routes/authRoutes";

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Start MQTT client
mqttClient;

// Start the server
app.listen(port, () => {
  console.log(`[AUTH SERVICE]: Running on http://localhost:${port}`);
});
