import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Global cache for Mongoose connection in serverless environments (Vercel).
 * Prevents multiple connections during serverless function invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let lastConnectAttempt = 0;
const RETRY_COOLDOWN_MS = 15000;

/**
 * Connects to MongoDB database using Mongoose.
 * Reads connection string from MONGO_URI environment variable.
 * Compatible with both persistent servers and Vercel serverless functions.
 */
export const connectDB = async () => {
  // If connection is already established, return it immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  // If a connection attempt failed recently, avoid stalling request pipelines repeatedly
  const now = Date.now();
  if (!cached.promise && now - lastConnectAttempt < RETRY_COOLDOWN_MS) {
    return null;
  }
  lastConnectAttempt = now;

  let mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('❌ [Database Error]: MONGO_URI is not defined in environment variables.');
    return null;
  }

  // Auto-clean common Atlas copy-paste placeholder brackets: <password> -> password
  mongoUri = mongoUri.replace(/:<([^>]+)>/, ':$1');

  // Ensure database name is included if trailing with single slash
  if (mongoUri.endsWith('.mongodb.net/')) {
    mongoUri = `${mongoUri}qamrah?retryWrites=true&w=majority`;
  }

  // On Windows, configure DNS servers for reliable MongoDB+SRV resolution
  if (mongoUri.startsWith('mongodb+srv://')) {
    try {
      dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    } catch {
      // Ignore if environment prevents setting custom DNS
    }
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log(`🌿 [MongoDB Connected]: ${m.connection.host}/${m.connection.name}`);
      return m.connection;
    }).catch((error) => {
      cached.promise = null;
      console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
      if (error.message.includes('IP that isn\'t whitelisted') || error.message.includes('Could not connect to any servers')) {
        console.warn('💡 [Atlas IP Whitelist Notice]: In MongoDB Atlas, go to "Network Access" and ensure your current IP or 0.0.0.0/0 (Allow Access from Anywhere) is enabled.');
      }
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch {
    cached.conn = null;
    cached.promise = null;
    return null;
  }
};

/**
 * Checks current MongoDB connection status.
 */
export const getDatabaseStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    console.log('🌿 [MongoDB Closed]');
  }
};
