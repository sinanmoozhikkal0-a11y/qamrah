import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// On Vercel serverless functions, the file system is read-only except /tmp
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'qamrah_uploads')
  : path.join(__dirname, '../uploads');

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.warn('[Upload] Notice creating temporary upload directory:', err.message);
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|svg/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /jpeg|jpg|png|webp|gif|svg\+xml/.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, WEBP, GIF, and SVG image files are supported!'), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: fileFilter
});
