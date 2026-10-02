import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * Generate signed JWT token with user id and role
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is missing from environment variables.');
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    secret,
    { expiresIn: '7d' }
  );
};

/**
 * Sanitize user object for API responses (excludes sensitive fields)
 */
const getSafeUserData = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new customer account
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 1. Validate required fields
    if (!name || !name.trim()) {
      return sendError(res, 'Name is required.', 400);
    }

    if (!email || !email.trim()) {
      return sendError(res, 'Email is required.', 400);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    const normalizedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(normalizedEmail)) {
      return sendError(res, 'Please provide a valid email address.', 400);
    }

    if (!password || password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long.', 400);
    }

    // 2. Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 400);
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create customer user (default role is strictly customer)
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : '',
      role: 'customer',
      isActive: true
    });

    // 5. Generate authentication token
    const token = generateToken(newUser);

    return sendSuccess(
      res,
      'Registration successful.',
      {
        token,
        user: getSafeUserData(newUser)
      },
      201
    );
  } catch (error) {
    console.error('❌ [Register Controller Error]:', error.message);
    return sendError(res, 'Registration failed: ' + error.message, 500);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { password } = req.body;
    const identifier = (req.body.email || req.body.username || '').trim().toLowerCase();

    // 1. Validate input
    if (!identifier || !password) {
      return sendError(res, 'Please provide both email/username and password.', 400);
    }

    // 2. Find user by email or name including hidden password field
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { name: new RegExp('^' + identifier + '$', 'i') }
      ]
    }).select('+password');

    if (!user) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // 3. Check if account is active
    if (!user.isActive) {
      return sendError(res, 'Your account has been deactivated. Please contact concierge.', 403);
    }

    // 4. Compare password with hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendError(res, 'Invalid email or password.', 401);
    }

    // 5. Generate token
    const token = generateToken(user);

    return sendSuccess(
      res,
      'Login successful.',
      {
        token,
        user: getSafeUserData(user)
      },
      200
    );
  } catch (error) {
    console.error('❌ [Login Controller Error]:', error.message);
    return sendError(res, 'Login failed: ' + error.message, 500);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user profile
 * @access  Private (JWT required)
 */
export const getMe = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    return sendSuccess(res, 'User profile retrieved.', {
      user: getSafeUserData(req.user)
    });
  } catch (error) {
    console.error('❌ [GetMe Controller Error]:', error.message);
    return sendError(res, 'Failed to retrieve profile: ' + error.message, 500);
  }
};
