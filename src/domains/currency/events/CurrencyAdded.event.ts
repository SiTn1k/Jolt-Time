/**
 * Currency Added Event
 *
 * Domain event emitted when currency is added to a wallet.
 */

import type { WalletId } from '../value-objects/WalletId';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyTransactionType } from '../types/CurrencyTransactionType';

/**
 * Event data for currency addition.
 */
export interface CurrencyAddedEventData {
  /** Wallet ID */
  walletId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Currency type */
  currencyType: CurrencyTypeEnum;

  /** Amount added */
  amount: number;

  /** Balance before addition */
  previousBalance: number;

  /** Balance after addition */
  newBalance: number;

  /** Transaction type */
  transactionType: CurrencyTransactionType;

  /** Source of the currency (e.g., 'quest', 'purchase', 'reward') */
  source?: string;

  /** Reference ID (e.g., quest ID, transaction ID) */
  referenceId?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for currency addition.
 */
export interface CurrencyAddedEvent {
  /** Event type identifier */
  readonly eventType: 'CurrencyAdded';

  /** Event data */
  readonly data: CurrencyAddedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a CurrencyAddedEvent.
 */
export function createCurrencyAddedEvent(params: {
  walletId: WalletId;
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  previousBalance: number;
  newBalance: number;
  transactionType: CurrencyTransactionType;
  source?: string;
  referenceId?: string;
}): CurrencyAddedEvent {
  return {
    eventType: 'CurrencyAdded',
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
