/**
 * Currency Service
 *
 * Production service for managing currency operations.
 * This is the SINGLE SOURCE OF TRUTH for the entire game economy.
 *
 * IMPORTANT: Direct balance modification is FORBIDDEN.
 * Every balance change MUST go through CurrencyService.
 * Every balance change MUST generate CurrencyTransaction.
 *
 * Features:
 * - Wallet creation and initialization
 * - Deposit (add currency)
 * - Withdraw (remove currency)
 * - Transfer (between wallets)
 * - Reserve (for pending transactions)
 * - Release reserved currency
 * - Balance validation
 * - Overflow protection
 * - Negative balance protection
 */

import { randomUUID } from 'crypto';
import type { ICurrencyRepository } from '../domains/currency/interfaces/ICurrencyRepository';
import type { ICurrencyTransactionRepository } from '../domains/currency/repositories/ICurrencyTransactionRepository';
import { CurrencyWallet } from '../domains/currency/entities/CurrencyWallet';
import { CurrencyBalance } from '../domains/currency/entities/CurrencyBalance';
import { CurrencyTransaction, TransactionId } from '../domains/currency/entities/CurrencyTransaction';
import { WalletId } from '../domains/currency/value-objects/WalletId';
import { CurrencyType, CurrencyTypeEnum } from '../domains/currency/value-objects/CurrencyType';
import { CurrencyAmount } from '../domains/currency/value-objects/CurrencyAmount';
import { ReservedAmount } from '../domains/currency/value-objects/ReservedAmount';
import { PlayerProfileId } from '../domains/player-profile/value-objects/PlayerProfileId';
import type { CurrencyTransactionType } from '../domains/currency/types/CurrencyTransactionType';
import type { CurrencyStatistics } from '../domains/currency/types/CurrencyStatistics';
import type { PaginationParams, PaginatedResult } from '../shared/types/base.types';
import { createLogger } from '../core/logging/logger.service';
import { CurrencyAmountValidator } from '../domains/currency/validators/CurrencyAmountValidator';
import { CurrencyTypeValidator } from '../domains/currency/validators/CurrencyTypeValidator';
import { WalletValidator } from '../domains/currency/validators/WalletValidator';
import { SupabaseCurrencyRepository } from '../domains/currency/repositories/SupabaseCurrencyRepository';
import { SupabaseCurrencyTransactionRepository } from '../domains/currency/repositories/SupabaseCurrencyTransactionRepository';

const logger = createLogger('CurrencyService');

/**
 * Result type for service operations.
 */
export type CurrencyServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Input for deposit operation.
 */
export interface DepositInput {
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  transactionType: CurrencyTransactionType;
  reason?: string;
  sourceModule?: string;
  referenceId?: string;
}

/**
 * Input for withdraw operation.
 */
export interface WithdrawInput {
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  transactionType: CurrencyTransactionType;
  reason?: string;
  sourceModule?: string;
  referenceId?: string;
}

/**
 * Input for transfer operation.
 */
export interface TransferInput {
  fromPlayerProfileId: string;
  toPlayerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  reason?: string;
  sourceModule?: string;
  referenceId?: string;
}

/**
 * Input for reserve operation.
 */
export interface ReserveInput {
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  referenceId: string;
  reason?: string;
}

/**
 * Input for release operation.
 */
export interface ReleaseInput {
  playerProfileId: string;
  currencyType: CurrencyTypeEnum;
  amount: number;
  referenceId: string;
  reason?: string;
}

/**
 * Balance summary for a currency type.
 */
export interface CurrencyBalanceSummary {
  currencyType: CurrencyTypeEnum;
  balance: number;
  reservedBalance: number;
  availableBalance: number;
}

/**
 * Wallet summary with all balances.
 */
export interface WalletSummary {
  walletId: string;
  playerProfileId: string;
  balances: CurrencyBalanceSummary[];
  totalBalance: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Currency Service
 * Single source of truth for all currency operations in the game.
 */
export class CurrencyService {
  private readonly walletRepository: ICurrencyRepository;
  private readonly transactionRepository: ICurrencyTransactionRepository;

