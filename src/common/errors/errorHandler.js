const { AppError } = require('./AppError');
const { LoggerService } = require('../logger');

const errorHandler = (err, req, res, next) => {
  LoggerService.error('Error occurred:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details
      }
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'fail',
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: Object.values(err.errors).map(e => e.message)
      }
    });
  }

  // Handle other specific error types here

  // Default error response
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Something went wrong'
        : err.message
    }
  });
};

module.exports = { errorHandler };