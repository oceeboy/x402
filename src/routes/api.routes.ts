import { Router } from 'express';
import { ApiController } from '../controllers/api.controller';
import { x402PaymentMiddleware } from '../middleware/x402.middleware';

const router = Router();
const apiController = new ApiController();

// Protected routes that require payment
router.get('/getUserData', x402PaymentMiddleware(1), apiController.getUserData);
router.get('/products', x402PaymentMiddleware(1), apiController.getProducts);
router.get('/orders', x402PaymentMiddleware(2), apiController.getOrders); // Higher cost for order history

export default router;
