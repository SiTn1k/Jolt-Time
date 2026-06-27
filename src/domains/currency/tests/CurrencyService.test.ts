/**
 * CurrencyService Tests
 *
 * Unit tests for the CurrencyService.
 * Uses mocked repositories for isolated testing.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CurrencyService } from '../../../services/CurrencyService';
import { CurrencyWallet } from '../entities/CurrencyWallet';
import { WalletId } from '../value-objects/WalletId';
import { PlayerProfileId } from '../../player-profile/value-objects/PlayerProfileId';
import { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyTransaction, TransactionId } from '../entities/CurrencyTransaction';
import { CurrencyAmount } from '../value-objects/CurrencyAmount';
import { ReservedAmount } from '../value-objects/ReservedAmount';
import { CurrencyBalance } from '../entities/CurrencyBalance';
import { CurrencyTransactionType } from '../types/CurrencyTransactionType';
import type { ICurrencyRepository } from '../interfaces/ICurrencyRepository';
import type { ICurrencyTransactionRepository } from '../repositories/ICurrencyTransactionRepository';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import type { WalletFilterParams } from '../interfaces/ICurrencyRepository';

// Helper to create wallet with custom balances
const createWalletWithBalance = (playerProfileId: string, currencyType: CurrencyTypeEnum, balance: number, reserved: number = 0) => {
  const walletId = WalletId.generate();
  const wallet = CurrencyWallet.create({
    walletId,
    playerProfileId: PlayerProfileId.reconstruct(playerProfileId),
    initialBalances: [currencyType],
  });

  const currentBalance = wallet.getBalance(currencyType)!;
  const balanceWithReserved = currentBalance
    .withBalance(CurrencyAmount.reconstruct(balance))
    .withReservedBalance(ReservedAmount.reconstruct(reserved));
  
  return wallet.withUpdatedBalance(currencyType, balanceWithReserved);
};

// Mock repository implementation
class MockCurrencyRepository implements ICurrencyRepository {
  private wallets: Map<string, CurrencyWallet> = new Map();
  private playerProfileIndex: Map<string, string> = new Map(); // playerProfileId -> walletId

  async findByPlayerProfileId(playerProfileId: string): Promise<CurrencyWallet | null> {
    const walletId = this.playerProfileIndex.get(playerProfileId);
    if (!walletId) return null;
    return this.wallets.get(walletId) ?? null;
  }

  async findById(id: WalletId): Promise<CurrencyWallet | null> {
    return this.wallets.get(id.value) ?? null;
  }

  async create(wallet: CurrencyWallet): Promise<CurrencyWallet> {
    this.wallets.set(wallet.walletId.value, wallet);
    this.playerProfileIndex.set(wallet.playerProfileId.value, wallet.walletId.value);
    return wallet;
  }

  async update(wallet: CurrencyWallet): Promise<CurrencyWallet> {
    this.wallets.set(wallet.walletId.value, wallet);
    return wallet;
  }

  async delete(id: WalletId): Promise<void> {
    const wallet = this.wallets.get(id.value);
    if (wallet) {
      this.playerProfileIndex.delete(wallet.playerProfileId.value);
    }
    this.wallets.delete(id.value);
  }

  async exists(id: WalletId): Promise<boolean> {
    return this.wallets.has(id.value);
  }

  async list(params: PaginationParams, filters?: WalletFilterParams): Promise<PaginatedResult<CurrencyWallet>> {
    throw new Error('Not implemented');
  }

  async count(filters?: WalletFilterParams): Promise<number> {
    return this.wallets.size;
  }

  // Helper to set up wallet with known balances
  setWallet(wallet: CurrencyWallet): void {
    this.wallets.set(wallet.walletId.value, wallet);
    this.playerProfileIndex.set(wallet.playerProfileId.value, wallet.walletId.value);
  }

  // Helper to clear all wallets
  clear(): void {
    this.wallets.clear();
    this.playerProfileIndex.clear();
  }
}

// Mock transaction repository implementation
class MockTransactionRepository implements ICurrencyTransactionRepository {
  private transactions: CurrencyTransaction[] = [];

  async create(transaction: CurrencyTransaction): Promise<CurrencyTransaction> {
    this.transactions.push(transaction);
    return transaction;
  }

  async findById(id: TransactionId): Promise<CurrencyTransaction | null> {
    return this.transactions.find(t => t.transactionId.equals(id)) ?? null;
  }

  async listByWallet(walletId: string, params: PaginationParams, _filters?: import('../repositories/ICurrencyTransactionRepository').TransactionFilterParams): Promise<PaginatedResult<CurrencyTransaction>> {
    const filtered = this.transactions.filter(t => t.walletId === walletId);
    return {
      items: filtered,
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async listByPlayer(playerProfileId: string, params: PaginationParams, _filters?: import('../repositories/ICurrencyTransactionRepository').TransactionFilterParams): Promise<PaginatedResult<CurrencyTransaction>> {
    const filtered = this.transactions.filter(t => t.playerProfileId === playerProfileId);
    return {
      items: filtered,
      total: filtered.length,
      page: params.page,
      pageSize: params.pageSize,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }

  async countByWallet(walletId: string, _filters?: import('../repositories/ICurrencyTransactionRepository').TransactionFilterParams): Promise<number> {
    return this.transactions.filter(t => t.walletId === walletId).length;
  }

  async sumByWalletAndType(walletId: string, currencyType: CurrencyTypeEnum, transactionTypes?: CurrencyTransactionType[]): Promise<number> {
    const filtered = this.transactions.filter(t => t.walletId === walletId && t.currencyType === currencyType);
    if (transactionTypes && transactionTypes.length > 0) {
      return filtered.filter(t => transactionTypes.includes(t.transactionType)).reduce((sum, t) => sum + t.amount, 0);
    }
    return filtered.reduce((sum, t) => sum + t.amount, 0);
  }

  async getRecentByWallet(walletId: string, limit: number): Promise<CurrencyTransaction[]> {
    return this.transactions
      .filter(t => t.walletId === walletId)
      .slice(0, limit);
  }

  // Helper to clear transactions
  clear(): void {
    this.transactions = [];
  }
}

describe('CurrencyService', () => {
  let mockWalletRepo: MockCurrencyRepository;
  let mockTransactionRepo: MockTransactionRepository;
  let currencyService: CurrencyService;

  const TEST_PLAYER_PROFILE_ID = '123e4567-e89b-42d3-a456-426614174000';
  const TEST_PLAYER_PROFILE_ID_2 = '123e4567-e89b-42d3-a456-426614174001';

  beforeEach(() => {
    mockWalletRepo = new MockCurrencyRepository();
    mockTransactionRepo = new MockTransactionRepository();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    currencyService = new CurrencyService(
      mockWalletRepo as any,
      mockTransactionRepo as any
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */
  });

  describe('createWallet', () => {
    it('should create a new wallet for a player', async () => {
      const result = await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.playerProfileId.value).toBe(TEST_PLAYER_PROFILE_ID);
      expect(result.data?.balances.size).toBe(Object.values(CurrencyTypeEnum).length);
    });

    it('should return error if wallet already exists', async () => {
      // Create first wallet
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);

      // Try to create again
      const result = await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);

      expect(result.success).toBe(false);
      expect(result.error).toContain('already exists');
    });

    it('should create wallet with only specified currency types', async () => {
      const result = await currencyService.createWallet(
        TEST_PLAYER_PROFILE_ID,
        [CurrencyTypeEnum.GOLD, CurrencyTypeEnum.GEMS]
      );

      expect(result.success).toBe(true);
      expect(result.data?.balances.size).toBe(2);
      expect(result.data?.hasCurrency(CurrencyTypeEnum.GOLD)).toBe(true);
      expect(result.data?.hasCurrency(CurrencyTypeEnum.GEMS)).toBe(true);
    });
  });

  describe('loadWallet', () => {
    it('should load an existing wallet', async () => {
      // Create wallet first
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);

      // Load it
      const result = await currencyService.loadWallet(TEST_PLAYER_PROFILE_ID);

      expect(result.success).toBe(true);
      expect(result.data?.playerProfileId.value).toBe(TEST_PLAYER_PROFILE_ID);
    });

    it('should return error for non-existent wallet', async () => {
      const result = await currencyService.loadWallet('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Wallet not found');
    });
  });

  describe('deposit', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
    });

    it('should deposit currency successfully', async () => {
      const result = await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
        reason: 'Test deposit',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe(100);
    });

    it('should create transaction record on deposit', async () => {
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });

      // Check transaction was created
      expect(mockTransactionRepo.transactions.length).toBe(1);
      expect(mockTransactionRepo.transactions[0].amount).toBe(100);
    });

    it('should reject invalid amount', async () => {
      const result = await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: -100,
        transactionType: CurrencyTransactionType.EARNED,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('negative');
    });

    it('should reject invalid currency type', async () => {
      const result = await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        currencyType: 'invalid' as any,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid currency type');
    });

    it('should accumulate deposits', async () => {
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });

      const result = await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 50,
        transactionType: CurrencyTransactionType.EARNED,
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe(150);
    });
  });

  describe('withdraw', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });
    });

    it('should withdraw currency successfully', async () => {
      const result = await currencyService.withdraw({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 30,
        transactionType: CurrencyTransactionType.SPENT,
        reason: 'Test withdrawal',
      });

      expect(result.success).toBe(true);
      expect(result.data).toBe(70);
    });

    it('should reject withdrawal exceeding balance', async () => {
      const result = await currencyService.withdraw({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 150,
        transactionType: CurrencyTransactionType.SPENT,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient funds');
    });

    it('should create transaction record on withdrawal', async () => {
      await currencyService.withdraw({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 30,
        transactionType: CurrencyTransactionType.SPENT,
      });

      expect(mockTransactionRepo.transactions.length).toBe(2); // deposit + withdraw
      const withdrawTx = mockTransactionRepo.transactions[1];
      expect(withdrawTx.amount).toBe(-30);
    });
  });

  describe('reserve', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });
    });

    it('should reserve currency successfully', async () => {
      const result = await currencyService.reserve({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 50,
        referenceId: 'purchase-123',
      });

      expect(result.success).toBe(true);
      expect(result.data?.reservedBalance).toBe(50);
    });

    it('should prevent withdrawal of reserved funds', async () => {
      await currencyService.reserve({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 80,
        referenceId: 'purchase-123',
      });

      const withdrawResult = await currencyService.withdraw({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 30, // Only 20 available (100 - 80 reserved)
        transactionType: CurrencyTransactionType.SPENT,
      });

      expect(withdrawResult.success).toBe(false);
      expect(withdrawResult.error).toContain('Insufficient funds');
    });
  });

  describe('release', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });
      await currencyService.reserve({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 50,
        referenceId: 'purchase-123',
      });
    });

    it('should release reserved currency', async () => {
      const result = await currencyService.release({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 30,
        referenceId: 'purchase-123',
      });

      expect(result.success).toBe(true);
      expect(result.data?.reservedBalance).toBe(20); // 50 - 30
    });

    it('should allow withdrawal after release', async () => {
      await currencyService.release({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 30,
        referenceId: 'purchase-123',
      });

      const withdrawResult = await currencyService.withdraw({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 50,
        transactionType: CurrencyTransactionType.SPENT,
      });

      expect(withdrawResult.success).toBe(true);
    });
  });

  describe('getBalance', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });
    });

    it('should return current balance', async () => {
      const result = await currencyService.getBalance(TEST_PLAYER_PROFILE_ID, CurrencyTypeEnum.GOLD);

      expect(result.success).toBe(true);
      expect(result.data).toBe(100);
    });

    it('should return 0 for currency with no balance', async () => {
      const result = await currencyService.getBalance(TEST_PLAYER_PROFILE_ID, CurrencyTypeEnum.EVENT_TOKENS);

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });
  });

  describe('hasSufficientFunds', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });
    });

    it('should return true when funds are sufficient', async () => {
      const result = await currencyService.hasSufficientFunds(TEST_PLAYER_PROFILE_ID, CurrencyTypeEnum.GOLD, 50);

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });

    it('should return false when funds are insufficient', async () => {
      const result = await currencyService.hasSufficientFunds(TEST_PLAYER_PROFILE_ID, CurrencyTypeEnum.GOLD, 150);

      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
    });
  });

  describe('getWalletSummary', () => {
    beforeEach(async () => {
      await currencyService.createWallet(TEST_PLAYER_PROFILE_ID);
      await currencyService.deposit({
        playerProfileId: TEST_PLAYER_PROFILE_ID,
        currencyType: CurrencyTypeEnum.GOLD,
        amount: 100,
        transactionType: CurrencyTransactionType.EARNED,
      });
    });

    it('should return wallet summary with all balances', async () => {
      const result = await currencyService.getWalletSummary(TEST_PLAYER_PROFILE_ID);

      expect(result.success).toBe(true);
      expect(result.data?.balances).toBeDefined();
      expect(result.data?.totalBalance).toBeGreaterThan(0);
    });
  });
});