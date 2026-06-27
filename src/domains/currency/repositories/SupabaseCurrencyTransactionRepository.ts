/**
 * Supabase Currency Transaction Repository
 *
 * Production Supabase implementation of the Currency Transaction repository.
 * Handles all persistence operations for CurrencyTransaction entities.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../../database/supabase-types';
import type { ICurrencyTransactionRepository, TransactionFilterParams } from './ICurrencyTransactionRepository';
import { CurrencyTransaction, CurrencyTransactionRecord } from '../entities/CurrencyTransaction';
import { TransactionId } from '../entities/CurrencyTransaction';
import { CurrencyTypeEnum } from '../value-objects/CurrencyType';
import { CurrencyTransactionType } from '../types/CurrencyTransactionType';
import type { PaginationParams, PaginatedResult } from '../../../shared/types/base.types';
import { getSupabaseClient } from '../../../database/providers/supabase.provider';
import { createLogger } from '../../../core/logging/logger.service';
import { RepositoryError } from '../../../database/errors/repository.error';

const logger = createLogger('SupabaseCurrencyTransactionRepository');

/**
 * Supabase implementation of the Currency Transaction Repository.
 * Implements ICurrencyTransactionRepository for CurrencyTransaction entity persistence.
 */
export class SupabaseCurrencyTransactionRepository implements ICurrencyTransactionRepository {
  private readonly tableName = 'currency_transactions';
  private readonly _client?: SupabaseClient<Database>;

  /**
   * Creates a new SupabaseCurrencyTransactionRepository instance.
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
   * Maps a database row to CurrencyTransactionRecord format.
   */
  private mapRowToRecord(row: Record<string, unknown>): CurrencyTransactionRecord {
    return {
      transactionId: row.transaction_id as string,
      walletId: row.wallet_id as string,
      playerProfileId: row.player_profile_id as string,
      currencyType: row.currency_type as CurrencyTransactionRecord['currencyType'],
      amount: row.amount as number,
      transactionType: row.transaction_type as CurrencyTransactionRecord['transactionType'],
      balanceBefore: row.balance_before as number,
      balanceAfter: row.balance_after as number,
      reason: row.reason as string | undefined,
      sourceModule: row.source_module as string | undefined,
      referenceId: row.reference_id as string | undefined,
      metadata: row.metadata as CurrencyTransactionRecord['metadata'],
      createdAt: row.created_at as string,
    };
  }

  /**
   * Maps a database row to a CurrencyTransaction entity.
   */
  private mapRowToEntity(row: Record<string, unknown>): CurrencyTransaction {
    const record = this.mapRowToRecord(row);
    return CurrencyTransaction.fromStorage(record);
  }

  /**
   * Converts a CurrencyTransaction entity to database insert format.
   */
  private toInsertRecord(transaction: CurrencyTransaction): Record<string, unknown> {
    return {
      transaction_id: transaction.transactionId.value,
      wallet_id: transaction.walletId,
      player_profile_id: transaction.playerProfileId,
      currency_type: transaction.currencyType,
      amount: transaction.amount,
      transaction_type: transaction.transactionType,
      balance_before: transaction.balanceBefore,
      balance_after: transaction.balanceAfter,
      reason: transaction.reason,
      source_module: transaction.sourceModule,
      reference_id: transaction.referenceId,
      metadata: transaction.metadata,
      created_at: transaction.createdAt.toISOString(),
    };
  }

  /**
   * Calculates pagination offset from page and pageSize.
   */
  private calculateOffset(params: PaginationParams): number {
    return (params.page - 1) * params.pageSize;
  }

  /**
   * Builds a query with filters applied.
   */
  private applyFilters(
    query: ReturnType<SupabaseClient<Database>['from']>,
    filters?: TransactionFilterParams
  ): ReturnType<SupabaseClient<Database>['from']> {
    let q = query;

    if (filters?.currencyType) {
      q = q.eq('currency_type', filters.currencyType);
    }

    if (filters?.transactionType) {
      q = q.eq('transaction_type', filters.transactionType);
    }

    if (filters?.startDate) {
      q = q.gte('created_at', filters.startDate.toISOString());
    }

    if (filters?.endDate) {
      q = q.lte('created_at', filters.endDate.toISOString());
    }

    if (filters?.minAmount !== undefined) {
      q = q.gte('amount', filters.minAmount);
    }

    if (filters?.maxAmount !== undefined) {
      q = q.lte('amount', filters.maxAmount);
    }

    return q;
  }

  /**
   * Creates a new currency transaction.
   * @param transaction The transaction to create
   * @returns The created transaction
   */
  async create(transaction: CurrencyTransaction): Promise<CurrencyTransaction> {
    logger.debug('Creating currency transaction', {
      transactionId: transaction.transactionId.value,
      walletId: transaction.walletId,
    });

    try {
      const record = this.toInsertRecord(transaction);
      const { data, error } = await this.client.from(this.tableName).insert(record).select().single();

      if (error) {
        logger.error('Failed to create currency transaction', error);
        throw RepositoryError.createFailed('CurrencyTransaction', new Error(error.message));
      }

      logger.info('Currency transaction created', {
        transactionId: transaction.transactionId.value,
        walletId: transaction.walletId,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
      });

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to create currency transaction', err as Error);
      throw RepositoryError.createFailed('CurrencyTransaction', err as Error);
    }
  }

