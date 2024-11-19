const rateLimit = require('express-rate-limit');
const { redisClient } = require('../config/redis');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  store: redisClient,
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = limiter;