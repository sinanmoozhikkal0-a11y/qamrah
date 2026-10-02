import { getDatabaseStatus } from '../config/db.js';
import { sendSuccess } from '../utils/apiResponse.js';

/**
 * @route   GET /api/health
 * @desc    Health check endpoint verifying Express and MongoDB status
 * @access  Public
 */
export const checkHealth = (_req, res) => {
  const dbStatus = getDatabaseStatus();

  const healthData = {
    service: 'QAMRAH Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatus,
      connected: dbStatus === 'connected'
    },
    environment: process.env.NODE_ENV || 'development'
  };

  return sendSuccess(res, 'QAMRAH Backend API is operational', healthData);
};
