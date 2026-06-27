/**
 * Balance Changed Event
 *
 * Domain event emitted when a currency balance changes.
 */

import type { WalletId } from '../value-objects/WalletId';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyTransactionType } from '../types/CurrencyTransactionType';

/**
 * Event data for balance change.
 */
export interface BalanceChangedEventData {
  /** Wallet ID */
  walletId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Currency type */
  currencyType: CurrencyTypeEnum;

  /** Previous balance */
  previousBalance: number;

  /** New balance */
  newBalance: number;

  /** Amount changed */
  amountChanged: number;

  /** Transaction type */
  transactionType: CurrencyTransactionType;

  /** Source of the change */
  source?: string;

  /** Reference ID */
  referenceId?: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for balance change.
 */
export interface BalanceChangedEvent {
  /** Event type identifier */
  readonly eventType: 'BalanceChanged';

  /** Event data */
  readonly data: BalanceChangedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a BalanceChangedEvent.
 */
export function createBalanceChangedEvent(params: {
  walletId: WalletId;
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  previousBalance: number;
  newBalance: number;
  amountChanged: number;
  transactionType: CurrencyTransactionType;
  source?: string;
  referenceId?: string;
}): BalanceChangedEvent {
  return {
    eventType: 'BalanceChanged',
    version: 1,
    data: {
      walletId: params.walletId.value,
      playerProfileId: params.playerProfileId,
      currencyType: params.currencyType,
      previousBalance: params.previousBalance,
      newBalance: params.newBalance,
      amountChanged: params.amountChanged,
      transactionType: params.transactionType,
      source: params.source,
      referenceId: params.referenceId,
      occurredAt: new Date(),
    },
  };
}
