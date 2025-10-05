import mongoose from "mongoose";
import { env } from "~/config";

export const connectToMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {});
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
