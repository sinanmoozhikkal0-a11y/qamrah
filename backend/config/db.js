import '../env.js';
import mongoose from 'mongoose';
import dns from 'dns';

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (dnsErr) {
  console.warn('[MongoDB] Custom DNS setServer warning:', dnsErr.message);
}

let mongod = null;

export const connectDB = async () => {
  // 1. Check if already connected in serverless container
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. Check if currently connecting
  if (mongoose.connection.readyState === 2) {
    console.log('[MongoDB] Connection already in progress, waiting...');
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  let uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    // Sanitize any accidentally wrapped angle brackets from Atlas placeholder copy-paste
    uri = uri.replace(/<([^>]+)>/g, '$1');

    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
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
      console.warn(`[MongoDB] Atlas connection failed: ${err.message}. Attempting fallback...`);
      if (process.env.VERCEL) {
        throw new Error(`MongoDB Atlas connection error: ${err.message}. Please verify MONGODB_URI in Vercel Environment Variables.`);
      }
    }
  }

  // If on Vercel, do not attempt local or in-memory server
  if (process.env.VERCEL) {
    throw new Error('MONGODB_URI is not set. Please add MONGODB_URI in your Vercel Project Settings.');
  }

  // Fallback: try local default URI or in-memory server for local development only
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/qamrah', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected to local MongoDB at: ${conn.connection.host}`);
    return conn;
  } catch (_localErr) {
    console.log('[MongoDB] Local MongoDB server not detected. Initializing in-memory Mongo server...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        binary: {
          version: '4.4.29'
        }
      });
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB] In-Memory MongoDB running successfully at: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] Fatal error initializing MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
