/**
 * Database Configuration
 * ---------------------
 * Connects to MongoDB Atlas using Mongoose.
 * Connection string is read from the MONGO_URI environment variable.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewx';

  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI not found in environment; using local fallback mongodb://127.0.0.1:27017/interviewx');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ Starting server without database connection. Set MONGO_URI in server/.env to enable auth and interview data.');
    return false;
  }
};

module.exports = connectDB;