  /**
   * Creates a new CurrencyService instance.
   */
  constructor(
    walletRepository?: ICurrencyRepository,
    transactionRepository?: ICurrencyTransactionRepository
  ) {
    this.walletRepository = walletRepository ?? new SupabaseCurrencyRepository();
    this.transactionRepository = transactionRepository ?? new SupabaseCurrencyTransactionRepository();
  }

  /**
   * Creates a new wallet for a player profile.
   * Called automatically when a Player Profile is created.
   *
   * @param playerProfileId The player profile ID
   * @param initialCurrencyTypes Optional array of currency types to initialize
   * @returns CurrencyServiceResult with the created wallet
   */
  async createWallet(
    playerProfileId: string,
    initialCurrencyTypes?: CurrencyTypeEnum[]
  ): Promise<CurrencyServiceResult<CurrencyWallet>> {
    logger.info('Creating currency wallet', { playerProfileId });

    // Validate player profile ID
    if (!WalletValidator.isValidPlayerProfileId(playerProfileId)) {
      return { success: false, error: 'Invalid player profile ID format' };
    }

    try {
      // Check if wallet already exists
      const existingWallet = await this.walletRepository.findByPlayerProfileId(playerProfileId);
      if (existingWallet) {
        logger.warn('Wallet already exists for player profile', { playerProfileId });
        return { success: false, error: 'Wallet already exists for this player profile' };
      }

      // Generate wallet ID
      const walletId = WalletId.reconstruct(randomUUID());
      const profileId = PlayerProfileId.reconstruct(playerProfileId);

      // Create wallet with all currency types initialized
      const wallet = CurrencyWallet.create({
        walletId,
        playerProfileId: profileId,
        initialBalances: initialCurrencyTypes,
      });

      // Persist to database
      const createdWallet = await this.walletRepository.create(wallet);

      logger.info('Currency wallet created successfully', {
        walletId: createdWallet.walletId.value,
        playerProfileId,
        currencyTypes: createdWallet.currencyTypes,
      });

      return { success: true, data: createdWallet };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      logger.error('Failed to create currency wallet', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads a wallet by player profile ID.
   *
   * @param playerProfileId The player profile ID
   * @returns CurrencyServiceResult with the wallet
   */
  async loadWallet(playerProfileId: string): Promise<CurrencyServiceResult<CurrencyWallet>> {
    logger.debug('Loading currency wallet', { playerProfileId });

    try {
      const wallet = await this.walletRepository.findByPlayerProfileId(playerProfileId);

      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      return { success: true, data: wallet };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load wallet';
      logger.error('Failed to load currency wallet', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Loads or creates a wallet for a player profile.
   * Useful for ensuring a wallet exists before operations.
   *
   * @param playerProfileId The player profile ID
   * @returns CurrencyServiceResult with the wallet
   */
  async loadOrCreateWallet(playerProfileId: string): Promise<CurrencyServiceResult<CurrencyWallet>> {
    logger.debug('Loading or creating currency wallet', { playerProfileId });

    // Try to load existing wallet
    const loadResult = await this.loadWallet(playerProfileId);
    if (loadResult.success) {
      return loadResult;
    }

    // Create new wallet if not found
    return this.createWallet(playerProfileId);
  }

  /**
   * Gets the balance for a specific currency type.
   *
   * @param playerProfileId The player profile ID
   * @param currencyType The currency type
   * @returns CurrencyServiceResult with the balance
   */
  async getBalance(
    playerProfileId: string,
    currencyType: CurrencyTypeEnum
  ): Promise<CurrencyServiceResult<number>> {
    logger.debug('Getting currency balance', { playerProfileId, currencyType });

    const walletResult = await this.loadWallet(playerProfileId);
    if (!walletResult.success) {
      return { success: false, error: walletResult.error };
    }

    const balance = walletResult.data.getBalanceAmount(currencyType);
    return { success: true, data: balance };
  }

  /**
   * Gets the available balance (total - reserved) for a currency type.
   *
   * @param playerProfileId The player profile ID
   * @param currencyType The currency type
   * @returns CurrencyServiceResult with the available balance
   */
  async getAvailableBalance(
    playerProfileId: string,
    currencyType: CurrencyTypeEnum
  ): Promise<CurrencyServiceResult<number>> {
    logger.debug('Getting available currency balance', { playerProfileId, currencyType });

    const walletResult = await this.loadWallet(playerProfileId);
    if (!walletResult.success) {
      return { success: false, error: walletResult.error };
    }

    const available = walletResult.data.getAvailableAmount(currencyType);
    return { success: true, data: available };
  }

  /**
   * Checks if a player has sufficient funds for a currency type.
   *
   * @param playerProfileId The player profile ID
   * @param currencyType The currency type
   * @param amount The amount to check
   * @returns CurrencyServiceResult with boolean
   */
  async hasSufficientFunds(
    playerProfileId: string,
    currencyType: CurrencyTypeEnum,
    amount: number
  ): Promise<CurrencyServiceResult<boolean>> {
    logger.debug('Checking sufficient funds', { playerProfileId, currencyType, amount });

    const walletResult = await this.loadWallet(playerProfileId);
    if (!walletResult.success) {
      return { success: false, error: walletResult.error };
    }

    const hasSufficient = walletResult.data.hasSufficientFunds(currencyType, amount);
    return { success: true, data: hasSufficient };
  }

  /**
   * Deposits currency into a wallet.
   * Creates a transaction record for every deposit.
   *
   * @param input Deposit input parameters
   * @returns CurrencyServiceResult with the new balance
   */
  async deposit(input: DepositInput): Promise<CurrencyServiceResult<number>> {
    logger.info('Depositing currency', {
      playerProfileId: input.playerProfileId,
      currencyType: input.currencyType,
      amount: input.amount,
    });

    // Validate inputs
    if (!WalletValidator.isValidPlayerProfileId(input.playerProfileId)) {
      return { success: false, error: 'Invalid player profile ID' };
    }

    if (!CurrencyTypeValidator.isValid(input.currencyType)) {
      return { success: false, error: 'Invalid currency type' };
    }

    const amountValidation = CurrencyAmountValidator.validate({ amount: input.amount });
    if (!amountValidation.isValid) {
      return { success: false, error: amountValidation.errors.join('; ') };
    }

    try {
      // Load wallet
      const wallet = await this.walletRepository.findByPlayerProfileId(input.playerProfileId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      // Get current balance
      const currentBalance = wallet.getBalance(input.currencyType);
      const balanceBefore = currentBalance?.balance.amount ?? 0;

      // Calculate new balance with overflow protection
      const newBalanceAmount = balanceBefore + input.amount;
      if (newBalanceAmount > CurrencyAmount.MAX_AMOUNT) {
        return { success: false, error: 'Balance would exceed maximum allowed amount' };
      }

      // Create new balance
      const newBalance = CurrencyAmount.reconstruct(newBalanceAmount);
      const updatedBalance = (currentBalance ?? CurrencyBalance.create({ currencyType: input.currencyType }))
        .withBalance(newBalance);

      // Update wallet
      const updatedWallet = wallet.withUpdatedBalance(input.currencyType, updatedBalance);
      await this.walletRepository.update(updatedWallet);

      // Create transaction record
      const transaction = CurrencyTransaction.createDeposit({
        transactionId: TransactionId.generate(),
        walletId: wallet.walletId.value,
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        balanceBefore,
        balanceAfter: newBalanceAmount,
        sourceModule: input.sourceModule,
        reason: input.reason,
        referenceId: input.referenceId,
      });

      await this.transactionRepository.create(transaction);

      logger.info('Currency deposited successfully', {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        newBalance: newBalanceAmount,
      });

      return { success: true, data: newBalanceAmount };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deposit currency';
      logger.error('Failed to deposit currency', err as Error, {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Withdraws currency from a wallet.
   * Creates a transaction record for every withdrawal.
   *
   * @param input Withdraw input parameters
   * @returns CurrencyServiceResult with the new balance
   */
  async withdraw(input: WithdrawInput): Promise<CurrencyServiceResult<number>> {
    logger.info('Withdrawing currency', {
      playerProfileId: input.playerProfileId,
      currencyType: input.currencyType,
      amount: input.amount,
    });

    // Validate inputs
    if (!WalletValidator.isValidPlayerProfileId(input.playerProfileId)) {
      return { success: false, error: 'Invalid player profile ID' };
    }

    if (!CurrencyTypeValidator.isValid(input.currencyType)) {
      return { success: false, error: 'Invalid currency type' };
    }

    const amountValidation = CurrencyAmountValidator.validate({ amount: input.amount });
    if (!amountValidation.isValid) {
      return { success: false, error: amountValidation.errors.join('; ') };
    }

    try {
      // Load wallet
      const wallet = await this.walletRepository.findByPlayerProfileId(input.playerProfileId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      // Get current balance
      const currentBalance = wallet.getBalance(input.currencyType);
      const balanceBefore = currentBalance?.balance.amount ?? 0;

      // Check sufficient funds (available balance, not total)
      const availableBalance = wallet.getAvailableAmount(input.currencyType);
      if (availableBalance < input.amount) {
        return { success: false, error: `Insufficient funds: available=${availableBalance}, required=${input.amount}` };
      }

      // Calculate new balance
      const newBalanceAmount = balanceBefore - input.amount;
      if (newBalanceAmount < 0) {
        return { success: false, error: 'Balance would become negative' };
      }

      // Create new balance
      const newBalance = CurrencyAmount.reconstruct(newBalanceAmount);
      const updatedBalance = (currentBalance ?? CurrencyBalance.create({ currencyType: input.currencyType }))
        .withBalance(newBalance);

      // Update wallet
      const updatedWallet = wallet.withUpdatedBalance(input.currencyType, updatedBalance);
      await this.walletRepository.update(updatedWallet);

      // Create transaction record
      const transaction = CurrencyTransaction.createWithdraw({
        transactionId: TransactionId.generate(),
        walletId: wallet.walletId.value,
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: -input.amount, // Negative for withdrawal
        balanceBefore,
        balanceAfter: newBalanceAmount,
        sourceModule: input.sourceModule,
        reason: input.reason,
        referenceId: input.referenceId,
      });

      await this.transactionRepository.create(transaction);

      logger.info('Currency withdrawn successfully', {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        newBalance: newBalanceAmount,
      });

      return { success: true, data: newBalanceAmount };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to withdraw currency';
      logger.error('Failed to withdraw currency', err as Error, {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Transfers currency between two wallets.
   * Creates transaction records for both sender and receiver.
   *
   * @param input Transfer input parameters
   * @returns CurrencyServiceResult with transfer details
   */
  async transfer(input: TransferInput): Promise<CurrencyServiceResult<{ fromBalance: number; toBalance: number }>> {
    logger.info('Transferring currency', {
      fromPlayerProfileId: input.fromPlayerProfileId,
      toPlayerProfileId: input.toPlayerProfileId,
      currencyType: input.currencyType,
      amount: input.amount,
    });

    // Validate inputs
    if (!WalletValidator.isValidPlayerProfileId(input.fromPlayerProfileId)) {
      return { success: false, error: 'Invalid source player profile ID' };
    }

    if (!WalletValidator.isValidPlayerProfileId(input.toPlayerProfileId)) {
      return { success: false, error: 'Invalid destination player profile ID' };
    }

    if (input.fromPlayerProfileId === input.toPlayerProfileId) {
      return { success: false, error: 'Cannot transfer to the same wallet' };
    }

    if (!CurrencyTypeValidator.isValid(input.currencyType)) {
      return { success: false, error: 'Invalid currency type' };
    }

    const amountValidation = CurrencyAmountValidator.validate({ amount: input.amount });
    if (!amountValidation.isValid) {
      return { success: false, error: amountValidation.errors.join('; ') };
    }

    try {
      // Load both wallets
      const fromWallet = await this.walletRepository.findByPlayerProfileId(input.fromPlayerProfileId);
      if (!fromWallet) {
        return { success: false, error: 'Source wallet not found' };
      }

      const toWallet = await this.walletRepository.findByPlayerProfileId(input.toPlayerProfileId);
      if (!toWallet) {
        return { success: false, error: 'Destination wallet not found' };
      }

      // Check sufficient funds
      const availableBalance = fromWallet.getAvailableAmount(input.currencyType);
      if (availableBalance < input.amount) {
        return { success: false, error: `Insufficient funds: available=${availableBalance}, required=${input.amount}` };
      }

      // Get current balances
      const fromBalanceBefore = fromWallet.getBalanceAmount(input.currencyType);
      const toBalanceBefore = toWallet.getBalanceAmount(input.currencyType);

      // Calculate new balances
      const fromBalanceAfter = fromBalanceBefore - input.amount;
      const toBalanceAfter = toBalanceBefore + input.amount;

      // Overflow protection
      if (toBalanceAfter > CurrencyAmount.MAX_AMOUNT) {
        return { success: false, error: 'Recipient balance would exceed maximum allowed amount' };
      }

      // Update source wallet
      const fromCurrentBalance = fromWallet.getBalance(input.currencyType)!;
      const fromNewBalance = CurrencyAmount.reconstruct(fromBalanceAfter);
      const fromUpdatedBalance = fromCurrentBalance.withBalance(fromNewBalance);
      const updatedFromWallet = fromWallet.withUpdatedBalance(input.currencyType, fromUpdatedBalance);
      await this.walletRepository.update(updatedFromWallet);

      // Update destination wallet
      const toCurrentBalance = toWallet.getBalance(input.currencyType) ?? CurrencyBalance.create({ currencyType: input.currencyType });
      const toNewBalance = CurrencyAmount.reconstruct(toBalanceAfter);
      const toUpdatedBalance = toCurrentBalance.withBalance(toNewBalance);
      const updatedToWallet = toWallet.withUpdatedBalance(input.currencyType, toUpdatedBalance);
      await this.walletRepository.update(updatedToWallet);

      // Create transaction records
      const outTransaction = CurrencyTransaction.createTransfer({
        transactionId: TransactionId.generate(),
        walletId: fromWallet.walletId.value,
        playerProfileId: input.fromPlayerProfileId,
        currencyType: input.currencyType,
        amount: -input.amount,
        balanceBefore: fromBalanceBefore,
        balanceAfter: fromBalanceAfter,
        isOutgoing: true,
        sourceModule: input.sourceModule,
        reason: input.reason,
        referenceId: input.referenceId,
      });

      const inTransaction = CurrencyTransaction.createTransfer({
        transactionId: TransactionId.generate(),
        walletId: toWallet.walletId.value,
        playerProfileId: input.toPlayerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        balanceBefore: toBalanceBefore,
        balanceAfter: toBalanceAfter,
        isOutgoing: false,
        sourceModule: input.sourceModule,
        reason: input.reason,
        referenceId: input.referenceId,
      });

      await this.transactionRepository.create(outTransaction);
      await this.transactionRepository.create(inTransaction);

      logger.info('Currency transferred successfully', {
        fromPlayerProfileId: input.fromPlayerProfileId,
        toPlayerProfileId: input.toPlayerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        fromBalanceAfter,
        toBalanceAfter,
      });

      return { success: true, data: { fromBalance: fromBalanceAfter, toBalance: toBalanceAfter } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to transfer currency';
      logger.error('Failed to transfer currency', err as Error, {
        fromPlayerProfileId: input.fromPlayerProfileId,
        toPlayerProfileId: input.toPlayerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Reserves currency for a pending transaction.
   * Reserved currency cannot be used until released or confirmed.
   *
   * @param input Reserve input parameters
   * @returns CurrencyServiceResult with reservation details
   */
  async reserve(input: ReserveInput): Promise<CurrencyServiceResult<{ balance: number; reservedBalance: number }>> {
    logger.info('Reserving currency', {
      playerProfileId: input.playerProfileId,
      currencyType: input.currencyType,
      amount: input.amount,
      referenceId: input.referenceId,
    });

    // Validate inputs
    if (!WalletValidator.isValidPlayerProfileId(input.playerProfileId)) {
      return { success: false, error: 'Invalid player profile ID' };
    }

    if (!CurrencyTypeValidator.isValid(input.currencyType)) {
      return { success: false, error: 'Invalid currency type' };
    }

    const amountValidation = CurrencyAmountValidator.validate({ amount: input.amount });
    if (!amountValidation.isValid) {
      return { success: false, error: amountValidation.errors.join('; ') };
    }

    if (!input.referenceId) {
      return { success: false, error: 'Reference ID is required for reservation' };
    }

    try {
      // Load wallet
      const wallet = await this.walletRepository.findByPlayerProfileId(input.playerProfileId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      // Check sufficient available funds
      const availableBalance = wallet.getAvailableAmount(input.currencyType);
      if (availableBalance < input.amount) {
        return { success: false, error: `Insufficient funds: available=${availableBalance}, required=${input.amount}` };
      }

      // Get current balance and reserved balance
      const currentBalance = wallet.getBalance(input.currencyType);
      if (!currentBalance) {
        return { success: false, error: 'Currency balance not found' };
      }

      const balanceBefore = currentBalance.balance.amount;
      const reservedBefore = currentBalance.reservedBalance.amount;

      // Calculate new reserved balance
      const reservedAfter = reservedBefore + input.amount;
      if (reservedAfter > CurrencyAmount.MAX_AMOUNT) {
        return { success: false, error: 'Reserved balance would exceed maximum allowed amount' };
      }

      // Create new reserved amount
      const newReserved = ReservedAmount.reconstruct(reservedAfter);
      const updatedBalance = currentBalance.withReservedBalance(newReserved);

      // Update wallet
      const updatedWallet = wallet.withUpdatedBalance(input.currencyType, updatedBalance);
      await this.walletRepository.update(updatedWallet);

      // Create transaction record
      const transaction = CurrencyTransaction.createReserve({
        transactionId: TransactionId.generate(),
        walletId: wallet.walletId.value,
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: 0, // Reserve doesn't change total balance
        balanceBefore,
        balanceAfter: balanceBefore,
        reason: input.reason,
        referenceId: input.referenceId,
      });

      await this.transactionRepository.create(transaction);

      logger.info('Currency reserved successfully', {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        newReservedBalance: reservedAfter,
      });

      return { success: true, data: { balance: balanceBefore, reservedBalance: reservedAfter } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reserve currency';
      logger.error('Failed to reserve currency', err as Error, {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Releases previously reserved currency.
   * The currency becomes available again.
   *
   * @param input Release input parameters
   * @returns CurrencyServiceResult with release details
   */
  async release(input: ReleaseInput): Promise<CurrencyServiceResult<{ balance: number; reservedBalance: number }>> {
    logger.info('Releasing currency', {
      playerProfileId: input.playerProfileId,
      currencyType: input.currencyType,
      amount: input.amount,
      referenceId: input.referenceId,
    });

    // Validate inputs
    if (!WalletValidator.isValidPlayerProfileId(input.playerProfileId)) {
      return { success: false, error: 'Invalid player profile ID' };
    }

    if (!CurrencyTypeValidator.isValid(input.currencyType)) {
      return { success: false, error: 'Invalid currency type' };
    }

    const amountValidation = CurrencyAmountValidator.validate({ amount: input.amount });
    if (!amountValidation.isValid) {
      return { success: false, error: amountValidation.errors.join('; ') };
    }

    try {
      // Load wallet
      const wallet = await this.walletRepository.findByPlayerProfileId(input.playerProfileId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      // Get current balance
      const currentBalance = wallet.getBalance(input.currencyType);
      if (!currentBalance) {
        return { success: false, error: 'Currency balance not found' };
      }

      const balanceBefore = currentBalance.balance.amount;
      const reservedBefore = currentBalance.reservedBalance.amount;

      // Check if there's enough reserved to release
      if (reservedBefore < input.amount) {
        return { success: false, error: `Insufficient reserved balance: reserved=${reservedBefore}, requested=${input.amount}` };
      }

      // Calculate new reserved balance
      const reservedAfter = reservedBefore - input.amount;

      // Create new reserved amount
      const newReserved = ReservedAmount.reconstruct(reservedAfter);
      const updatedBalance = currentBalance.withReservedBalance(newReserved);

      // Update wallet
      const updatedWallet = wallet.withUpdatedBalance(input.currencyType, updatedBalance);
      await this.walletRepository.update(updatedWallet);

      // Create transaction record
      const transaction = CurrencyTransaction.createRelease({
        transactionId: TransactionId.generate(),
        walletId: wallet.walletId.value,
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: 0, // Release doesn't change total balance
        balanceBefore,
        balanceAfter: balanceBefore,
        reason: input.reason,
        referenceId: input.referenceId,
      });

      await this.transactionRepository.create(transaction);

      logger.info('Currency released successfully', {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
        newReservedBalance: reservedAfter,
      });

      return { success: true, data: { balance: balanceBefore, reservedBalance: reservedAfter } };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to release currency';
      logger.error('Failed to release currency', err as Error, {
        playerProfileId: input.playerProfileId,
        currencyType: input.currencyType,
        amount: input.amount,
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets a summary of the wallet with all balances.
   *
   * @param playerProfileId The player profile ID
   * @returns CurrencyServiceResult with wallet summary
   */
  async getWalletSummary(playerProfileId: string): Promise<CurrencyServiceResult<WalletSummary>> {
    logger.debug('Getting wallet summary', { playerProfileId });

    const walletResult = await this.loadWallet(playerProfileId);
    if (!walletResult.success) {
      return { success: false, error: walletResult.error };
    }

    const wallet = walletResult.data;
    const balances: CurrencyBalanceSummary[] = [];

    let totalBalance = 0;
    for (const [currencyType, balance] of wallet.balances) {
      balances.push({
        currencyType,
        balance: balance.balance.amount,
        reservedBalance: balance.reservedBalance.amount,
        availableBalance: balance.availableBalance.amount,
      });
      totalBalance += balance.balance.amount;
    }

    return {
      success: true,
      data: {
        walletId: wallet.walletId.value,
        playerProfileId: wallet.playerProfileId.value,
        balances,
        totalBalance,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
      },
    };
  }

  /**
   * Gets statistics for the wallet.
   *
   * @param playerProfileId The player profile ID
   * @returns CurrencyServiceResult with statistics
   */
  async getStatistics(playerProfileId: string): Promise<CurrencyServiceResult<CurrencyStatistics>> {
    logger.debug('Getting wallet statistics', { playerProfileId });

    const walletResult = await this.loadWallet(playerProfileId);
    if (!walletResult.success) {
      return { success: false, error: walletResult.error };
    }

    return { success: true, data: walletResult.data.getStatistics() };
  }

  /**
   * Lists transactions for a player with pagination.
   *
   * @param playerProfileId The player profile ID
   * @param params Pagination parameters
   * @param currencyType Optional currency type filter
   * @returns CurrencyServiceResult with paginated transactions
   */
  async listTransactions(
    playerProfileId: string,
    params: PaginationParams,
    currencyType?: CurrencyTypeEnum
  ): Promise<CurrencyServiceResult<PaginatedResult<CurrencyTransaction>>> {
    logger.debug('Listing transactions', { playerProfileId, params, currencyType });

    try {
      const result = await this.transactionRepository.listByPlayer(playerProfileId, params, {
        currencyType,
      });

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list transactions';
      logger.error('Failed to list transactions', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets recent transactions for a player.
   *
   * @param playerProfileId The player profile ID
   * @param limit Maximum number of transactions to return
   * @returns CurrencyServiceResult with recent transactions
   */
  async getRecentTransactions(
    playerProfileId: string,
    limit: number = 10
  ): Promise<CurrencyServiceResult<CurrencyTransaction[]>> {
    logger.debug('Getting recent transactions', { playerProfileId, limit });

    try {
      // First get the wallet to find wallet ID
      const wallet = await this.walletRepository.findByPlayerProfileId(playerProfileId);
      if (!wallet) {
        return { success: false, error: 'Wallet not found' };
      }

      const transactions = await this.transactionRepository.getRecentByWallet(wallet.walletId.value, limit);
      return { success: true, data: transactions };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get recent transactions';
      logger.error('Failed to get recent transactions', err as Error, { playerProfileId });
      return { success: false, error: errorMessage };
    }
  }
}

/**
 * Create a new CurrencyService instance.
 */
export function createCurrencyService(): CurrencyService {
  return new CurrencyService();
}