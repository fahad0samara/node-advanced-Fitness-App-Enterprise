const Bull = require('bull');
const { LoggerService } = require('../../common/logger');

class QueueService {
  constructor() {
    this.queues = {
      email: new Bull('email-queue', process.env.REDIS_URL),
      export: new Bull('export-queue', process.env.REDIS_URL),
      analytics: new Bull('analytics-queue', process.env.REDIS_URL)
    };

    // Set up queue event handlers
    Object.values(this.queues).forEach(queue => {
      queue.on('error', error => {
        LoggerService.error('Queue error:', error);
      });

      queue.on('completed', job => {
        LoggerService.info(`Job ${job.id} completed`);
      });

      queue.on('failed', (job, error) => {
        LoggerService.error(`Job ${job.id} failed:`, error);
      });
    });
  }

  async addJob(queueName, data, options = {}) {
    try {
      const queue = this.queues[queueName];
      if (!queue) {
        throw new Error(`Queue ${queueName} not found`);
      }

      const job = await queue.add(data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        },
        ...options
      });

      LoggerService.info(`Job ${job.id} added to ${queueName} queue`);
      return job;
    } catch (error) {
      LoggerService.error('Error adding job to queue:', error);
      throw error;
    }
  }

  async getJob(queueName, jobId) {
    const queue = this.queues[queueName];
    return await queue.getJob(jobId);
  }

  async removeJob(queueName, jobId) {
    const queue = this.queues[queueName];
    const job = await queue.getJob(jobId);
    if (job) {
      await job.remove();
      return true;
    }
    return false;
  }
}

module.exports = new QueueService();