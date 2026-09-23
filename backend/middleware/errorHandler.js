export const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]:', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value: ${field}. Please use another value.`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Multer errors
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = `Upload error: ${err.message}`;
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};
