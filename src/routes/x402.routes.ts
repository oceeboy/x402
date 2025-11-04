import { Router } from 'express';
import { X402Controller } from '../controllers/x402.controller';
import { validateClientId } from '../middleware/x402.middleware';

const router = Router();
const x402Controller = new X402Controller();

// Payment management routes
router.post('/create-invoice', x402Controller.createInvoice);
router.post('/pay-invoice', x402Controller.payInvoice);
router.post('/topup', x402Controller.topUp);
router.get('/invoice/:id', x402Controller.getInvoice);

// Client balance (requires client ID header)
router.get('/balance', validateClientId, x402Controller.getBalance);

// Admin/Debug routes
router.get('/admin/clients', x402Controller.getAllClients);
router.get('/admin/invoices', x402Controller.getAllInvoices);

export default router;
