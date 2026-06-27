/**
 * Currency Repository Interface
 *
 * Interface defining the contract for CurrencyWallet persistence.
 * All CurrencyRepository implementations must adhere to this interface.
 */

import type { WalletId } from '../value-objects/WalletId';
import type { CurrencyWallet } from '../entities/CurrencyWallet';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';

/**
 * Filter parameters for querying wallets.
 */
export interface WalletFilterParams {
  /** Filter by player profile ID */
  playerProfileId?: string;

  /** Filter by creation date after */
  createdAfter?: Date;

  /** Filter by creation date before */
  createdBefore?: Date;

  /** Filter by currency type (wallets with this currency) */
  hasCurrencyType?: CurrencyTypeEnum;
}

/**
 * Currency repository interface.
 * Defines all data access operations for CurrencyWallet entities.
 */
export interface ICurrencyRepository {
  /**
   * Creates a new currency wallet.
   * @param wallet The wallet to create
   * @returns The created wallet
   */
  create(wallet: CurrencyWallet): Promise<CurrencyWallet>;

  /**
   * Finds a wallet by its internal ID.
   * @param id The wallet ID to find
   * @returns The wallet if found, null otherwise
   */
  findById(id: WalletId): Promise<CurrencyWallet | null>;

  /**
   * Finds a wallet by player profile ID.
   * @param playerProfileId The player profile ID to find wallet for
   * @returns The wallet if found, null otherwise
   */
  findByPlayerProfileId(playerProfileId: string): Promise<CurrencyWallet | null>;

  /**
   * Checks if a wallet exists by ID.
   * @param id The wallet ID to check
   * @returns true if wallet exists
   */
  exists(id: WalletId): Promise<boolean>;

  /**
   * Updates an existing wallet.
   * @param wallet The wallet to update
   * @returns The updated wallet
   */
  update(wallet: CurrencyWallet): Promise<CurrencyWallet>;

  /**
   * Deletes a wallet.
   * @param id The wallet ID to delete
   */
  delete(id: WalletId): Promise<void>;

  /**
   * Lists wallets with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of wallets
   */
  list(
    params: PaginationParams,
    filters?: WalletFilterParams
  ): Promise<PaginatedResult<CurrencyWallet>>;

  /**
   * Counts total wallets with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching wallets
   */
  count(filters?: WalletFilterParams): Promise<number>;
}
