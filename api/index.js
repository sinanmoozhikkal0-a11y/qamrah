import app from '../backend/app.js';
import { connectDB } from '../backend/config/db.js';

/**
 * Vercel Serverless Function entrypoint for QAMRAH Express API
 */
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (dbErr) {
    console.error('[Vercel Serverless] Database connection notice:', dbErr.message);
  }

  return app(req, res);
}
