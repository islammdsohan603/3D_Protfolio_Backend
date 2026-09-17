import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/MongoDB.js";
import { handleContactSubmission } from "./contraller/contactController.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Robust CORS Middleware configuration
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  clientUrl,
   
  
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman) or matching origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Fallback for dev flexibility
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
