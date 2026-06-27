/**
 * CurrencyTransaction Entity
 *
 * Domain entity representing a currency transaction record.
 * Every balance modification MUST create a transaction record.
 */

import { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyTransactionType } from '../types/CurrencyTransactionType';
import type { CurrencyMetadata } from '../types/CurrencyMetadata';

/**
 * Transaction ID value object.
 */
export class TransactionId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(value: string): TransactionId {
    if (!value || value.trim().length === 0) {
      throw new Error('TransactionId cannot be empty');
    }
    return new TransactionId(value);
  }

  public static reconstruct(value: string): TransactionId {
    return new TransactionId(value);
  }

  public static generate(): TransactionId {
    const hex = '0123456789abcdef';
    const uuid = [
      hex.slice(0, 8) + '-' + hex.slice(0, 4) + '-4' + hex.slice(0, 3) + '-',
      hex[Math.floor(Math.random() * 4) + 8] + hex.slice(0, 3) + '-',
      hex.slice(0, 12),
    ].join('');
    return new TransactionId(uuid);
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: TransactionId): boolean {
    if (!(other instanceof TransactionId)) return false;
    return this._value === other._value;
  }

  public toString(): string {
    return this._value;
  }
}

/**
 * CurrencyTransaction entity properties.
 */
export interface CurrencyTransactionProps {
  transactionId: TransactionId;
  walletId: string;
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  transactionType: CurrencyTransactionType;
  balanceBefore: number;
  balanceAfter: number;
  reason?: string;
  sourceModule?: string;
  referenceId?: string;
  metadata?: CurrencyMetadata | null;
  createdAt: Date;
}

/**
 * CurrencyTransaction entity class.
 * Immutable domain entity representing a currency transaction.
 */
export class CurrencyTransaction {
  public readonly transactionId: TransactionId;
  public readonly walletId: string;
  public readonly playerProfileId: string;
  public readonly currencyType: CurrencyTypeEnum;
  public readonly amount: number;
  public readonly transactionType: CurrencyTransactionType;
  public readonly balanceBefore: number;
  public readonly balanceAfter: number;
  public readonly reason?: string;
  public readonly sourceModule?: string;
  public readonly referenceId?: string;
  public readonly metadata?: CurrencyMetadata | null;
  public readonly createdAt: Date;

  constructor(props: CurrencyTransactionProps) {
    this.transactionId = props.transactionId;
    this.walletId = props.walletId;
    this.playerProfileId = props.playerProfileId;
    this.currencyType = props.currencyType;
    this.amount = props.amount;
    this.transactionType = props.transactionType;
    this.balanceBefore = props.balanceBefore;
    this.balanceAfter = props.balanceAfter;
    this.reason = props.reason;
    this.sourceModule = props.sourceModule;
    this.referenceId = props.referenceId;
    this.metadata = props.metadata ?? null;
    this.createdAt = props.createdAt;
  }

  /**
   * Creates a new CurrencyTransaction for a deposit operation.
   */
  public static createDeposit(params: {
    transactionId: TransactionId;
    walletId: string;
    playerProfileId: string;
    currencyType: CurrencyTypeEnum;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    sourceModule?: string;
    reason?: string;
    referenceId?: string;
    metadata?: CurrencyMetadata;
  }): CurrencyTransaction {
    return new CurrencyTransaction({
      ...params,
      transactionType: CurrencyTransactionType.EARNED,
      createdAt: new Date(),
    });
  }

  /**
   * Creates a new CurrencyTransaction for a withdraw operation.
   */
  public static createWithdraw(params: {
    transactionId: TransactionId;
    walletId: string;
    playerProfileId: string;
    currencyType: CurrencyTypeEnum;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    sourceModule?: string;
    reason?: string;
    referenceId?: string;
    metadata?: CurrencyMetadata;
  }): CurrencyTransaction {
    return new CurrencyTransaction({
      ...params,
      transactionType: CurrencyTransactionType.SPENT,
      createdAt: new Date(),
    });
  }

  /**
   * Creates a new CurrencyTransaction for a transfer operation.
   */
  public static createTransfer(params: {
    transactionId: TransactionId;
    walletId: string;
    playerProfileId: string;
    currencyType: CurrencyTypeEnum;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    isOutgoing: boolean;
    sourceModule?: string;
    reason?: string;
    referenceId?: string;
    metadata?: CurrencyMetadata;
  }): CurrencyTransaction {
    return new CurrencyTransaction({
      ...params,
      transactionType: params.isOutgoing
        ? CurrencyTransactionType.TRANSFER_OUT
        : CurrencyTransactionType.TRANSFER_IN,
      createdAt: new Date(),
    });
  }