  /**
   * Finds a transaction by its ID.
   * @param id The transaction ID to find
   * @returns The transaction if found, null otherwise
   */
  async findById(id: TransactionId): Promise<CurrencyTransaction | null> {
    logger.debug('Finding currency transaction by ID', { transactionId: id.value });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('transaction_id', id.value)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw RepositoryError.entityNotFound('CurrencyTransaction', id.value, this.tableName);
      }

      return this.mapRowToEntity(data as Record<string, unknown>);
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to find currency transaction', err as Error, { transactionId: id.value });
      throw RepositoryError.entityNotFound('CurrencyTransaction', id.value, this.tableName);
    }
  }

  /**
   * Lists transactions for a wallet with pagination and filtering.
   * @param walletId The wallet ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of transactions
   */
  async listByWallet(
    walletId: string,
    params: PaginationParams,
    filters?: TransactionFilterParams
  ): Promise<PaginatedResult<CurrencyTransaction>> {
    logger.debug('Listing currency transactions by wallet', { walletId, params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('wallet_id', walletId);

      query = this.applyFilters(query, filters);

      // Apply sorting
      const sortBy = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
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
      logger.error('Failed to list currency transactions by wallet', err as Error, { walletId });
      throw RepositoryError.queryFailed('listByWallet', err as Error);
    }
  }

  /**
   * Lists transactions for a player with pagination and filtering.
   * @param playerProfileId The player profile ID
   * @param params Pagination parameters
   * @param filters Optional filter parameters
   * @returns Paginated result of transactions
   */
  async listByPlayer(
    playerProfileId: string,
    params: PaginationParams,
    filters?: TransactionFilterParams
  ): Promise<PaginatedResult<CurrencyTransaction>> {
    logger.debug('Listing currency transactions by player', { playerProfileId, params, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact' })
        .eq('player_profile_id', playerProfileId);

      query = this.applyFilters(query, filters);

      // Apply sorting
      const sortBy = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
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
      logger.error('Failed to list currency transactions by player', err as Error, { playerProfileId });
      throw RepositoryError.queryFailed('listByPlayer', err as Error);
    }
  }

  /**
   * Counts transactions for a wallet.
   * @param walletId The wallet ID
   * @param filters Optional filter parameters
   * @returns Total count of matching transactions
   */
  async countByWallet(walletId: string, filters?: TransactionFilterParams): Promise<number> {
    logger.debug('Counting currency transactions by wallet', { walletId, filters });

    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq('wallet_id', walletId);

      query = this.applyFilters(query, filters);

      const { error, count } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return count ?? 0;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to count currency transactions', err as Error, { walletId });
      throw RepositoryError.queryFailed('countByWallet', err as Error);
    }
  }

  /**
   * Gets the sum of transaction amounts for a wallet and currency type.
   * @param walletId The wallet ID
   * @param currencyType The currency type
   * @param transactionTypes Optional array of transaction types to include
   * @returns Sum of amounts
   */
  async sumByWalletAndType(
    walletId: string,
    currencyType: CurrencyTypeEnum,
    transactionTypes?: CurrencyTransactionType[]
  ): Promise<number> {
    logger.debug('Summing currency transactions by wallet and type', { walletId, currencyType, transactionTypes });

    try {
      let query = this.client
        .from(this.tableName)
        .select('amount')
        .eq('wallet_id', walletId)
        .eq('currency_type', currencyType);

      if (transactionTypes && transactionTypes.length > 0) {
        query = query.in('transaction_type', transactionTypes);
      }

      const { data, error } = await query;

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      const sum = (data as { amount: number }[]).reduce((acc, row) => acc + row.amount, 0);
      return sum;
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to sum currency transactions', err as Error, { walletId, currencyType });
      throw RepositoryError.queryFailed('sumByWalletAndType', err as Error);
    }
  }

  /**
   * Gets recent transactions for a wallet.
   * @param walletId The wallet ID
   * @param limit Maximum number of transactions to return
   * @returns Array of recent transactions
   */
  async getRecentByWallet(walletId: string, limit: number): Promise<CurrencyTransaction[]> {
    logger.debug('Getting recent currency transactions by wallet', { walletId, limit });

    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw RepositoryError.queryFailed(error.message, new Error(error.message));
      }

      return (data as Record<string, unknown>[]).map((row) => this.mapRowToEntity(row));
    } catch (err) {
      if (err instanceof RepositoryError) {
        throw err;
      }
      logger.error('Failed to get recent currency transactions', err as Error, { walletId });
      throw RepositoryError.queryFailed('getRecentByWallet', err as Error);
    }
  }
}