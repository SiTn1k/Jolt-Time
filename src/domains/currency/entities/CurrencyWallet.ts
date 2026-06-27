/**
 * CurrencyWallet Entity
 *
 * Domain entity representing a player's currency wallet.
 * The wallet is the central storage for all currency balances.
 */

import type { ICurrencyWallet } from '../interfaces/ICurrencyWallet';
import { WalletId } from '../value-objects/WalletId';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { CurrencyType, CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyAmount } from '../value-objects/CurrencyAmount';
import { CurrencyBalance, CurrencyBalanceRecord, CurrencyBalanceJSON } from './CurrencyBalance';
import type { CurrencyStatistics } from '../types/CurrencyStatistics';

/**
 * CurrencyWallet entity class.
 * Immutable domain entity representing a player's currency wallet.
 */
export class CurrencyWallet implements ICurrencyWallet {
  /** Unique wallet identifier */
  public readonly walletId: WalletId;

  /** Associated player profile ID */
  public readonly playerProfileId: PlayerProfileId;

  /** Currency balances by type */
  public readonly balances: Map<CurrencyTypeEnum, CurrencyBalance>;

  /** Timestamp when wallet was created */
  public readonly createdAt: Date;

  /** Timestamp when wallet was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new CurrencyWallet instance.
   * @param props Wallet properties
   */
  constructor(props: CurrencyWalletProps) {
    this.walletId = props.walletId;
    this.playerProfileId = props.playerProfileId;
    this.balances = props.balances;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Creates a new CurrencyWallet for a player profile.
   * Factory method for new wallet creation.
   */
  public static create(params: {
    walletId: WalletId;
    playerProfileId: PlayerProfileId;
    initialBalances?: CurrencyTypeEnum[];
  }): CurrencyWallet {
    const now = new Date();
    const balances = new Map<CurrencyTypeEnum, CurrencyBalance>();

    // Initialize with zero balances for all specified currency types
    const currencyTypes = params.initialBalances ?? Object.values(CurrencyTypeEnum);
    for (const type of currencyTypes) {
      balances.set(type, CurrencyBalance.create({ currencyType: type }));
    }

    return new CurrencyWallet({
      walletId: params.walletId,
      playerProfileId: params.playerProfileId,
      balances,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs a CurrencyWallet from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: CurrencyWalletRecord): CurrencyWallet {
    const balances = new Map<CurrencyTypeEnum, CurrencyBalance>();

    for (const balanceRecord of record.balances) {
      const balance = CurrencyBalance.fromStorage(balanceRecord);
      balances.set(balanceRecord.currencyType, balance);
    }

    return new CurrencyWallet({
      walletId: WalletId.reconstruct(record.walletId),
      playerProfileId: PlayerProfileId.reconstruct(record.playerProfileId),
      balances,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  /**
   * Gets a balance for a specific currency type.
   * @param currencyType The currency type
   * @returns The balance or null if not found
   */
  public getBalance(currencyType: CurrencyTypeEnum): CurrencyBalance | null {
    return this.balances.get(currencyType) ?? null;
  }

  /**
   * Gets the balance amount for a specific currency type.
   * @param currencyType The currency type
   * @returns The balance amount or 0 if not found
   */
  public getBalanceAmount(currencyType: CurrencyTypeEnum): number {
    const balance = this.balances.get(currencyType);
    return balance?.balance.amount ?? 0;
  }

  /**
   * Gets the available balance for a specific currency type.
   * @param currencyType The currency type
   * @returns The available balance amount or 0 if not found
   */
  public getAvailableAmount(currencyType: CurrencyTypeEnum): number {
    const balance = this.balances.get(currencyType);
    return balance?.availableBalance.amount ?? 0;
  }

  /**
   * Gets the total balance across all currencies.
   */
  public get totalBalance(): CurrencyAmount {
    let total = 0;
    for (const balance of this.balances.values()) {
      total += balance.balance.amount;
    }
    return CurrencyAmount.reconstruct(total);
  }

  /**
   * Gets all currency types that have balances.
   */
  public get currencyTypes(): CurrencyTypeEnum[] {
    return Array.from(this.balances.keys());
  }

  /**
   * Checks if the wallet has a balance for a currency type.
   * @param currencyType The currency type to check
   */
  public hasCurrency(currencyType: CurrencyTypeEnum): boolean {
    return this.balances.has(currencyType);
  }

  /**
   * Checks if the wallet has sufficient funds for a currency type.
   * @param currencyType The currency type
   * @param amount The amount to check
   */
  public hasSufficientFunds(currencyType: CurrencyTypeEnum, amount: number): boolean {
    const balance = this.balances.get(currencyType);
    if (!balance) return false;
    return balance.hasSufficientFunds(amount);
  }

  /**
   * Gets statistics for the wallet.
   */
  public getStatistics(): CurrencyStatistics {
    const balanceByType: Partial<Record<CurrencyTypeEnum, number>> = {};
    let totalBalance = 0;

    for (const [type, balance] of this.balances) {
      balanceByType[type] = balance.balance.amount;
      totalBalance += balance.balance.amount;
    }

    return {
      totalEarned: 0,
      totalSpent: 0,
      netChange: 0,
      totalBalance,
      balanceByType,
      largestTransaction: 0,
      averageTransaction: 0,
      transactionCount: 0,
    };
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new CurrencyWallet instance.
   */
  public copyWith(params: Partial<CurrencyWalletProps>): CurrencyWallet {
    return new CurrencyWallet({
      walletId: params.walletId ?? this.walletId,
      playerProfileId: params.playerProfileId ?? this.playerProfileId,
      balances: params.balances ?? this.balances,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Creates a copy with an updated balance.
   */
  public withUpdatedBalance(
    currencyType: CurrencyTypeEnum,
    newBalance: CurrencyBalance
  ): CurrencyWallet {
    const newBalances = new Map(this.balances);
    newBalances.set(currencyType, newBalance);
    return this.copyWith({ balances: newBalances });
  }

  /**
   * Serializes the CurrencyWallet to a plain object.
   */
  public toJSON(): CurrencyWalletJSON {
    const balancesJSON: CurrencyBalanceJSON[] = [];
    for (const balance of this.balances.values()) {
      balancesJSON.push(balance.toJSON());
    }

    return {
      walletId: this.walletId.value,
      playerProfileId: this.playerProfileId.value,
      balances: balancesJSON,
      totalBalance: this.totalBalance.amount,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

/**
 * CurrencyWallet properties interface for constructor.
 */
export interface CurrencyWalletProps {
  walletId: WalletId;
  playerProfileId: PlayerProfileId;
  balances: Map<CurrencyTypeEnum, CurrencyBalance>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Database record representation of CurrencyWallet.
 */
export interface CurrencyWalletRecord {
  walletId: string;
  playerProfileId: string;
  balances: CurrencyBalanceRecord[];
  createdAt: string;
  updatedAt: string;
}

/**
 * JSON serialization representation of CurrencyWallet.
 */
export interface CurrencyWalletJSON {
  walletId: string;
  playerProfileId: string;
  balances: CurrencyBalanceJSON[];
  totalBalance: number;
  createdAt: string;
  updatedAt: string;
}
