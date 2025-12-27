import 'reflect-metadata';
import dotenv from 'dotenv';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { connectDatabase } from './config/database';
import { routes } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { validateEnvironmentVariables } from './config/environmentVariables';
import { logger } from './shared/utils/logger';
import { ServiceStatus } from './shared/utils/constants';

// Load environment variables
const envFile = '.env';

const dotenvResult = dotenv.config({ path: envFile, debug: process.env.DEBUG === 'true' });

if (dotenvResult.error) {
  logger.error(`Failed to load ${envFile}:`, dotenvResult.error);
  process.exit(1);
}

const getApp = async () => {
  const app = express();

  // Validate environment variables
  validateEnvironmentVariables();

  // Connect to the database
  await connectDatabase();

  // Middleware
  app.use(cors());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(errorHandler);

  // Default 404 Route
  app.use((req, res) => {
    const message = `Route not found: ${req.method} ${req.originalUrl}`;
    res.status(StatusCodes.NOT_FOUND).json({
      code: ServiceStatus.FAILURE,
      message: message,
      data: null,
    });
  });

  return app;
};

async function startApp() {
  const app = await getApp();
  const port = process.env.PORT || 8001;

  app.listen(port, () => {
    logger.info('=================================');
    logger.info('🚀 Server is starting up...');
    logger.info(`📡 API SERVER RUNNING ON PORT: ${port}`);
    logger.info(`🔗 Server URL: http://localhost:${port}`);
    logger.info(`👷 Worker ID: ${process.pid}`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENVIRONMENT}`);
    logger.info(`⏰ Started at: ${new Date().toISOString()}`);
    logger.info('=================================');
  });
}

startApp();
