import mongoose from "mongoose";
import config from "config";
import debug from "debug";
const log = debug("mychat");

const connection = async () => {
  try {
    await mongoose.connect(`mongodb://localhost/NewChat`);
    log("Connected to MongoDB NewChat");
  } catch (error) {
    log("Error connecting to MongoDB", error.message);
  }
};

export default connection;
