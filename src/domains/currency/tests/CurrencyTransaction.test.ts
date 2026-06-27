/**
 * CurrencyTransaction Tests
 *
 * Unit tests for the CurrencyTransaction entity.
 */

import { describe, it, expect } from 'vitest';
import { CurrencyTransaction, TransactionId } from '../entities/CurrencyTransaction';
import { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyTransactionType } from '../types/CurrencyTransactionType';

describe('CurrencyTransaction', () => {
  const createTestTransaction = () => {
    return CurrencyTransaction.createDeposit({
      transactionId: TransactionId.generate(),
      walletId: '123e4567-e89b-42d3-a456-426614174000',
      playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
      currencyType: CurrencyTypeEnum.GOLD,
      amount: 100,
      balanceBefore: 0,
      balanceAfter: 100,
      sourceModule: 'TestModule',
      reason: 'Test deposit',
    });
  };

  describe('createDeposit', () => {
    it('should create a deposit transaction', () => {
      const transaction = createTestTransaction();

      expect(transaction.transactionType).toBe(CurrencyTransactionType.EARNED);
      expect(transaction.amount).toBe(100);
      expect(transaction.balanceBefore).toBe(0);
      expect(transaction.balanceAfter).toBe(100);
      expect(transaction.reason).toBe('Test deposit');
      expect(transaction.sourceModule).toBe('TestModule');
    });

    it('should set createdAt to current date', () => {
      const before = new Date();
      const transaction = createTestTransaction();
      const after = new Date();

      expect(transaction.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(transaction.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('createWithdraw', () => {
    it('should create a withdraw transaction with SPENT type', () => {
      const transaction = CurrencyTransaction.createWithdraw({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        currencyType: CurrencyTypeEnum.GEMS,
        amount: -50, // Negative amount for withdrawal
        balanceBefore: 100,
        balanceAfter: 50,
      });

      expect(transaction.transactionType).toBe(CurrencyTransactionType.SPENT);
      expect(transaction.amount).toBe(-50);
      expect(transaction.balanceBefore).toBe(100);
      expect(transaction.balanceAfter).toBe(50);
    });
  });

  describe('createTransfer', () => {
    it('should create TRANSFER_OUT transaction for outgoing transfer', () => {
      const transaction = CurrencyTransaction.createTransfer({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        balanceBefore: 200,
        balanceAfter: 100,
        isOutgoing: true,
      });

      expect(transaction.transactionType).toBe(CurrencyTransactionType.TRANSFER_OUT);
      expect(transaction.amount).toBe(100);
    });

    it('should create TRANSFER_IN transaction for incoming transfer', () => {
      const transaction = CurrencyTransaction.createTransfer({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174002',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174003',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        balanceBefore: 100,
        balanceAfter: 200,
        isOutgoing: false,
      });

      expect(transaction.transactionType).toBe(CurrencyTransactionType.TRANSFER_IN);
    });
  });

  describe('createReserve', () => {
    it('should create a reserve transaction', () => {
      const transaction = CurrencyTransaction.createReserve({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 50,
        balanceBefore: 100,
        balanceAfter: 100,
        referenceId: 'ref-123',
      });

      expect(transaction.transactionType).toBe(CurrencyTransactionType.SPENT);
      expect(transaction.sourceModule).toBe('CurrencyService');
      expect(transaction.referenceId).toBe('ref-123');
    });
  });

  describe('createRelease', () => {
    it('should create a release transaction', () => {
      const transaction = CurrencyTransaction.createRelease({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 50,
        balanceBefore: 100,
        balanceAfter: 100,
        referenceId: 'ref-123',
      });

      expect(transaction.transactionType).toBe(CurrencyTransactionType.REFUND);
      expect(transaction.sourceModule).toBe('CurrencyService');
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct from a record', () => {
      const record = {
        transactionId: '123e4567-e89b-42d3-a456-426614174000',
        walletId: '123e4567-e89b-42d3-a456-426614174001',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174002',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
        balanceBefore: 0,
        balanceAfter: 100,
        reason: 'Test',
        sourceModule: 'TestModule',
        referenceId: 'ref-123',
        metadata: null,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const transaction = CurrencyTransaction.fromStorage(record);

      expect(transaction.transactionId.value).toBe(record.transactionId);
      expect(transaction.walletId).toBe(record.walletId);
      expect(transaction.amount).toBe(100);
      expect(transaction.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('isIncome and isExpense', () => {
    it('should correctly identify income transactions', () => {
      const deposit = CurrencyTransaction.createDeposit({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        balanceBefore: 0,
        balanceAfter: 100,
      });

      expect(deposit.isIncome).toBe(true);
      expect(deposit.isExpense).toBe(false);
    });

    it('should correctly identify expense transactions', () => {
      const withdraw = CurrencyTransaction.createWithdraw({
        transactionId: TransactionId.generate(),
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        currencyType: CurrencyTypeEnum.GOLD,
        amount: -50, // Negative for withdrawal
        balanceBefore: 100,
        balanceAfter: 50,
      });

      expect(withdraw.isIncome).toBe(false);
      expect(withdraw.isExpense).toBe(true);
    });
  });

  describe('netChange', () => {
    it('should calculate net change correctly', () => {
      const transaction = createTestTransaction();
      expect(transaction.netChange).toBe(100);
    });
  });

  describe('toJSON and toRecord', () => {
    it('should serialize to JSON correctly', () => {
      const transaction = createTestTransaction();
      const json = transaction.toJSON();

      expect(json.transactionId).toBe(transaction.transactionId.value);
      expect(json.amount).toBe(100);
      expect(json.transactionType).toBe(CurrencyTransactionType.EARNED);
      expect(json.createdAt).toBeDefined();
    });

    it('should serialize to record correctly', () => {
      const transaction = createTestTransaction();
      const record = transaction.toRecord();

      expect(record.transactionId).toBe(transaction.transactionId.value);
      expect(record.amount).toBe(100);
    });
  });
});

describe('TransactionId', () => {
  describe('create', () => {
    it('should create a valid TransactionId', () => {
      const id = TransactionId.create('123e4567-e89b-42d3-a456-426614174000');
      expect(id.value).toBe('123e4567-e89b-42d3-a456-426614174000');
    });

    it('should throw for empty string', () => {
      expect(() => TransactionId.create('')).toThrow('TransactionId cannot be empty');
    });

    it('should throw for whitespace only', () => {
      expect(() => TransactionId.create('   ')).toThrow('TransactionId cannot be empty');
    });
  });

  describe('generate', () => {
    it('should generate unique IDs', () => {
      const id1 = TransactionId.generate();
      const id2 = TransactionId.generate();
      expect(id1.value).not.toBe(id2.value);
    });

    it('should generate valid UUID format', () => {
      const id = TransactionId.generate();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(id.value)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should correctly compare TransactionIds', () => {
      const id1 = TransactionId.create('123e4567-e89b-42d3-a456-426614174000');
      const id2 = TransactionId.create('123e4567-e89b-42d3-a456-426614174000');
      const id3 = TransactionId.create('123e4567-e89b-42d3-a456-426614174001');

      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
    });

    it('should return false for non-TransactionId', () => {
      const id = TransactionId.create('123e4567-e89b-42d3-a456-426614174000');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(id.equals('not a transaction id' as any)).toBe(false);
    });
  });
});