/**
 * Wallet Created Event
 *
 * Domain event emitted when a new currency wallet is created.
 */

import type { WalletId } from '../value-objects/WalletId';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';

/**
 * Event data for wallet creation.
 */
export interface WalletCreatedEventData {
  /** Wallet ID */
  walletId: string;

  /** Player profile ID */
  playerProfileId: string;

  /** Initial currency types */
  currencyTypes: CurrencyTypeEnum[];

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for wallet creation.
 */
export interface WalletCreatedEvent {
  /** Event type identifier */
  readonly eventType: 'WalletCreated';

  /** Event data */
  readonly data: WalletCreatedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a WalletCreatedEvent.
 */
export function createWalletCreatedEvent(params: {
  walletId: WalletId;
  playerProfileId: string;
  currencyTypes: CurrencyTypeEnum[];
}): WalletCreatedEvent {
  return {
    eventType: 'WalletCreated',
    version: 1,
    data: {
      walletId: params.walletId.value,
      playerProfileId: params.playerProfileId,
      currencyTypes: params.currencyTypes,
      occurredAt: new Date(),
    },
  };
}
