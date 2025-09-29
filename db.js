// db.js
import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();
// Use the MONGO_URL from environment variables

const mongoURL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;