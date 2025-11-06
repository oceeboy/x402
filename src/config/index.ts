import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface AppConfig {
  port: number;
  host: string;
  nodeEnv: string;
  apiPrefix: string;
  x402Prefix: string;
  userPrefix: string;
  defaultUnitCost: number;
  logLevel: string;
  logFile: string;
  enableMockData: boolean;
}

const config: AppConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api',
  x402Prefix: process.env.X402_PREFIX || '/x402',
  userPrefix: process.env.USER_PREFIX || '/users',
  defaultUnitCost: parseInt(process.env.DEFAULT_UNIT_COST || '1', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  logFile: process.env.LOG_FILE || 'logs/app.log',
  enableMockData: process.env.ENABLE_MOCK_DATA === 'true',
};

export default config;
