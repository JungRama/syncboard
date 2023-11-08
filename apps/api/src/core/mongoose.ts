import mongoose from "mongoose";

import { MONGODB_URI } from "~/env.config";

/**
 * Connects to the database using the provided MongoDB URI.
 *
 * @return {Promise<void>} A promise that resolves when the connection is established.
 */
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

export default connectDB;
