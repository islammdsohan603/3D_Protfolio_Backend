import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./db/MongoDB.js";
import { handleContactSubmission } from "./contraller/contactController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS Configuration
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const allowedOrigins = [
  clientUrl,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, postman, server-to-server) or listed origins
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        // Also allow vercel.app domains if needed
        if (origin.endsWith(".vercel.app")) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.post("/api/contact", handleContactSubmission);

// roote route
app.get("/", (_req: Request, res: Response) => {
  res.send("Backend server is running successfully!");
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "OK", serverTime: new Date().toISOString() });
});

// Start Express Server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`[Server] Express backend server running on port ${PORT}`);
    console.log(`[Server] Configured CORS allowed origin: ${clientUrl}`);
  });
}

export default app;
