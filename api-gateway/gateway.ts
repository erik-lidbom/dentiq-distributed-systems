import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Dynamic routes
app.use("/api", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`[API Gateway]: Running on http://localhost:${PORT}`);
});
