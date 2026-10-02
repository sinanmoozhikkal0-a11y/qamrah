import '../env.js';
import mongoose from 'mongoose';

let isConnecting = null;
let lastFailTime = 0;
const RETRY_COOLDOWN_MS = 20000; // 20s cooldown after connection failure to avoid stalling serverless invocations

export const connectDB = async () => {
  // 1. Return immediately if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. Return active connection promise if already in flight
  if (isConnecting) {
    return isConnecting;
  }

  // 3. If recent attempt failed, wait for cooldown before retrying to prevent blocking responses
  if (Date.now() - lastFailTime < RETRY_COOLDOWN_MS) {
    return null;
  }

  let uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    // Sanitize any accidentally wrapped angle brackets from Atlas placeholder copy-paste
    uri = uri.replace(/<([^>]+)>/g, '$1');

    isConnecting = (async () => {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 3500,
          connectTimeoutMS: 4000,
          socketTimeoutMS: 30000,
          maxPoolSize: 10,
          retryWrites: true
        });

        console.log(`[MongoDB] Atlas connected successfully to: ${conn.connection.host}`);

        // Set up mongoose connection event listeners once
        if (mongoose.connection.listenerCount('error') === 0) {
          mongoose.connection.on('error', (err) => {
            console.error('[MongoDB] Connection error event:', err.message);
          });

          mongoose.connection.on('disconnected', () => {
            console.warn('[MongoDB] Connection disconnected. Attempting reconnect...');
          });

          mongoose.connection.on('reconnected', () => {
            console.log('[MongoDB] Connection re-established.');
          });
        }

        return conn;
      } catch (err) {
        lastFailTime = Date.now();
        console.warn(`[MongoDB] Atlas connection warning: ${err.message}.`);
        console.warn('[MongoDB] If this is an IP whitelist error, ensure 0.0.0.0/0 is added in MongoDB Atlas -> Network Access.');
        return null;
      } finally {
        isConnecting = null;
      }
    })();

    return isConnecting;
  }

  // Fallback: try local default URI for local development only
  if (!process.env.VERCEL) {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/qamrah', {
        serverSelectionTimeoutMS: 1500
      });
      console.log(`[MongoDB] Connected to local MongoDB at: ${conn.connection.host}`);
      return conn;
    } catch {
      console.log('[MongoDB] Local MongoDB server not detected. Running with resilient memory store.');
      return null;
    }
  }

  return null;
};

export const closeDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

