import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { sendResponse } from '../utils/sendResponse.js';

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendResponse(res, 400, false, 'Please provide both username and password.');
    }

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin) {
      return sendResponse(res, 401, false, 'Invalid username or password.');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, 401, false, 'Invalid username or password.');
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'qamrah_super_secret_jwt_key_luxury_2026_royal',
      { expiresIn: '7d' }
    );

    return sendResponse(res, 200, true, 'Logged in successfully.', {
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err) {
    return sendResponse(res, 500, false, 'Login failed: ' + err.message);
  }
};

export const getMe = async (req, res) => {
  try {
    return sendResponse(res, 200, true, 'Current admin retrieved.', {
      admin: {
        id: req.admin._id,
        username: req.admin.username,
        role: req.admin.role,
        lastLogin: req.admin.lastLogin
      }
    });
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
};

export const logoutAdmin = async (_req, res) => {
  return sendResponse(res, 200, true, 'Logged out successfully.');
};
