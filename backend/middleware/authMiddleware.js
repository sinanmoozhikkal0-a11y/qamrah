import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

/**
 * Authentication Middleware: Protects routes by verifying JWT Bearer token
 * and attaching authenticated user document to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      return sendError(res, 'Authentication token format is invalid.', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ [Auth Middleware Error]: JWT_SECRET is not defined in environment variables.');
      return sendError(res, 'Server configuration error.', 500);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return sendError(res, 'Authentication token has expired. Please sign in again.', 401);
      }
      return sendError(res, 'Authentication token is invalid.', 401);
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'User belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'User account is deactivated.', 403);
    }

    // Attach authenticated user to request
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Authentication check failed: ' + error.message, 500);
  }
};

/**
 * Authorization Middleware: Reusable guard ensuring req.user has admin role.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Forbidden: Admin privilege required.', 403);
  }
  next();
};
