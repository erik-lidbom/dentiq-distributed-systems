import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mqttClient from "./mqtt/mqtt";
import patientRouter from "./routes/patientRoutes"; // Patient routes
import connectToDB from "./db/db"; // Database connection function

// Initialize environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// MongoDB Connection
connectToDB();

//Start MQTT Client
mqttClient;

// Middleware
app.use(express.json());

// Root Route for Testing
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Microservice Running",
    endpoints: {
      patients: "/api/patients",
    },
  });
});

// Patient Routes
app.use("/api/patients", patientRouter);

// Fallback Route for Undefined Routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    message: "Please check the available routes at the root URL `/`",
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`[SERVER]: API Microservice is running at http://localhost:${port}`);
  console.log("-------------------------------------------------------");
});
