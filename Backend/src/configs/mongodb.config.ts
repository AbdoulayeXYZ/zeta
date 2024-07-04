import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const connectMongoDB = async () => {
  const mongoUri = process.env.MONGO_DB_URI;
  if (!mongoUri) {
    console.error('MONGO_DB_URI is not defined in the environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error: any) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectMongoDB;
