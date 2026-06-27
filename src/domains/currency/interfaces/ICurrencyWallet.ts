/**
 * Currency Wallet Interface
 *
 * Interface defining the contract for CurrencyWallet entity.
 * All CurrencyWallet implementations must adhere to this interface.
 */

import type { WalletId } from '../value-objects/WalletId';
import type { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyBalance } from '../entities/CurrencyBalance';
import type { CurrencyStatistics } from '../types/CurrencyStatistics';

/**
 * Currency wallet entity interface.
 * Represents a player's currency wallet in the Jolt Time system.
 */
export interface ICurrencyWallet {
  /** Unique wallet identifier */
  readonly walletId: WalletId;

  /** Associated player profile ID */
  readonly playerProfileId: PlayerProfileId;

  /** Currency balances map */
  readonly balances: Map<CurrencyTypeEnum, CurrencyBalance>;

  /** Timestamp when wallet was created */
  readonly createdAt: Date;

  /** Timestamp when wallet was last updated */
  readonly updatedAt: Date;

  /** Total balance across all currencies */
  readonly totalBalance: { amount: number };

  /**
   * Gets a balance for a specific currency type.
   * @param currencyType The currency type
   * @returns The balance or null if not found
   */
  getBalance(currencyType: CurrencyTypeEnum): CurrencyBalance | null;

  /**
   * Gets the balance amount for a specific currency type.
   * @param currencyType The currency type
   * @returns The balance amount or 0 if not found
   */
  getBalanceAmount(currencyType: CurrencyTypeEnum): number;

  /**
   * Gets the available balance for a specific currency type.
   * @param currencyType The currency type
   * @returns The available balance amount or 0 if not found
   */
  getAvailableAmount(currencyType: CurrencyTypeEnum): number;

  /**
   * Gets all currency types that have balances.
   */
  readonly currencyTypes: CurrencyTypeEnum[];

  /**
   * Checks if the wallet has a balance for a currency type.
   * @param currencyType The currency type to check
   */
  hasCurrency(currencyType: CurrencyTypeEnum): boolean;

  /**
   * Checks if the wallet has sufficient funds for a currency type.
   * @param currencyType The currency type
   * @param amount The amount to check
   */
  hasSufficientFunds(currencyType: CurrencyTypeEnum, amount: number): boolean;

  /**
   * Gets statistics for the wallet.
   */
  getStatistics(): CurrencyStatistics;
}

/**
 * Currency balance entity interface.
 * Represents a balance for a specific currency type.
 */
export interface ICurrencyBalance {
  /** Currency type */
  readonly currencyType: { value: CurrencyTypeEnum };

  /** Current available balance */
  readonly balance: { amount: number };

  /** Reserved balance (pending transactions) */
  readonly reservedBalance: { amount: number };

  /** Timestamp of last transaction */
  readonly lastTransactionAt: Date | null;

  /** Additional metadata */
  readonly metadata: unknown;

  /**
   * Gets the available balance (total minus reserved).
   */
  readonly availableBalance: { amount: number };

  /**
   * Checks if there are reserved funds.
   */
  readonly hasReservations: boolean;

  /**
   * Checks if the balance is zero.
   */
  readonly isZero: boolean;
}
