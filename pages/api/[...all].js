import app from '../../backend/app.js';
import { connectDB } from '../../backend/config/db.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.warn('[Next.js API] Database notice:', err.message);
  }

  return app(req, res);
}
