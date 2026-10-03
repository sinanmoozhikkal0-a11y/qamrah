import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB } from './config/db.js';

// Setup ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start HTTP Server
const startServer = async () => {
  console.log('🚀 [Starting QAMRAH Backend Server]...');

  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`✨ [QAMRAH Server Ready]: Listening on http://localhost:${PORT}`);
    console.log(`🩺 [Health Check]: http://localhost:${PORT}/api/health`);
  });

  // Handle graceful shutdowns
  const shutdown = () => {
    console.log('\n🛑 [QAMRAH Server] Shutting down gracefully...');
    server.close(() => {
      console.log('💤 [QAMRAH Server] Closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  return server;
};

// Start standalone server only when not running in Vercel serverless environment
if (!process.env.VERCEL) {
  startServer();
}

export default app;
