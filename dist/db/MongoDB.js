import mongoose from "mongoose";
let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }
    const mongoUri = process.env.MONGO_DB_URI || process.env.MONGODB_URI;
    try {
        if (!mongoUri) {
            throw new Error("MONGO_DB_URI or MONGODB_URI is not defined in environment variables");
        }
        const db = await mongoose.connect(mongoUri);
        isConnected = !!db.connections[0].readyState;
        console.log("[MongoDB] Connected successfully");
    }
    catch (error) {
        console.error("[MongoDB] Connection error:", error);
    }
};
export default connectDB;
//# sourceMappingURL=MongoDB.js.map