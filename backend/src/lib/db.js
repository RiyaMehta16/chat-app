import mongoose from "mongoose";
import { config } from "dotenv";
config();
export const connectDB = async () => {
  try {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDb connection succesful: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDb connection error: ${error}`);
  }
};
