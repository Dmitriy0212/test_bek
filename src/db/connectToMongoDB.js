import mongoose from "mongoose";
import { User, Article, Session } from "../models/index.js";

export const connectMongoDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    await mongoose.connect(mongoUrl);
    console.log("✅ MongoDB connection established successfully");
    await Promise.all([User.syncIndexes(), Article.syncIndexes(), Session.syncIndexes()]);
    console.log("Indexes synced successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};
