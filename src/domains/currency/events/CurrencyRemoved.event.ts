/**
 * Currency Removed Event
 *
 * Domain event emitted when currency is removed from a wallet.
 */

import type { WalletId } from '../value-objects/WalletId';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyTransactionType } from '../types/CurrencyTransactionType';

/**
 * Event data for currency removal.
 */
export interface CurrencyRemovedEventData {
  /** Wallet ID */
  walletId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Currency type */
  currencyType: CurrencyTypeEnum;

  /** Amount removed */
  amount: number;

  /** Balance before removal */
  previousBalance: number;

  /** Balance after removal */
  newBalance: number;

  /** Transaction type */
  transactionType: CurrencyTransactionType;

  /** Source of the operation (e.g., 'purchase', 'upgrade') */
  source?: string;

  /** Reference ID (e.g., purchase ID, upgrade ID) */
  referenceId?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for currency removal.
 */
export interface CurrencyRemovedEvent {
  /** Event type identifier */
  readonly eventType: 'CurrencyRemoved';

  /** Event data */
  readonly data: CurrencyRemovedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a CurrencyRemovedEvent.
 */
export function createCurrencyRemovedEvent(params: {
  walletId: WalletId;
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  previousBalance: number;
  newBalance: number;
  transactionType: CurrencyTransactionType;
  source?: string;
  referenceId?: string;
}): CurrencyRemovedEvent {
  return {
    eventType: 'CurrencyRemoved',
    version: 1,
    data: {
      walletId: params.walletId.value,
      playerProfileId: params.playerProfileId,
      currencyType: params.currencyType,
      amount: params.amount,
      previousBalance: params.previousBalance,
      newBalance: params.newBalance,
      transactionType: params.transactionType,
      source: params.source,
      referenceId: params.referenceId,
      occurredAt: new Date(),
    },
  };
}
