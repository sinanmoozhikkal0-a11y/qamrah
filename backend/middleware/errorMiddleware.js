/**
 * 404 Not Found Middleware for handling unmapped routes.
 */
export const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

/**
 * Global Express Error Handling Middleware.
 */
export const errorHandler = (err, _req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error('❌ [Unhandled Server Error]:', err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
