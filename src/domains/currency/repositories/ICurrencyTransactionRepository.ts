/**
 * Currency Transaction Repository Interface
 *
 * Interface defining the contract for CurrencyTransaction persistence.
 * All CurrencyTransactionRepository implementations must adhere to this interface.
 */

import type { TransactionId } from '../entities/CurrencyTransaction';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { CurrencyTransactionType } from '../types/CurrencyTransactionType';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying transactions.
 */
export interface TransactionFilterParams {
  /** Filter by wallet ID */
  walletId?: string;

  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by currency type */
  currencyType?: CurrencyTypeEnum;

  /** Filter by transaction type */
  transactionType?: CurrencyTransactionType;

  /** Filter by date range - start date */
  startDate?: Date;

  /** Filter by date range - end date */
  endDate?: Date;

  /** Filter by amount range - minimum */
  minAmount?: number;

  /** Filter by amount range - maximum */
  maxAmount?: number;
}

/**
 * Currency Transaction repository interface.
 * Defines all data access operations for CurrencyTransaction entities.
 */
export interface ICurrencyTransactionRepository {
  /**
   * Creates a new currency transaction.
   * @param transaction The transaction to create
   * @returns The created transaction
   */
  create(transaction: import('../entities/CurrencyTransaction').CurrencyTransaction): Promise<import('../entities/CurrencyTransaction').CurrencyTransaction>;

  /**
   * Finds a transaction by its ID.
   * @param id The transaction ID to find
   * @returns The transaction if found, null otherwise
   */
  findById(id: TransactionId): Promise<import('../entities/CurrencyTransaction').CurrencyTransaction | null>;

  /**
   * Lists transactions for a wallet with pagination and filtering.
   * @param walletId The wallet ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of transactions
   */
  listByWallet(
    walletId: string,
    params: PaginationParams,
    filters?: TransactionFilterParams
  ): Promise<PaginatedResult<import('../entities/CurrencyTransaction').CurrencyTransaction>>;

  /**
   * Lists transactions for a player with pagination and filtering.
   * @param playerProfileId The player profile ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of transactions
   */
  listByPlayer(
    playerProfileId: string,
    params: PaginationParams,
    filters?: TransactionFilterParams
  ): Promise<PaginatedResult<import('../entities/CurrencyTransaction').CurrencyTransaction>>;

  /**
   * Counts transactions for a wallet.
   * @param walletId The wallet ID
   * @param filters Optional filter parameters
   * @returns Total count of matching transactions
   */
  countByWallet(walletId: string, filters?: TransactionFilterParams): Promise<number>;

  /**
   * Gets the sum of transaction amounts for a wallet and currency type.
   * @param walletId The wallet ID
   * @param currencyType The currency type
   * @param transactionTypes Optional array of transaction types to include
   * @returns Sum of amounts
   */
  sumByWalletAndType(
    walletId: string,
    currencyType: CurrencyTypeEnum,
    transactionTypes?: CurrencyTransactionType[]
  ): Promise<number>;

  /**
   * Gets recent transactions for a wallet.
   * @param walletId The wallet ID
   * @param limit Maximum number of transactions to return
   * @returns Array of recent transactions
   */
  getRecentByWallet(walletId: string, limit: number): Promise<import('../entities/CurrencyTransaction').CurrencyTransaction[]>;
}