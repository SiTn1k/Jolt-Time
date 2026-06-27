/**
 * Update Balance DTO
 *
 * Data transfer object for updating a currency balance.
 * Used for adding/removing currency operations.
 */

import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyTransactionType } from '../types/CurrencyTransactionType';

/**
 * Input for updating a currency balance.
 */
export interface UpdateBalanceDto {
  /** Wallet ID */
  walletId: string;

  /** Currency type to update */
  currencyType: CurrencyTypeEnum;

  /** Amount to add (positive) or remove (negative) */
  amount: number;

  /** Transaction type for audit */
  transactionType: CurrencyTransactionType;

  /** Player profile ID for authorization */
  playerProfileId: string;

  /** Optional reason/notes */
  reason?: string;

  /** Source of the operation */
  source?: string;

  /** Reference ID (e.g., quest ID, purchase ID) */
  referenceId?: string;
}

/**
 * Validation rules for UpdateBalanceDto.
 */
export const UPDATE_BALANCE_VALIDATION = {
  walletId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    message: 'Wallet ID must be a valid UUID',
  },
  playerProfileId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    message: 'Player profile ID must be a valid UUID',
  },
  amount: {
    required: true,
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
  },
  currencyType: {
    required: true,
  },
  transactionType: {
    required: true,
  },
} as const;
