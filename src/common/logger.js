const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

class LoggerService {
  static info(message, meta = {}) {
    logger.info(message, { ...meta, timestamp: new Date() });
  }

  static error(message, error = null, meta = {}) {
    logger.error(message, {
      error: error?.stack || error,
      ...meta,
      timestamp: new Date()
    });
  }

  static warn(message, meta = {}) {
    logger.warn(message, { ...meta, timestamp: new Date() });
  }

  static debug(message, meta = {}) {
    logger.debug(message, { ...meta, timestamp: new Date() });
  }
}

module.exports = { logger, LoggerService };