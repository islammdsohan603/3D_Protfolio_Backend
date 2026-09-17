import mongoose from "mongoose";
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_DB_URI;
        if (!mongoURI) {
            throw new Error("MongoDB URI is not defined in environment variables (MONGODB_URI / MONGO_DB_URI).");
        }
        const conn = await mongoose.connect(mongoURI);
        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("[MongoDB] Connection error:", errorMessage);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=MongoDB.js.map