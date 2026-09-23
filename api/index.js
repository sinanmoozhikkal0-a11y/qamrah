import app from '../backend/app.js';
import { connectDB } from '../backend/config/db.js';

/**
 * Vercel Serverless Function entrypoint for QAMRAH Express API
 */
export default async function handler(req, res) {
  try {
    // Ensure MongoDB connection is cached and ready
    await connectDB();
  } catch (dbErr) {
    console.error('[Vercel Serverless] Database connection notice:', dbErr.message);
  }

  // Delegate to Express application
  return app(req, res);
}
