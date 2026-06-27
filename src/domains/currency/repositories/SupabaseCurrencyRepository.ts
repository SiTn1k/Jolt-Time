/**
 * Supabase Currency Repository
 *
 * Production Supabase implementation of the Currency repository.
 * Handles all persistence operations for CurrencyWallet entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { ICurrencyRepository, WalletFilterParams } from '../interfaces/ICurrencyRepository';
import { CurrencyWallet, CurrencyWalletRecord, CurrencyBalanceRecord } from '../entities/CurrencyWallet';
import { WalletId } from '../value-objects/WalletId';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';
import type { CurrencyTypeEnum } from '../value-objects/CurrencyType';

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
    const balancesRaw = row.balances;
    let balances: CurrencyBalanceRecord[] = [];

    if (Array.isArray(balancesRaw)) {
      balances = balancesRaw.map((b) => ({
        currencyType: (b as Record<string, unknown>).currencyType as CurrencyTypeEnum,
        balance: (b as Record<string, unknown>).balance as number,
        reservedBalance: (b as Record<string, unknown>).reservedBalance as number,
        lastTransactionAt: (b as Record<string, unknown>).lastTransactionAt as string | null,
        metadata: (b as Record<string, unknown>).metadata as CurrencyBalanceRecord['metadata'],
      }));
    }

    return {
      walletId: row.wallet_id as string,
      playerProfileId: row.player_profile_id as string,
      balances,
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
   */
  async create(wallet: CurrencyWallet): Promise<CurrencyWallet> {
    logger.debug('Creating currency wallet', { walletId: wallet.walletId.value });

    try {
      const record = this.toInsertRecord(wallet);
      const { data, error } = await this.client.from(this.tableName).insert(record).select().single();

      if (error) {
        if (error.code === '23505') {
          throw RepositoryError.alreadyExists('CurrencyWallet', 'wallet_id', wallet.walletId.value, this.tableName);
        }
        logger.error('Failed to create currency wallet', error);
        throw RepositoryError.createFailed('CurrencyWallet', new Error(error.message));
      }

      logger.info('Currency wallet created', {
        walletId: wallet.walletId.value,
        playerProfileId: wallet.playerProfileId.value,
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to create currency wallet', err as Error);
      throw RepositoryError.createFailed('CurrencyWallet', err as Error);
    }
  }

  /**
   * Finds a wallet by its internal ID.
   * @param id The wallet ID to find
   * @returns The wallet if found, null otherwise
   */
  async findById(id: WalletId): Promise<CurrencyWallet | null> {
    logger.debug('Finding currency wallet by ID', { walletId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('wallet_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('CurrencyWallet', id.value, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find currency wallet', err as Error, { walletId: id.value });
      throw RepositoryError.entityNotFound('CurrencyWallet', id.value, this.tableName);
    }
  }

  /**
   * Finds a wallet by player profile ID.
   * @param playerProfileId The player profile ID to find wallet for
   * @returns The wallet if found, null otherwise
   */
  async findByPlayerProfileId(playerProfileId: string): Promise<CurrencyWallet | null> {
    logger.debug('Finding currency wallet by player profile ID', { playerProfileId });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('player_profile_id', playerProfileId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('CurrencyWallet', playerProfileId, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find currency wallet by player profile ID', err as Error, { playerProfileId });
      throw RepositoryError.entityNotFound('CurrencyWallet', playerProfileId, this.tableName);
    }
  }

  /**
   * Checks if a wallet exists by ID.
   * @param id The wallet ID to check
   * @returns true if wallet exists
   */
  async exists(id: WalletId): Promise<boolean> {
    logger.debug('Checking if currency wallet exists', { walletId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .select('wallet_id')
        .eq('wallet_id', id.value)
        .limit(1);

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return true;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to check currency wallet existence', err as Error, { walletId: id.value });
      return false;
    }
  }

  /**
   * Updates an existing wallet.
   * @param wallet The wallet to update
   * @returns The updated wallet
   */
  async update(wallet: CurrencyWallet): Promise<CurrencyWallet> {
    logger.debug('Updating currency wallet', { walletId: wallet.walletId.value });

    try {
      const record = this.toUpdateRecord(wallet);
      const { data, error } = await this.client
        .from(this.tableName)
        .update(record)
        .eq('wallet_id', wallet.walletId.value)
        .select()
        .single();

      if (error) {
        logger.error('Failed to update currency wallet', error);
        throw RepositoryError.updateFailed('CurrencyWallet', wallet.walletId.value, new Error(error.message));
      }

      logger.info('Currency wallet updated', { walletId: wallet.walletId.value });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to update currency wallet', err as Error, { walletId: wallet.walletId.value });
      throw RepositoryError.updateFailed('CurrencyWallet', wallet.walletId.value, err as Error);
    }
  }

  /**
   * Deletes a wallet.
   * @param id The wallet ID to delete
   */
  async delete(id: WalletId): Promise<void> {
    logger.debug('Deleting currency wallet', { walletId: id.value });

    try {
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq('wallet_id', id.value);

      if (error) {
        logger.error('Failed to delete currency wallet', error);
        throw RepositoryError.deleteFailed('CurrencyWallet', id.value, new Error(error.message));
      }

      logger.info('Currency wallet deleted', { walletId: id.value });
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to delete currency wallet', err as Error, { walletId: id.value });
      throw RepositoryError.deleteFailed('CurrencyWallet', id.value, err as Error);
    }
  }

  /**
   * Lists wallets with pagination and filtering.
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of wallets
   */
  async list(
    params: PaginationParams,
    filters?: WalletFilterParams
  ): Promise<PaginatedResult<CurrencyWallet>> {
    logger.debug('Listing currency wallets', { params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      // Apply sorting
      const sortBy = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === 'asc' ? true : false;
      query = query.order(sortBy, { ascending: sortOrder });

      // Apply pagination
      const offset = this.calculateOffset(params);
      query = query.range(offset, offset + params.pageSize - 1);

      const { data, error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const items = (data as Record<string, unknown>[]).map((row) => this.mapRowToEntity(row));
      const total = count ?? 0;
      const totalPages = Math.ceil(total / params.pageSize);

      return {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
      };
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to list currency wallets', err as Error);
      throw RepositoryError.queryFailed('list', err as Error);
    }
  }

  /**
   * Counts total wallets with optional filtering.
   * @param filters Optional filter parameters
   * @returns Total count of matching wallets
   */
  async count(filters?: WalletFilterParams): Promise<number> {
    logger.debug('Counting currency wallets', { filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters?.playerProfileId) {
        query = query.eq('player_profile_id', filters.playerProfileId);
      }

      if (filters?.createdAfter) {
        query = query.gte('created_at', filters.createdAfter.toISOString());
      }

      if (filters?.createdBefore) {
        query = query.lte('created_at', filters.createdBefore.toISOString());
      }

      const { error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to count currency wallets', err as Error);
      throw RepositoryError.queryFailed('count', err as Error);
    }
  }
}
