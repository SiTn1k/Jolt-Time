/**
 * Currency Metadata Type
 *
 * Metadata associated with a currency balance or transaction.
 */

import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';

/**
 * Metadata for currency balances.
 */
export interface CurrencyMetadata {
  /** Currency type */
  currencyType: CurrencyTypeEnum;

  /** Display name override (optional) */
  displayName?: string;

  /** Icon URL (optional) */
  iconUrl?: string;

  /** Associated source/reason */
  source?: string;

  /** Additional notes */
  notes?: string;

  /** Custom metadata key-value pairs */
  extras?: Record<string, string | number | boolean>;
}

/**
 * Initial currency metadata with defaults.
 */
export function createDefaultCurrencyMetadata(currencyType: CurrencyTypeEnum): CurrencyMetadata {
  return {
    currencyType,
  };
}
