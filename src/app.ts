import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import fs from 'fs';

import config from './config';
import logger from './utils/logger';
import routes from './routes';
import { requestLogger } from './middleware/x402.middleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeDirectories();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeDirectories(): void {
    // Ensure logs directory exists
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS
    this.app.use(
      cors({
        origin: process.env.NODE_ENV === 'production' ? false : true,
        credentials: true,
      }),
    );

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use(
      morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) },
      }),
    );

    // Custom request logger
    this.app.use(requestLogger);

    logger.info('Middlewares initialized');
  }

  private initializeRoutes(): void {
    // Mount all routes
    this.app.use('/', routes);

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
      });
    });

    logger.info('Routes initialized');
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(`Global error handler: ${error.message}`, {
          stack: error.stack,
          url: req.url,
          method: req.method,
        });

        res.status(500).json({
          success: false,
          error: 'Internal server error',
          message:
            config.nodeEnv === 'development'
              ? error.message
              : 'Something went wrong',
        });
      },
    );

    logger.info('Error handling initialized');
  }

  public listen(): void {
    this.app.listen(config.port, config.host, () => {
      logger.info(
        `🚀 InvoicePay X402 Server is running at http://${config.host}:${config.port}`,
      );
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(
        `🔗 API endpoints available at: http://${config.host}:${config.port}${config.apiPrefix}`,
      );
      logger.info(
        `💰 X402 payment endpoints available at: http://${config.host}:${config.port}${config.x402Prefix}`,
      );
      logger.info(
        `❤️  Health check: http://${config.host}:${config.port}/health`,
      );
    });
  }
}

export default App;
