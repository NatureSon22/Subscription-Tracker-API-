import { connect } from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

const connectToDB = async () => {
  if (!DB_URI) {
    throw new Error(`No detected mongodb_uri in .env.${NODE_ENV}.local`);
  }

  try {
    await connect(DB_URI);
    console.log(`Connected to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.log(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDB;
