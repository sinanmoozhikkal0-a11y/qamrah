import './config/env.js';
import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';

const app = express();

// Allowed origins for CORS (React / Vite storefront and admin)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid CORS friction
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serverless DB connection middleware (ensures Mongoose is connected for Vercel functions)
app.use(async (_req, _res, next) => {
  if (process.env.VERCEL && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection error in serverless request lifecycle:', error.message);
    }
  }
  next();
});

// Base API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/home', homeRoutes);

// Root route convenience redirect
app.get('/', (_req, res) => {
  res.json({
    service: 'QAMRAH Luxury E-Commerce Backend API',
    documentation: '/api/health',
    status: 'online'
  });
});

app.get('/api', (_req, res) => {
  res.json({
    service: 'QAMRAH Luxury E-Commerce Backend API',
    documentation: '/api/health',
    status: 'online'
  });
});

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
