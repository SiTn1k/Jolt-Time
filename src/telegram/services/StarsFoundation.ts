/**
 * Telegram Stars Foundation
 *
 * Provides infrastructure for Telegram Stars payments:
 * - Stars Provider
 * - Purchase Interface
 * - Transaction Interface
 * - Validation Layer
 *
 * Note: This is infrastructure only - no payment business logic.
 */

import {
  StarsTransaction,
  StarsTransactionType,
  StarsTransactionStatus,
  StarsPurchaseOptions,
  StarsPrice,
  StarsRefundOptions,
  StarsValidation,
} from '../types/stars.types';

/**
 * Stars foundation configuration.
 */
export interface StarsFoundationConfig {
  botToken: string;
  apiUrl?: string;
  currency?: string;
}

/**
 * Purchase result.
 */
export interface PurchaseResult {
  success: boolean;
  invoiceLink?: string;
  slug?: string;
  error?: string;
}

/**
 * Refund result.
 */
export interface RefundResult {
  success: boolean;
  error?: string;
}

/**
 * Transaction query options.
 */
export interface TransactionQueryOptions {
  userId?: number;
  type?: StarsTransactionType;
  status?: StarsTransactionStatus;
  limit?: number;
  offset?: number;
  fromDate?: Date;
  toDate?: Date;
}

/**
 * Telegram Stars Foundation
 *
 * Infrastructure for handling Telegram Stars transactions.
 * All payment business logic should be handled by upper layers.
 */
export class StarsFoundation {
  private static instance: StarsFoundation | null = null;
  private botToken: string;
  private apiUrl: string;
  private defaultCurrency: string;

  private constructor(config: StarsFoundationConfig) {
    this.botToken = config.botToken;
    this.apiUrl = config.apiUrl ?? 'https://api.telegram.org';
    this.defaultCurrency = config.currency ?? 'TON';
  }

  /**
   * Get singleton instance.
   */
  static getInstance(config: StarsFoundationConfig): StarsFoundation {
    if (!StarsFoundation.instance) {
      StarsFoundation.instance = new StarsFoundation(config);
    }
    return StarsFoundation.instance;
  }

  /**
   * Reset singleton instance.
   */
  static resetInstance(): void {
    StarsFoundation.instance = null;
  }

