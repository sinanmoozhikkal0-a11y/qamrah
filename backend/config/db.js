import mongoose from 'mongoose';
import dns from 'dns';

/**
 * Connects to MongoDB database using Mongoose.
 * Reads connection string from MONGO_URI environment variable.
 */
export const connectDB = async () => {
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

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log(`🌿 [MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    if (error.message.includes('IP that isn\'t whitelisted') || error.message.includes('Could not connect to any servers')) {
      console.warn('💡 [Atlas IP Whitelist Notice]: In MongoDB Atlas, go to "Network Access" and ensure your current IP or 0.0.0.0/0 (Allow Access from Anywhere) is enabled.');
    }
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
    console.log('🌿 [MongoDB Closed]');
  }
};
