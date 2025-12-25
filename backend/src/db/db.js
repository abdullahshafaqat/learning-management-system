import mongoose from 'mongoose';
import config from '../config/config.js';

const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected...');
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      connectDB(5);
    });
    
    // Handle connection errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
    });
    
  } catch (err) {
    if (retries > 0) {
      console.log(`Database connection failed. Retrying... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Database connection error:', err.message);
      process.exit(1);
    }
  }
};

export default connectDB;
