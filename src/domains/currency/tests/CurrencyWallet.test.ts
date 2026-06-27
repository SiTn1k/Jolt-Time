/**
 * CurrencyWallet Tests
 *
 * Unit tests for the CurrencyWallet entity.
 */

import { describe, it, expect } from 'vitest';
import { CurrencyWallet } from '../entities/CurrencyWallet';
import { WalletId } from '../value-objects/WalletId';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyBalance } from '../entities/CurrencyBalance';

describe('CurrencyWallet', () => {
  const createTestWallet = () => {
    return CurrencyWallet.create({
      walletId: WalletId.generate(),
      playerProfileId: PlayerProfileId.reconstruct('123e4567-e89b-42d3-a456-426614174000'),
      initialBalances: [CurrencyTypeEnum.GOLD, CurrencyTypeEnum.GEMS],
    });
  };

  describe('create', () => {
    it('should create a wallet with specified currency types', () => {
      const wallet = createTestWallet();

      expect(wallet.walletId).toBeDefined();
      expect(wallet.playerProfileId).toBeDefined();
      expect(wallet.balances.size).toBe(2);
      expect(wallet.hasCurrency(CurrencyTypeEnum.GOLD)).toBe(true);
      expect(wallet.hasCurrency(CurrencyTypeEnum.GEMS)).toBe(true);
    });

    it('should initialize all balances to zero', () => {
      const wallet = createTestWallet();

      expect(wallet.getBalanceAmount(CurrencyTypeEnum.GOLD)).toBe(0);
      expect(wallet.getBalanceAmount(CurrencyTypeEnum.GEMS)).toBe(0);
    });

    it('should create with all currency types if none specified', () => {
      const wallet = CurrencyWallet.create({
        walletId: WalletId.generate(),
        playerProfileId: PlayerProfileId.reconstruct('123e4567-e89b-42d3-a456-426614174000'),
      });

      // Should have all currency types
      expect(wallet.balances.size).toBe(Object.values(CurrencyTypeEnum).length);
    });

    it('should set createdAt and updatedAt', () => {
      const before = new Date();
      const wallet = createTestWallet();
      const after = new Date();

      expect(wallet.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(wallet.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(wallet.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  describe('fromStorage', () => {
    it('should reconstruct from storage record', () => {
      const now = new Date().toISOString();
      const record = {
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        balances: [
          {
            currencyType: CurrencyTypeEnum.GOLD,
            balance: 100,
            reservedBalance: 0,
            lastTransactionAt: null,
            metadata: null,
          },
          {
            currencyType: CurrencyTypeEnum.GEMS,
            balance: 50,
            reservedBalance: 10,
            lastTransactionAt: null,
            metadata: null,
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      const wallet = CurrencyWallet.fromStorage(record);

      expect(wallet.walletId.value).toBe(record.walletId);
      expect(wallet.getBalanceAmount(CurrencyTypeEnum.GOLD)).toBe(100);
      expect(wallet.getBalanceAmount(CurrencyTypeEnum.GEMS)).toBe(50);
    });
  });

  describe('getBalance', () => {
    it('should return balance for existing currency type', () => {
      const wallet = createTestWallet();
      const balance = wallet.getBalance(CurrencyTypeEnum.GOLD);

      expect(balance).not.toBeNull();
      expect(balance?.balance.amount).toBe(0);
    });

    it('should return null for non-existing currency type', () => {
      const wallet = createTestWallet();
      const balance = wallet.getBalance(CurrencyTypeEnum.EVENT_TOKENS);

      expect(balance).toBeNull();
    });
  });

  describe('getBalanceAmount', () => {
    it('should return balance amount', () => {
      const wallet = createTestWallet();
      expect(wallet.getBalanceAmount(CurrencyTypeEnum.GOLD)).toBe(0);
    });

    it('should return 0 for non-existing currency type', () => {
      const wallet = createTestWallet();
      expect(wallet.getBalanceAmount(CurrencyTypeEnum.EVENT_TOKENS)).toBe(0);
    });
  });

  describe('hasCurrency', () => {
    it('should return true for existing currency', () => {
      const wallet = createTestWallet();
      expect(wallet.hasCurrency(CurrencyTypeEnum.GOLD)).toBe(true);
    });

    it('should return false for non-existing currency', () => {
      const wallet = createTestWallet();
      expect(wallet.hasCurrency(CurrencyTypeEnum.EVENT_TOKENS)).toBe(false);
    });
  });

  describe('hasSufficientFunds', () => {
    it('should return false when balance is zero', () => {
      const wallet = createTestWallet();
      expect(wallet.hasSufficientFunds(CurrencyTypeEnum.GOLD, 100)).toBe(false);
    });
  });

  describe('totalBalance', () => {
    it('should calculate total balance across all currencies', () => {
      const record = {
        walletId: '123e4567-e89b-42d3-a456-426614174000',
        playerProfileId: '123e4567-e89b-42d3-a456-426614174001',
        balances: [
          {
            currencyType: CurrencyTypeEnum.GOLD,
            balance: 100,
            reservedBalance: 0,
            lastTransactionAt: null,
            metadata: null,
          },
          {
            currencyType: CurrencyTypeEnum.GEMS,
            balance: 50,
            reservedBalance: 0,
            lastTransactionAt: null,
            metadata: null,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const wallet = CurrencyWallet.fromStorage(record);
      expect(wallet.totalBalance.amount).toBe(150);
    });
  });

  describe('currencyTypes', () => {
    it('should return array of currency types', () => {
      const wallet = createTestWallet();
      const types = wallet.currencyTypes;

      expect(types).toContain(CurrencyTypeEnum.GOLD);
      expect(types).toContain(CurrencyTypeEnum.GEMS);
    });
  });

  describe('withUpdatedBalance', () => {
    it('should create new wallet with updated balance', () => {
      const wallet = createTestWallet();
      const newBalance = CurrencyBalance.create({ currencyType: CurrencyTypeEnum.GOLD, initialBalance: 500 });
      const updatedWallet = wallet.withUpdatedBalance(CurrencyTypeEnum.GOLD, newBalance);

      expect(updatedWallet.getBalanceAmount(CurrencyTypeEnum.GOLD)).toBe(500);
      expect(wallet.getBalanceAmount(CurrencyTypeEnum.GOLD)).toBe(0); // Original unchanged
    });
  });

  describe('copyWith', () => {
    it('should create new wallet with updated fields', () => {
      const wallet = createTestWallet();
      const updatedWallet = wallet.copyWith({});

      expect(updatedWallet.walletId).toBe(wallet.walletId);
      expect(updatedWallet.createdAt).toBe(wallet.createdAt);
      expect(updatedWallet.updatedAt.getTime()).toBeGreaterThanOrEqual(wallet.updatedAt.getTime());
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON correctly', () => {
      const wallet = createTestWallet();
      const json = wallet.toJSON();

      expect(json.walletId).toBe(wallet.walletId.value);
      expect(json.playerProfileId).toBe(wallet.playerProfileId.value);
      expect(json.balances).toBeDefined();
      expect(Array.isArray(json.balances)).toBe(true);
      expect(json.totalBalance).toBe(0);
    });
  });

  describe('getStatistics', () => {
    it('should return wallet statistics', () => {
      const wallet = createTestWallet();
      const stats = wallet.getStatistics();

      expect(stats).toBeDefined();
      expect(stats.totalBalance).toBe(0);
      expect(stats.balanceByType).toBeDefined();
    });
  });
});