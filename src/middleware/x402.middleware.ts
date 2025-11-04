import { Request, Response, NextFunction } from 'express';
import X402Service from '../services/x402.service';
import config from '../config';
import logger from '../utils/logger';
import { PaymentRequiredResponse } from '../models';

/**
 * Middleware to protect routes with X402 payment requirement
 */
export const x402PaymentMiddleware = (
  cost: number = config.defaultUnitCost,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientId = req.headers['x-client-id'] as string;

    if (!clientId) {
      res.status(400).json({
        success: false,
        error: 'Missing x-client-id header',
        message: 'Client ID is required for payment verification',
      });
      return;
    }

    // Check if client has sufficient credit
    if (X402Service.clientHasCredit(clientId, cost)) {
      // Deduct the cost and proceed
      const success = X402Service.deductCredit(clientId, cost);
      if (success) {
        logger.info(
          `Payment successful for client ${clientId}, cost: ${cost} units`,
        );
        next();
        return;
      }
    }

    // Insufficient balance - create invoice and return 402
    const invoice = X402Service.createInvoice(
      clientId,
      cost,
      `API access for ${req.path}`,
    );

    const paymentResponse: PaymentRequiredResponse = {
      error: 'Payment Required',
      code: 402,
      invoice: invoice,
      message: `Insufficient balance. Please pay invoice ${invoice.id} to access this resource.`,
    };

    logger.info(
      `Payment required for client ${clientId}. Invoice created: ${invoice.id}`,
    );
    res.status(402).json(paymentResponse);
  };
};

/**
 * Middleware to validate client ID header
 */
export const validateClientId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const clientId = req.headers['x-client-id'] as string;

  if (!clientId) {
    res.status(400).json({
      success: false,
      error: 'Missing x-client-id header',
      message: 'Client ID is required',
    });
    return;
  }

  // Ensure client exists
  X402Service.ensureChannel(clientId);
  next();
};

/**
 * Middleware for request logging
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const clientId = req.headers['x-client-id'] || 'anonymous';
  logger.info(`${req.method} ${req.path} - Client: ${clientId}`);
  next();
};
