import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_DB_URI;

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables (MONGODB_URI / MONGO_DB_URI).");
    }
        await mongoose.connect(MongoDB);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
  }
};

export default connectDB;