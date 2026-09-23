import './env.js';
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

    // 3. Start Express server on 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`=========================================`);
      console.log(`  QAMRAH Backend API & CMS Server       `);
      console.log(`  URL: http://127.0.0.1:${PORT}          `);
      console.log(`  Status: Running in ${process.env.NODE_ENV || 'development'} mode `);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start QAMRAH backend server:', error.message);
    process.exit(1);
  }
};

startServer();
