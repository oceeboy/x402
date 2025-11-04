export interface Client {
  id: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  status: InvoiceStatus;
  createdAt: Date;
  paidAt?: Date;
  paidBy?: string;
}

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  EXPIRED = 'expired',
}

export interface PaymentRequest {
  clientId: string;
  amount: number;
  description?: string;
}

export interface PayInvoiceRequest {
  invoiceId: string;
  payerClientId: string;
}

export interface TopUpRequest {
  clientId: string;
  amount: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaymentRequiredResponse {
  error: string;
  code: 402;
  invoice: Invoice;
  message: string;
}
