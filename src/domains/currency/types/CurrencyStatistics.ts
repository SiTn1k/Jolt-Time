/**
 * Currency Statistics Type
 *
 * Statistics about a player's currency holdings.
 */

import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';

/**
 * Statistics for currency holdings.
 */
export interface CurrencyStatistics {
  /** Total earned across all time */
  totalEarned: number;

  /** Total spent across all time */
  totalSpent: number;

  /** Net change (earned - spent) */
  netChange: number;

  /** Current total balance across all currencies */
  totalBalance: number;

  /** Balance by currency type */
  balanceByType: Partial<Record<CurrencyTypeEnum, number>>;

  /** Largest single transaction amount */
  largestTransaction: number;

  /** Average transaction amount */
  averageTransaction: number;

  /** Total transaction count */
  transactionCount: number;

  /** Most recent transaction timestamp */
  lastTransactionAt?: string;

  /** Most active currency type */
  mostActiveType?: CurrencyTypeEnum;
}

/**
 * Initial currency statistics with defaults.
 */
export const INITIAL_CURRENCY_STATISTICS: CurrencyStatistics = {
  totalEarned: 0,
  totalSpent: 0,
  netChange: 0,
  totalBalance: 0,
  balanceByType: {},
  largestTransaction: 0,
  averageTransaction: 0,
  transactionCount: 0,
};
