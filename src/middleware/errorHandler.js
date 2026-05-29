/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Create a custom application error
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
