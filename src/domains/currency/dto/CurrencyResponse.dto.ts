/**
 * Currency Response DTO
 *
 * Data transfer objects for currency-related API responses.
 */

import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyStatistics } from '../types/CurrencyStatistics';

/**
 * Response DTO for a single currency balance.
 */
export interface CurrencyBalanceResponseDto {
  /** Currency type */
  currencyType: CurrencyTypeEnum;

  /** Currency display name */
  displayName: string;

  /** Currency symbol/emoji */
  symbol: string;

  /** Current balance */
  balance: number;

  /** Reserved balance */
  reservedBalance: number;

  /** Available balance (balance - reserved) */
  availableBalance: number;

  /** Last transaction timestamp */
  lastTransactionAt: string | null;
}

/**
 * Response DTO for a currency wallet.
 */
export interface CurrencyWalletResponseDto {
  /** Wallet ID */
  walletId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** All currency balances */
  balances: CurrencyBalanceResponseDto[];

  /** Total balance across all currencies (weighted) */
  totalBalance: number;

  /** Wallet creation timestamp */
  createdAt: string;

  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Summary DTO for currency wallet (minimal data).
 */
export interface CurrencyWalletSummaryDto {
  /** Wallet ID */
  walletId: string;

  /** Total balance across all currencies */
  totalBalance: number;

  /** Number of currency types held */
  currencyTypeCount: number;
}

/**
 * Response DTO for currency statistics.
 */
export interface CurrencyStatisticsResponseDto {
  /** Total earned across all time */
  totalEarned: number;

  /** Total spent across all time */
  totalSpent: number;

  /** Net change (earned - spent) */
  netChange: number;

  /** Current total balance */
  totalBalance: number;

  /** Balance by currency type */
  balanceByType: Partial<Record<CurrencyTypeEnum, number>>;

  /** Largest single transaction */
  largestTransaction: number;

  /** Average transaction amount */
  averageTransaction: number;

  /** Total transaction count */
  transactionCount: number;

  /** Last transaction timestamp */
  lastTransactionAt?: string;
}

/**
 * Response DTO for currency operation result.
 */
export interface CurrencyOperationResponseDto {
  /** Whether the operation was successful */
  success: boolean;

  /** New balance after operation */
  newBalance: number;

  /** Operation timestamp */
  timestamp: string;

  /** Error message if failed */
  error?: string;
}
