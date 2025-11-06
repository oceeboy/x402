import { Router } from 'express';
import apiRoutes from './api.routes';
import x402Routes from './x402.routes';
import config from '../config';
import userRoutes from './user.routes';

const router: Router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'InvoicePay X402 Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0', // Current version
  });
});

// Mount route modules
router.use(config.apiPrefix, apiRoutes);
router.use(config.x402Prefix, x402Routes);
router.use(config.userPrefix, userRoutes);

export default router;
