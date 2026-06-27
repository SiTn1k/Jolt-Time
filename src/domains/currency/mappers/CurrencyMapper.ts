/**
 * Currency Mapper
 *
 * Maps between CurrencyWallet entity and various DTOs.
 * No database logic - pure transformation only.
 */

import type { CurrencyWallet } from '../entities/CurrencyWallet';
import type { CurrencyBalance, CurrencyBalanceRecord } from '../entities/CurrencyBalance';
import type { CreateWalletDto } from '../dto/CreateWallet.dto';
import type { CurrencyWalletResponseDto, CurrencyBalanceResponseDto, CurrencyWalletSummaryDto, CurrencyStatisticsResponseDto } from '../dto/CurrencyResponse.dto';
import { CurrencyType, CurrencyTypeEnum } from '../value-objects/CurrencyType';

/**
 * Mapper for converting between Currency entity and DTOs.
 */
export class CurrencyMapper {
  /**
   * Converts a CurrencyBalance entity to CurrencyBalanceResponseDto.
   */
  public static toBalanceResponse(balance: CurrencyBalance): CurrencyBalanceResponseDto {
    const currencyType = CurrencyType.create(balance.currencyType.value);
    return {
      currencyType: balance.currencyType.value,
      displayName: currencyType.displayName,
      symbol: currencyType.symbol,
      balance: balance.balance.amount,
      reservedBalance: balance.reservedBalance.amount,
      availableBalance: balance.availableBalance.amount,
      lastTransactionAt: balance.lastTransactionAt?.toISOString() ?? null,
    };
  }

  /**
   * Converts a CurrencyWallet entity to CurrencyWalletResponseDto.
   */
  public static toResponse(wallet: CurrencyWallet): CurrencyWalletResponseDto {
    const balances: CurrencyBalanceResponseDto[] = [];
    for (const balance of wallet.balances.values()) {
      balances.push(this.toBalanceResponse(balance));
    }

    return {
      walletId: wallet.walletId.value,
      playerProfileId: wallet.playerProfileId.value,
      balances,
      totalBalance: wallet.totalBalance.amount,
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }

  /**
   * Converts a CurrencyWallet entity to CurrencyWalletSummaryDto.
   */
  public static toSummary(wallet: CurrencyWallet): CurrencyWalletSummaryDto {
    return {
      walletId: wallet.walletId.value,
      totalBalance: wallet.totalBalance.amount,
      currencyTypeCount: wallet.currencyTypes.length,
    };
  }

  /**
   * Converts a CurrencyWallet entity to CurrencyStatisticsResponseDto.
   */
  public static toStatisticsResponse(wallet: CurrencyWallet): CurrencyStatisticsResponseDto {
    const stats = wallet.getStatistics();
    return {
      totalEarned: stats.totalEarned,
      totalSpent: stats.totalSpent,
      netChange: stats.netChange,
      totalBalance: stats.totalBalance,
      balanceByType: stats.balanceByType,
      largestTransaction: stats.largestTransaction,
      averageTransaction: stats.averageTransaction,
      transactionCount: stats.transactionCount,
      lastTransactionAt: stats.lastTransactionAt,
    };
  }

  /**
   * Converts an array of CurrencyWallet entities to CurrencyWalletResponseDto array.
   */
  public static toResponseList(wallets: CurrencyWallet[]): CurrencyWalletResponseDto[] {
    return wallets.map((wallet) => this.toResponse(wallet));
  }

  /**
   * Converts an array of CurrencyWallet entities to CurrencyWalletSummaryDto array.
   */
  public static toSummaryList(wallets: CurrencyWallet[]): CurrencyWalletSummaryDto[] {
    return wallets.map((wallet) => this.toSummary(wallet));
  }

  /**
   * Converts a CreateWalletDto to entity input.
   * Note: This creates input for entity creation, not the entity itself.
   */
  public static fromCreateDto(dto: CreateWalletDto): Omit<CreateWalletDto, never> {
    return {
      playerProfileId: dto.playerProfileId,
      initialCurrencyTypes: dto.initialCurrencyTypes,
    };
  }

  /**
   * Converts a database record to CreateWalletDto format.
   */
  public static fromRecordToDto(record: CurrencyWalletRecord): CreateWalletDto {
    return {
      playerProfileId: record.playerProfileId,
      initialCurrencyTypes: record.balances.map((b) => b.currencyType),
    };
  }

  /**
   * Converts a CurrencyWallet entity to a database record format.
   * Note: This is for mapping TO record format, not actual database operations.
   */
  public static toRecord(wallet: CurrencyWallet): CurrencyWalletRecord {
    const balances: CurrencyBalanceRecord[] = [];
    for (const balance of wallet.balances.values()) {
      balances.push({
        currencyType: balance.currencyType.value,
        balance: balance.balance.amount,
        reservedBalance: balance.reservedBalance.amount,
        lastTransactionAt: balance.lastTransactionAt?.toISOString() ?? null,
        metadata: balance.metadata,
      });
    }

    return {
      walletId: wallet.walletId.value,
      playerProfileId: wallet.playerProfileId.value,
      balances,
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
    };
  }
}

/**
 * Database record representation of CurrencyWallet.
 * For use in repository mapping.
 */
export interface CurrencyWalletRecord {
  walletId: string;
  playerProfileId: string;
  balances: CurrencyBalanceRecord[];
  createdAt: string;
  updatedAt: string;
}
