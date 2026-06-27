/**
 * Telegram Stars Types
 *
 * Type definitions for Telegram Stars payments.
 */

/**
 * Stars transaction types.
 */
export enum StarsTransactionType {
  PAYMENT = 'payment',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
  INVOICE = 'invoice',
}

/**
 * Stars transaction status.
 */
export enum StarsTransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Stars transaction.
 */
export interface StarsTransaction {
  id: string;
  userId: number;
  botId: number;
  amount: number;
  currency: string;
  type: StarsTransactionType;
  status: StarsTransactionStatus;
  title?: string;
  payload?: string;
  invoicePayload?: string;
  telegramPaymentChargeId?: string;
  providerPaymentChargeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Stars withdrawal.
 */
export interface StarsWithdrawal {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  status: StarsTransactionStatus;
  providerWithdrawalUrl?: string;
  withdrawalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Stars purchase options.
 */
export interface StarsPurchaseOptions {
  title: string;
  description?: string;
  currency?: string;
  prices: StarsPrice[];
  payload?: string;
  photoUrl?: string;
  photoSize?: number;
  photoWidth?: number;
  photoHeight?: number;
  needName?: boolean;
  needPhoneNumber?: boolean;
  needEmail?: boolean;
  needShippingAddress?: boolean;
  isFlexible?: boolean;
  sendPhoneNumberToProvider?: boolean;
  sendEmailToProvider?: boolean;
  providerData?: string;
  flexible?: boolean;
}

/**
 * Stars price.
 */
export interface StarsPrice {
  label: string;
  amount: number;
}

/**
 * Stars refund options.
 */
export interface StarsRefundOptions {
  telegramPaymentChargeId: string;
  amount: number;
  currency: string;
}

/**
 * Stars validation result.
 */
export interface StarsValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
