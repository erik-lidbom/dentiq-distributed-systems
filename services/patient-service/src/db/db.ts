import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8883;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error(
    '[DB] MONGO_URI is not defined in the environment variables.'
  );
}

const connectToDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log(`[DB] Connected to MongoDB: ${mongoURI}`);
  } catch (error) {
    console.error(`[DB] Failed to connect to MongoDB: ${mongoURI}`);
    console.error(error);
    process.exit(1);
  }
};

export default connectToDB;
