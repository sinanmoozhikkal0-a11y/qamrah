import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

import { connectDB, closeDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[Seed] Standalone seeding completed successfully.');
    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
