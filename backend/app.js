import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import packDesignRoutes from './routes/packDesignRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import homeRoutes from './routes/homeRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import wholesaleRoutes from './routes/wholesaleRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// CORS configuration supporting local dev and production frontend deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like same-origin, curl, mobile apps, or Postman)
      if (!origin) return callback(null, true);
      if (
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.vercel.sh')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for locally uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Base /api status endpoint
app.get('/api', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'QAMRAH Backend API is active and running',
    version: '1.0.0',
    platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js Express'
  });
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
    brand: 'QAMRAH',
    mongodb: 'connected',
    cloudinary: 'enabled'
  });
});

// Mount modular REST APIs
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/pack-designs', packDesignRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/wholesale', wholesaleRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Centralized error handler
app.use(errorHandler);

export default app;
