import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend directory or project root
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Auto-seed admin and initial QAMRAH catalog if needed
    await seedDatabase();

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`  QAMRAH Backend API & CMS Server       `);
      console.log(`  URL: http://localhost:${PORT}          `);
      console.log(`  Status: Running in ${process.env.NODE_ENV || 'development'} mode `);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start QAMRAH backend server:', error.message);
    process.exit(1);
  }
};

startServer();
