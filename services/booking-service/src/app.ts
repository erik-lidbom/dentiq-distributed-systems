import express, { Express } from "express";
import dotenv from "dotenv";
import mqttClient from "./mqtt/mqtt";
import appointmentRouter from "./routes/appointmentRoutes"
import connectToDB from "./db/db";

mqttClient

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

connectToDB();

app.use(express.json());
app.use("/api/appointments", appointmentRouter);

app.get("/", (req, res) => {
  res.send("BASIC MQTT + EXPRESS + NODE + TS SETUP");
});

app.listen(port, () => {
  console.log(`[SERVER]: Server is running at http://localhost:${port}`);
  console.log("-------------------------------------------------------")
});
