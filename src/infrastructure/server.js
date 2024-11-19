const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const actuator = require('express-actuator');
const { createServer } = require('http');
const socketIO = require('socket.io');
const apm = require('elastic-apm-node');

const { setupMiddleware } = require('./middleware');
const { setupRoutes } = require('./routes');
const { logger } = require('../common/logger');
const { connectDB } = require('./database');
const { setupWebSockets } = require('./websocket');
const { redisClient } = require('./cache');
const { errorHandler } = require('../common/errors/errorHandler');

// Initialize APM if enabled
if (process.env.ELASTIC_APM_ENABLED === 'true') {
  apm.start({
    serviceName: 'fitness-app',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL
  });
}

class Server {
  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = socketIO(this.httpServer);
    this.setupServer();
  }

  async setupServer() {
    // Security middleware
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(actuator());

    // Setup middleware
    setupMiddleware(this.app);

    // Connect to databases
    await connectDB();
    await redisClient.connect();

    // Setup WebSocket
    setupWebSockets(this.io);

    // Setup routes
    setupRoutes(this.app);

    // Global error handler
    this.app.use(errorHandler);
  }

  start() {
    const port = process.env.PORT || 3000;
    this.httpServer.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  }

  async stop() {
    await redisClient.disconnect();
    await mongoose.disconnect();
    this.httpServer.close();
  }
}

const server = new Server();
server.start();

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

module.exports = server;