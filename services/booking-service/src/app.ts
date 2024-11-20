import express, { Express } from "express";
import dotenv from "dotenv";
import mqttClient from "./mqtt/mqtt";

mqttClient

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("BASIC MQTT + EXPRESS + NODE + TS SETUP");
});

app.listen(port, () => {
  console.log(`[SERVER]: Server is running at http://localhost:${port}`);
  console.log("-------------------------------------------------------")
});
