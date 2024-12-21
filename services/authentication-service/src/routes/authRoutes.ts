import express, { Router } from "express";
import {
  validateCredentials,
  generateAuthToken,
  publishAuthResult,
  validateAuthToken,
  publishValidationResult,
} from "../controllers/authController";
import { publishMessage } from "../mqtt/mqttClient";
import { TOPICS } from "../mqtt/topics";

const router: Router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Simulate the login pipeline
    const validated = await validateCredentials({ username, password });
    const tokenGenerated = await generateAuthToken(validated);
    await publishAuthResult(tokenGenerated);

    res.status(200).json({
      success: true,
      message: "Login processed and result published to MQTT",
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[ROUTE]: Login error:", errorMessage);
    res.status(400).json({ success: false, error: errorMessage });
  }
});

router.post("/validate-token", async (req, res) => {
  try {
    const { token } = req.body;

    // Simulate the token validation pipeline
    const validatedToken = await validateAuthToken({ token });
    await publishValidationResult(validatedToken);

    res.status(200).json({
      success: true,
      message: "Token validation processed and result published to MQTT",
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[ROUTE]: Token validation error:", errorMessage);
    res.status(400).json({ success: false, error: errorMessage });
  }
});

export default router;
