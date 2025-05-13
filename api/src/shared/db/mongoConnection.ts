import mongoose from "mongoose";
import { appLogger } from "../utils/logger";

const connectDb = async () => {
  try {
   
    await mongoose.connect(`${process.env["MONGO_URI"]}`);
    appLogger.info("✅ MongoDB Connected...");
  } catch (error) {
    appLogger.error(error, "MongoDB Connection Error:");
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  appLogger.error("❌ MongoDB Disconnected!");
  appLogger.info("Attempting to reconnect...");
  setTimeout(() => {
    mongoose.connect(`${process.env["MONGO_URI"]}`).catch((err) => {
      appLogger.error(err, "Reconnect failed:");
    });
  }, 5000);
});

mongoose.connection.on("connected", () => {
  appLogger.info("✅ MongoDB Reconnected!");
});

export default connectDb;
