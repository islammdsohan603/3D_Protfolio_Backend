import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_DB_URI || process.env.MONGODB_URI;

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    if (!MONGODB_URI) {
      throw new Error("MONGO_DB_URI is not defined in environment variables");
    }
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default connectDB;