  /**
   * Create a Stars invoice for purchase.
   */
  async createPurchaseInvoice(options: StarsPurchaseOptions): Promise<PurchaseResult> {
    try {
      const response = await this.request<{
        ok: boolean;
        result: { invoice_link: string; slug: string };
      }>('/createStarsInvoice', {
        title: options.title,
        description: options.description,
        currency: options.currency ?? this.defaultCurrency,
        prices: options.prices,
        payload: options.payload,
        photo_url: options.photoUrl,
        photo_size: options.photoSize,
        photo_width: options.photoWidth,
        photo_height: options.photoHeight,
        need_name: options.needName,
        need_phone_number: options.needPhoneNumber,
        need_email: options.needEmail,
        need_shipping_address: options.needShippingAddress,
        is_flexible: options.isFlexible,
        send_phone_number_to_provider: options.sendPhoneNumberToProvider,
        send_email_to_provider: options.sendEmailToProvider,
        provider_data: options.providerData,
        flexible: options.isFlexible,
      });

      return {
        success: true,
        invoiceLink: response.result.invoice_link,
        slug: response.result.slug,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Create a simple Stars purchase with single price.
   */
  async createSimplePurchase(
    title: string,
    amount: number,
    payload?: string
  ): Promise<PurchaseResult> {
    return this.createPurchaseInvoice({
      title,
      prices: [{ label: title, amount }],
      payload,
    });
  }

  /**
   * Get transaction details.
   */
  async getTransaction(transactionId: string): Promise<StarsTransaction | null> {
    try {
      const response = await this.request<{
        ok: boolean;
        result: StarsTransaction;
      }>('/getStarsTransaction', {
        transaction_id: transactionId,
      });
      return response.result;
    } catch {
      return null;
    }
  }

  /**
   * Get list of transactions.
   */
  async getTransactions(options: TransactionQueryOptions = {}): Promise<StarsTransaction[]> {
    try {
      const response = await this.request<{
        ok: boolean;
        result: StarsTransaction[];
      }>('/getStarsTransactions', {
        user_id: options.userId,
        type: options.type,
        status: options.status,
        limit: options.limit ?? 100,
        offset: options.offset ?? 0,
        from_date: options.fromDate?.getTime(),
        to_date: options.toDate?.getTime(),
      });
      return response.result;
    } catch {
      return [];
    }
  }

  /**
   * Get user's Stars balance.
   */
  async getUserStarsBalance(userId: number): Promise<number | null> {
    try {
      const response = await this.request<{
        ok: boolean;
        result: { stars: number; withdraw_balance: number };
      }>('/getUserStarsBalance', {
        user_id: userId,
      });
      return response.result.stars;
    } catch {
      return null;
    }
  }

  /**
   * Refund a Stars transaction.
   */
  async refundTransaction(options: StarsRefundOptions): Promise<RefundResult> {
    try {
      await this.request('/refundStarsPayment', {
        telegram_payment_charge_id: options.telegramPaymentChargeId,
        amount: options.amount,
        currency: options.currency,
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Validate Stars transaction.
   */
  validateTransaction(transaction: Partial<StarsTransaction>): StarsValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!transaction.id) {
      errors.push('Transaction ID is required');
    }

    if (!transaction.userId) {
      errors.push('User ID is required');
    }

    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Amount must be positive');
    }

    if (!transaction.type) {
      errors.push('Transaction type is required');
    }

    if (!transaction.status) {
      errors.push('Transaction status is required');
    }

    // Check for suspicious patterns
    if (transaction.amount && transaction.amount > 10000) {
      warnings.push('Large transaction amount detected');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate purchase payload.
   */
  validatePurchasePayload(payload: string): StarsValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!payload || payload.length === 0) {
      errors.push('Payload is empty');
    }

    if (payload.length > 128) {
      errors.push('Payload exceeds maximum length of 128 characters');
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9_.-]+$/.test(payload)) {
      errors.push('Payload contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Format Stars amount for display.
   */
  formatStarsAmount(amount: number): string {
    return `⭐ ${amount}`;
  }

  /**
   * Parse Stars amount from string.
   */
  parseStarsAmount(value: string): number | null {
    // Remove stars emoji and whitespace
    const cleaned = value.replace(/⭐/g, '').trim();
    const amount = parseInt(cleaned, 10);
    return isNaN(amount) ? null : amount;
  }

  /**
   * Convert currency to Stars.
   * Note: This is a simplified conversion - actual rates may vary.
   */
  convertToStars(amount: number, currency: string): number {
    // Simplified conversion rates (these should come from configuration or API)
    const rates: Record<string, number> = {
      USD: 0.25, // $0.25 per Star
      EUR: 0.23,
      GBP: 0.20,
      RUB: 25,
      // Add more currencies as needed
    };

    const rate = rates[currency] ?? 1;
    return Math.ceil(amount / rate);
  }

  /**
   * Create transaction record structure.
   */
  createTransactionRecord(
    userId: number,
    amount: number,
    type: StarsTransactionType,
    payload?: string
  ): Partial<StarsTransaction> {
    return {
      userId,
      amount,
      type,
      currency: this.defaultCurrency,
      status: StarsTransactionStatus.PENDING,
      payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Make an API request to Telegram.
   */
  private async request<T>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> {
    const url = `${this.apiUrl}/bot${this.botToken}${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Telegram Stars API error: ${error.description}`);
    }

    return response.json() as Promise<T>;
  }
}

/**
 * Get Stars foundation instance.
 */
export function getStarsFoundation(config: StarsFoundationConfig): StarsFoundation {
  return StarsFoundation.getInstance(config);
}
