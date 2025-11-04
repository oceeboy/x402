import { Request, Response } from 'express';
import X402Service from '../services/x402.service';
import {
  ApiResponse,
  PaymentRequest,
  PayInvoiceRequest,
  TopUpRequest,
} from '../models';
import logger from '../utils/logger';

/**
 * X402 Payment Controller - Handles all payment-related operations
 */
export class X402Controller {
  // constructor (private x402Service: typeof X402Service){}

  /**
   * POST /x402/create-invoice
   * Create a payment invoice
   */
  createInvoice = (req: Request, res: Response): void => {
    try {
      const {
        clientId,
        amount,
        description,
      }: PaymentRequest & {
        description?: string;
      } = req.body;

      if (!clientId || !amount) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: clientId, amount',
        });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0',
        });
        return;
      }

      const invoice = X402Service.createInvoice(clientId, amount, description);

      const response: ApiResponse = {
        success: true,
        data: invoice,
        message: 'Invoice created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error creating invoice:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * POST /x402/pay-invoice
   * Pay an existing invoice (simulate off-chain payment)
   */
  payInvoice = (req: Request, res: Response): void => {
    try {
      const { invoiceId, payerClientId }: PayInvoiceRequest = req.body;

      if (!invoiceId || !payerClientId) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: invoiceId, payerClientId',
        });
        return;
      }

      const result = X402Service.payInvoice(invoiceId, payerClientId);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.message,
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: result.invoice,
        message: result.message,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error paying invoice:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * POST /x402/topup
   * Add balance to client's channel
   */
  topUp = (req: Request, res: Response): void => {
    try {
      const { clientId, amount }: TopUpRequest = req.body;

      if (!clientId || !amount) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: clientId, amount',
        });
        return;
      }

      if (amount <= 0) {
        res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0',
        });
        return;
      }

      const client = X402Service.topUpChannel(clientId, amount);

      const response: ApiResponse = {
        success: true,
        data: {
          clientId: client.id,
          newBalance: client.balance,
          topUpAmount: amount,
        },
        message: 'Channel topped up successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error topping up channel:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /x402/invoice/:id
   * Get invoice status by ID
   */
  getInvoice = (req: Request, res: Response): void => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Invoice ID is required',
        });
        return;
      }

      const invoice = X402Service.getInvoice(id);

      if (!invoice) {
        res.status(404).json({
          success: false,
          error: 'Invoice not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: invoice,
        message: 'Invoice retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error retrieving invoice:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /x402/balance
   * Get client balance (requires x-client-id header)
   */
  getBalance = (req: Request, res: Response): void => {
    try {
      const clientId = req.headers['x-client-id'] as string;

      if (!clientId) {
        res.status(400).json({
          success: false,
          error: 'x-client-id header is required',
        });
        return;
      }

      const balance = X402Service.getClientBalance(clientId);

      const response: ApiResponse = {
        success: true,
        data: {
          clientId,
          balance,
        },
        message: 'Balance retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error retrieving balance:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /x402/admin/clients
   * Get all clients (for debugging/admin purposes)
   */
  getAllClients = (req: Request, res: Response): void => {
    try {
      const clients = X402Service.getAllClients();

      const response: ApiResponse = {
        success: true,
        data: clients,
        message: 'All clients retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error retrieving clients:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };

  /**
   * GET /x402/admin/invoices
   * Get all invoices (for debugging/admin purposes)
   */
  getAllInvoices = (req: Request, res: Response): void => {
    try {
      const invoices = X402Service.getAllInvoices();

      const response: ApiResponse = {
        success: true,
        data: invoices,
        message: 'All invoices retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error retrieving invoices:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}
