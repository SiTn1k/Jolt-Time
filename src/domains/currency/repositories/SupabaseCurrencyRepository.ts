/**
 * Supabase Currency Repository
 *
 * Production Supabase implementation of the Currency repository.
 * Handles all persistence operations for CurrencyWallet entities.
 *
 * NOTE: This is a skeleton implementation. All methods throw NotImplementedError.
 * Full implementation will be completed in P-170.2.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { ICurrencyRepository, WalletFilterParams } from '../interfaces/ICurrencyRepository';
import { CurrencyWallet, CurrencyWalletRecord } from '../entities/CurrencyWallet';
import { WalletId } from '../value-objects/WalletId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';

const logger = createLogger('SupabaseCurrencyRepository');

/**
 * Supabase implementation of the Currency Repository.
 * Implements ICurrencyRepository for CurrencyWallet entity persistence.
 */
export class SupabaseCurrencyRepository implements ICurrencyRepository {
  private readonly tableName = 'currency_wallets';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseCurrencyRepository instance.
   * @param client Optional Supabase client (uses default provider if not provided)
   */
  constructor(client?: SupabaseClient<Database>) {
    this._client = client;
  }

  /**
   * Get the Supabase client.
   */
  private get client(): SupabaseClient<Database> {
    return this._client ?? getSupabaseClient();
  }

  /**
   * Maps a database row to CurrencyWalletRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): CurrencyWalletRecord {
    return {
      walletId: row.wallet_id as string,
      playerProfileId: row.player_profile_id as string,
      balances: (row.balances as CurrencyWalletRecord['balances']) ?? [],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };
  }

  /**
   * Maps a database row to a CurrencyWallet entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): CurrencyWallet {
    const record = this.mapRowToRecord(row);
    return CurrencyWallet.fromStorage(record);
  }

  /**
   * Converts a CurrencyWallet entity to database insert format.
   */
  private toInsertRecord(wallet: CurrencyWallet): Record<string, unknown> {
    const balances = Array.from(wallet.balances.entries()).map(([type, balance]) => ({
      currencyType: type,
      balance: balance.balance.amount,
      reservedBalance: balance.reservedBalance.amount,
      lastTransactionAt: balance.lastTransactionAt?.toISOString() ?? null,
      metadata: balance.metadata,
    }));

    return {
      wallet_id: wallet.walletId.value,
      player_profile_id: wallet.playerProfileId.value,
      balances,
      created_at: wallet.createdAt.toISOString(),
      updated_at: wallet.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a CurrencyWallet entity to database update format.
   */
  private toUpdateRecord(wallet: CurrencyWallet): Record<string, unknown> {
    const balances = Array.from(wallet.balances.entries()).map(([type, balance]) => ({
      currencyType: type,
      balance: balance.balance.amount,
      reservedBalance: balance.reservedBalance.amount,
      lastTransactionAt: balance.lastTransactionAt?.toISOString() ?? null,
      metadata: balance.metadata,
    }));

    return {
      balances,
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Creates a new currency wallet.
   * @param wallet The wallet to create
   * @returns The created wallet
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async create(wallet: CurrencyWallet): Promise<CurrencyWallet> {
    logger.debug('Creating currency wallet', { walletId: wallet.walletId.value });
    throw new NotImplementedError('CurrencyRepository.create() - Full implementation in P-170.2');
  }

  /**
   * Finds a wallet by its internal ID.
   * @param id The wallet ID to find
   * @returns The wallet if found, null otherwise
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async findById(id: WalletId): Promise<CurrencyWallet | null> {
    logger.debug('Finding currency wallet by ID', { walletId: id.value });
    throw new NotImplementedError('CurrencyRepository.findById() - Full implementation in P-170.2');
  }

  /**
   * Finds a wallet by player profile ID.
   * @param playerProfileId The player profile ID to find wallet for
   * @returns The wallet if found, null otherwise
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async findByPlayerProfileId(playerProfileId: string): Promise<CurrencyWallet | null> {
    logger.debug('Finding currency wallet by player profile ID', { playerProfileId });
    throw new NotImplementedError('CurrencyRepository.findByPlayerProfileId() - Full implementation in P-170.2');
  }

  /**
   * Checks if a wallet exists by ID.
   * @param id The wallet ID to check
   * @returns true if wallet exists
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async exists(id: WalletId): Promise<boolean> {
    logger.debug('Checking if currency wallet exists', { walletId: id.value });
    throw new NotImplementedError('CurrencyRepository.exists() - Full implementation in P-170.2');
  }

  /**
   * Updates an existing wallet.
   * @param wallet The wallet to update
   * @returns The updated wallet
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async update(wallet: CurrencyWallet): Promise<CurrencyWallet> {
    logger.debug('Updating currency wallet', { walletId: wallet.walletId.value });
    throw new NotImplementedError('CurrencyRepository.update() - Full implementation in P-170.2');
  }

  /**
   * Deletes a wallet.
   * @param id The wallet ID to delete
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async delete(id: WalletId): Promise<void> {
    logger.debug('Deleting currency wallet', { walletId: id.value });
    throw new NotImplementedError('CurrencyRepository.delete() - Full implementation in P-170.2');
  }

  /**
   * Lists wallets with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of wallets
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async list(
    params: PaginationParams,
    filters?: WalletFilterParams
  ): Promise<PaginatedResult<CurrencyWallet>> {
    logger.debug('Listing currency wallets', { params, filters });
    throw new NotImplementedError('CurrencyRepository.list() - Full implementation in P-170.2');
  }

  /**
   * Counts total wallets with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching wallets
   * @throws NotImplementedError - Full implementation in P-170.2
   */
  async count(filters?: WalletFilterParams): Promise<number> {
    logger.debug('Counting currency wallets', { filters });
    throw new NotImplementedError('CurrencyRepository.count() - Full implementation in P-170.2');
  }
}

/**
 * NotImplementedError for repository skeleton.
 */
export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotImplementedError';
  }
}
