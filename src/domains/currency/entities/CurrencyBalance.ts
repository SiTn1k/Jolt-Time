/**
 * CurrencyBalance Entity
 *
 * Domain entity representing a balance for a specific currency type.
 * Each wallet can have multiple currency balances (one per currency type).
 */

import type { ICurrencyBalance } from '../interfaces/ICurrencyWallet';
import { CurrencyType, CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyAmount } from '../value-objects/CurrencyAmount';
import { ReservedAmount } from '../value-objects/ReservedAmount';
import type { CurrencyMetadata } from '../types/CurrencyMetadata';

/**
 * CurrencyBalance entity class.
 * Immutable domain entity representing a currency balance.
 */
export class CurrencyBalance implements ICurrencyBalance {
  /** Currency type */
  public readonly currencyType: CurrencyType;

  /** Current available balance */
  public readonly balance: CurrencyAmount;

  /** Reserved balance (pending transactions) */
  public readonly reservedBalance: ReservedAmount;

  /** Timestamp of last transaction */
  public readonly lastTransactionAt: Date | null;

  /** Additional metadata */
  public readonly metadata: CurrencyMetadata | null;

  /**
   * Creates a new CurrencyBalance instance.
   * @param props Balance properties
   */
  constructor(props: CurrencyBalanceProps) {
    this.currencyType = props.currencyType;
    this.balance = props.balance;
    this.reservedBalance = props.reservedBalance;
    this.lastTransactionAt = props.lastTransactionAt ?? null;
    this.metadata = props.metadata ?? null;
  }

  /**
   * Creates a new CurrencyBalance for a currency type.
   * Factory method for new balance creation.
   */
  public static create(params: {
    currencyType: CurrencyTypeEnum;
    initialBalance?: number;
  }): CurrencyBalance {
    return new CurrencyBalance({
      currencyType: CurrencyType.create(params.currencyType),
      balance: CurrencyAmount.create(params.initialBalance ?? 0),
      reservedBalance: ReservedAmount.zero(),
      lastTransactionAt: null,
      metadata: { currencyType: params.currencyType },
    });
  }

  /**
   * Reconstructs a CurrencyBalance from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromStorage(record: CurrencyBalanceRecord): CurrencyBalance {
    return new CurrencyBalance({
      currencyType: CurrencyType.create(record.currencyType),
      balance: CurrencyAmount.reconstruct(record.balance),
      reservedBalance: ReservedAmount.reconstruct(record.reservedBalance),
      lastTransactionAt: record.lastTransactionAt ? new Date(record.lastTransactionAt) : null,
      metadata: record.metadata ?? null,
    });
  }

  /**
   * Gets the available balance (total minus reserved).
   */
  public get availableBalance(): CurrencyAmount {
    const available = this.balance.amount - this.reservedBalance.amount;
    return CurrencyAmount.reconstruct(Math.max(0, available));
  }

  /**
   * Checks if there are reserved funds.
   */
  public get hasReservations(): boolean {
    return this.reservedBalance.amount > 0;
  }

  /**
   * Checks if the balance is zero.
   */
  public get isZero(): boolean {
    return this.balance.isZero;
  }

  /**
   * Checks if there are sufficient available funds.
   * @param amount The amount to check
   */
  public hasSufficientFunds(amount: number): boolean {
    return this.availableBalance.amount >= amount;
  }

  /**
   * Creates a copy with updated fields.
   * Returns a new CurrencyBalance instance.
   */
  public copyWith(params: Partial<CurrencyBalanceProps>): CurrencyBalance {
    return new CurrencyBalance({
      currencyType: params.currencyType ?? this.currencyType,
      balance: params.balance ?? this.balance,
      reservedBalance: params.reservedBalance ?? this.reservedBalance,
      lastTransactionAt: params.lastTransactionAt ?? this.lastTransactionAt,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Creates a copy with updated balance.
   */
  public withBalance(newBalance: CurrencyAmount): CurrencyBalance {
    return this.copyWith({
      balance: newBalance,
      lastTransactionAt: new Date(),
    });
  }

  /**
   * Creates a copy with updated reserved balance.
   */
  public withReservedBalance(newReserved: ReservedAmount): CurrencyBalance {
    return this.copyWith({
      reservedBalance: newReserved,
      lastTransactionAt: new Date(),
    });
  }

  /**
   * Serializes the CurrencyBalance to a plain object.
   */
  public toJSON(): CurrencyBalanceJSON {
    return {
      currencyType: this.currencyType.value,
      balance: this.balance.amount,
      reservedBalance: this.reservedBalance.amount,
      availableBalance: this.availableBalance.amount,
      lastTransactionAt: this.lastTransactionAt?.toISOString() ?? null,
      metadata: this.metadata,
    };
  }
}

/**
 * CurrencyBalance properties interface for constructor.
 */
export interface CurrencyBalanceProps {
  currencyType: CurrencyType;
  balance: CurrencyAmount;
  reservedBalance: ReservedAmount;
  lastTransactionAt?: Date | null;
  metadata?: CurrencyMetadata | null;
}

/**
 * Storage record representation of CurrencyBalance.
 */
export interface CurrencyBalanceRecord {
  currencyType: CurrencyTypeEnum;
  balance: number;
  reservedBalance: number;
  lastTransactionAt: string | null;
  metadata: CurrencyMetadata | null;
}

/**
 * JSON serialization representation of CurrencyBalance.
 */
export interface CurrencyBalanceJSON {
  currencyType: CurrencyTypeEnum;
  balance: number;
  reservedBalance: number;
  availableBalance: number;
  lastTransactionAt: string | null;
  metadata: CurrencyMetadata | null;
}
