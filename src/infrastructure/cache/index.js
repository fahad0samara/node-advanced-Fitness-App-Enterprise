const Redis = require('redis');
const { LoggerService } = require('../../common/logger');

class CacheService {
  constructor() {
    this.client = Redis.createClient({
      url: process.env.REDIS_URL,
      retry_strategy: (options) => {
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    this.client.on('error', (err) => LoggerService.error('Redis Client Error', err));
    this.client.on('connect', () => LoggerService.info('Redis Client Connected'));
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      LoggerService.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl
      });
      return true;
    } catch (error) {
      LoggerService.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      LoggerService.error('Cache delete error:', error);
      return false;
    }
  }

  async flush() {
    try {
      await this.client.flushAll();
      return true;
    } catch (error) {
      LoggerService.error('Cache flush error:', error);
      return false;
    }
  }
}

module.exports = new CacheService();