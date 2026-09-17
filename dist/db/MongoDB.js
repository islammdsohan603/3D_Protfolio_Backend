import mongoose from "mongoose";
const MongoDB = process.env.MONGODB_URI || "";
const connectDB = async () => {
    try {
        await mongoose.connect(MongoDB);
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=MongoDB.js.map