/**
 * Create Wallet DTO
 *
 * Data transfer object for creating a new currency wallet.
 * Contains all required and optional data for wallet creation.
 */

import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';

/**
 * Input for creating a new currency wallet.
 */
export interface CreateWalletDto {
  /** Associated player profile ID */
  playerProfileId: string;

  /** Initial currency types to create balances for (optional, defaults to all) */
  initialCurrencyTypes?: CurrencyTypeEnum[];
}

/**
 * Validation rules for CreateWalletDto.
 */
export const CREATE_WALLET_VALIDATION = {
  playerProfileId: {
    required: true,
    pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    message: 'Player profile ID must be a valid UUID',
  },
  initialCurrencyTypes: {
    required: false,
  },
} as const;
