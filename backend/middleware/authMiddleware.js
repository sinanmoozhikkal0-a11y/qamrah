import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import { sendResponse } from '../utils/sendResponse.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return sendResponse(res, 401, false, 'Not authorized. Please log in as admin.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'qamrah_super_secret_jwt_key_luxury_2026_royal');

    // 1. Handle Master Admin / Fallback token
    if (decoded.id === 'master-admin' || decoded.username === 'QAMRAH') {
      let admin = null;
      if (mongoose.connection.readyState === 1) {
        try {
          if (mongoose.isValidObjectId(decoded.id)) {
            admin = await Admin.findById(decoded.id).select('-password');
          }
          if (!admin) {
            admin = await Admin.findOne({ username: 'QAMRAH' }).select('-password');
          }
        } catch (_) {}
      }

      req.admin = admin || {
        _id: 'master-admin',
        id: 'master-admin',
        username: 'QAMRAH',
        role: 'superadmin',
        lastLogin: new Date()
      };
      return next();
    }

    // 2. Standard Database Admin
    if (!mongoose.isValidObjectId(decoded.id)) {
      return sendResponse(res, 401, false, 'Invalid or expired token.');
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return sendResponse(res, 401, false, 'Admin account not found or expired.');
    }

    req.admin = admin;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Invalid or expired token.');
  }
};
