import express, { Router } from "express";
import { login, revokeToken, validateTokenEndpoint } from "../controllers/authController";

const router: Router = express.Router();

router.post("/login", login); // User login
router.post("/validate-token", validateTokenEndpoint); // Token validation
router.post("/revoke-token", revokeToken); // Token revocation

export default router;
