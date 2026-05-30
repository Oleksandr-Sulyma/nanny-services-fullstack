import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      console.log("MONGO_URL environment variable is not defined");
      process.exit(1);
    }

    await mongoose.connect(mongoUrl);
    console.log("MongoDB connection established successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
