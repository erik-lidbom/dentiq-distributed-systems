import express from "express";
import mongoose from "mongoose";
import { router } from "./routes/router";
import dotenv from "dotenv";
import { mqttClient } from "./mqtt/mqtt";

dotenv.config();

const app = express();
const HOST = process.env.HOST || "http://localhost:";
const PORT = process.env.PORT;

//Initialize MQTT Client
mqttClient.setup();
// Middleware
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || "";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .catch(function (err) {
    console.log(`Failed to connect to MongoDB with URI: ${mongoURI}`);
    console.log(err.stack);
    process.exit(1);
  })
  .then(function () {
    console.log(`Connected to MongoDB with URI: ${mongoURI}`); // mistake when forward porting
  });

// Routes
app.get("/", (req, res) => {
  res.send("Notification Service is running");
});
app.use("/notification", router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${HOST}${PORT}`);
});
