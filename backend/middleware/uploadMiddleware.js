import multer from 'multer';
import path from 'path';

// Memory storage keeps file buffers in RAM, guaranteeing full compatibility
// across local Node.js and Vercel serverless functions (which have read-only filesystems).
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|svg/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image\/(jpeg|jpg|png|webp|gif|svg\+xml)/.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, WEBP, GIF, and SVG image files are supported!'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter
});