  /**
   * Creates a new CurrencyTransaction for a reserve operation.
   */
  public static createReserve(params: {
    transactionId: TransactionId;
    walletId: string;
    playerProfileId: string;
    currencyType: CurrencyTypeEnum;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reason?: string;
    referenceId?: string;
    metadata?: CurrencyMetadata;
  }): CurrencyTransaction {
    return new CurrencyTransaction({
      ...params,
      transactionType: CurrencyTransactionType.SPENT,
      sourceModule: 'CurrencyService',
      createdAt: new Date(),
    });
  }

  /**
   * Creates a new CurrencyTransaction for a release operation.
   */
  public static createRelease(params: {
    transactionId: TransactionId;
    walletId: string;
    playerProfileId: string;
    currencyType: CurrencyTypeEnum;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reason?: string;
    referenceId?: string;
    metadata?: CurrencyMetadata;
  }): CurrencyTransaction {
    return new CurrencyTransaction({
      ...params,
      transactionType: CurrencyTransactionType.REFUND,
      sourceModule: 'CurrencyService',
      createdAt: new Date(),
    });
  }

  /**
   * Creates a new CurrencyTransaction from stored data.
   */
  public static fromStorage(record: CurrencyTransactionRecord): CurrencyTransaction {
    return new CurrencyTransaction({
      transactionId: TransactionId.reconstruct(record.transactionId),
      walletId: record.walletId,
      playerProfileId: record.playerProfileId,
      currencyType: record.currencyType,
      amount: record.amount,
      transactionType: record.transactionType,
      balanceBefore: record.balanceBefore,
      balanceAfter: record.balanceAfter,
      reason: record.reason,
      sourceModule: record.sourceModule,
      referenceId: record.referenceId,
      metadata: record.metadata,
      createdAt: new Date(record.createdAt),
    });
  }

  /**
   * Checks if this is an income transaction.
   */
  public get isIncome(): boolean {
    return this.amount > 0;
  }

  /**
   * Checks if this is an expense transaction.
   */
  public get isExpense(): boolean {
    return this.amount < 0;
  }

  /**
   * Gets the net change in balance.
   */
  public get netChange(): number {
    return this.balanceAfter - this.balanceBefore;
  }

  /**
   * Serializes to a plain object.
   */
  public toJSON(): CurrencyTransactionJSON {
    return {
      transactionId: this.transactionId.value,
      walletId: this.walletId,
      playerProfileId: this.playerProfileId,
      currencyType: this.currencyType,
      amount: this.amount,
      transactionType: this.transactionType,
      balanceBefore: this.balanceBefore,
      balanceAfter: this.balanceAfter,
      reason: this.reason,
      sourceModule: this.sourceModule,
      referenceId: this.referenceId,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
    };
  }

  /**
   * Serializes to a database record.
   */
  public toRecord(): CurrencyTransactionRecord {
    return {
      transactionId: this.transactionId.value,
      walletId: this.walletId,
      playerProfileId: this.playerProfileId,
      currencyType: this.currencyType,
      amount: this.amount,
      transactionType: this.transactionType,
      balanceBefore: this.balanceBefore,
      balanceAfter: this.balanceAfter,
      reason: this.reason,
      sourceModule: this.sourceModule,
      referenceId: this.referenceId,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
    };
  }
}

/**
 * Database record representation of CurrencyTransaction.
 */
export interface CurrencyTransactionRecord {
  transactionId: string;
  walletId: string;
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  transactionType: CurrencyTransactionType;
  balanceBefore: number;
  balanceAfter: number;
  reason?: string;
  sourceModule?: string;
  referenceId?: string;
  metadata?: CurrencyMetadata | null;
  createdAt: string;
}

/**
 * JSON serialization representation of CurrencyTransaction.
 */
export interface CurrencyTransactionJSON {
  transactionId: string;
  walletId: string;
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  transactionType: CurrencyTransactionType;
  balanceBefore: number;
  balanceAfter: number;
  reason?: string;
  sourceModule?: string;
  referenceId?: string;
  metadata?: CurrencyMetadata | null;
  createdAt: string;
}