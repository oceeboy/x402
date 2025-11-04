import { v4 as uuidv4 } from 'uuid';
import {
  Client,
  Invoice,
  InvoiceStatus,
  PaymentRequest,
  PayInvoiceRequest,
  TopUpRequest,
} from '../models';
import logger from '../utils/logger';

class X402Service {
  private clients: Map<string, Client> = new Map();
  private invoices: Map<string, Invoice> = new Map();

  /**
   * Ensure a client channel exists, create if not
   */
  ensureChannel(clientId: string): Client {
    if (!this.clients.has(clientId)) {
      const client: Client = {
        id: clientId,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.clients.set(clientId, client);
      logger.info(`Created new client channel: ${clientId}`);
    }
    return this.clients.get(clientId)!;
  }

  /**
   * Top up a client's channel balance
   */
  topUpChannel(clientId: string, amount: number): Client {
    const client = this.ensureChannel(clientId);
    client.balance += amount;
    client.updatedAt = new Date();
    this.clients.set(clientId, client);
    logger.info(
      `Topped up client ${clientId} with ${amount} units. New balance: ${client.balance}`,
    );
    return client;
  }

  /**
   * Create a payment invoice
   */
  createInvoice(
    clientId: string,
    amount: number,
    description?: string,
  ): Invoice {
    const invoice: Invoice = {
      id: uuidv4(),
      clientId,
      amount,
      status: InvoiceStatus.PENDING,
      createdAt: new Date(),
    };

    this.invoices.set(invoice.id, invoice);
    logger.info(
      `Created invoice ${invoice.id} for client ${clientId}, amount: ${amount}`,
    );
    return invoice;
  }

  /**
   * Pay an invoice (simulate off-chain payment)
   */
  payInvoice(
    invoiceId: string,
    payerClientId: string,
  ): { success: boolean; message: string; invoice?: Invoice } {
    const invoice = this.invoices.get(invoiceId);

    if (!invoice) {
      return { success: false, message: 'Invoice not found' };
    }

    if (invoice.status !== InvoiceStatus.PENDING) {
      return {
        success: false,
        message: `Invoice is already ${invoice.status}`,
      };
    }

    // Ensure payer has sufficient balance
    const payer = this.ensureChannel(payerClientId);
    if (payer.balance < invoice.amount) {
      return {
        success: false,
        message: `Insufficient balance. Required: ${invoice.amount}, Available: ${payer.balance}`,
      };
    }

    // Deduct from payer
    payer.balance -= invoice.amount;
    payer.updatedAt = new Date();
    this.clients.set(payerClientId, payer);

    // Add to invoice recipient
    const recipient = this.ensureChannel(invoice.clientId);
    recipient.balance += invoice.amount;
    recipient.updatedAt = new Date();
    this.clients.set(invoice.clientId, recipient);

    // Mark invoice as paid
    invoice.status = InvoiceStatus.PAID;
    invoice.paidAt = new Date();
    invoice.paidBy = payerClientId;
    this.invoices.set(invoiceId, invoice);

    logger.info(
      `Invoice ${invoiceId} paid by ${payerClientId}. Amount: ${invoice.amount}`,
    );
    return { success: true, message: 'Invoice paid successfully', invoice };
  }

  /**
   * Get invoice by ID
   */
  getInvoice(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }

  /**
   * Check if client has sufficient credit
   */
  clientHasCredit(clientId: string, amount: number): boolean {
    const client = this.clients.get(clientId);
    return client ? client.balance >= amount : false;
  }

  /**
   * Deduct credit from client (for successful API calls)
   */
  deductCredit(clientId: string, amount: number): boolean {
    const client = this.clients.get(clientId);
    if (!client || client.balance < amount) {
      return false;
    }

    client.balance -= amount;
    client.updatedAt = new Date();
    this.clients.set(clientId, client);
    logger.info(
      `Deducted ${amount} units from client ${clientId}. Remaining balance: ${client.balance}`,
    );
    return true;
  }

  /**
   * Get client balance
   */
  getClientBalance(clientId: string): number {
    const client = this.clients.get(clientId);
    return client ? client.balance : 0;
  }

  /**
   * Get all clients (for admin/debug purposes)
   */
  getAllClients(): Client[] {
    return Array.from(this.clients.values());
  }

  /**
   * Get all invoices (for admin/debug purposes)
   */
  getAllInvoices(): Invoice[] {
    return Array.from(this.invoices.values());
  }
}

export default new X402Service();
