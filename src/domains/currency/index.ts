/**
 * Currency Domain Index
 *
 * Main entry point for the Currency domain module.
 * Exports all public-facing entities, interfaces, types, and utilities.
 */

// Value Objects
export {
  WalletId,
  CurrencyType,
  CurrencyTypeEnum,
  CurrencyAmount,
  ReservedAmount,
} from './value-objects';

// Types
export type {
  CurrencyMetadata,
  CurrencyStatistics,
  OperationContext,
  OperationResult,
} from './types';
export {
  CurrencyTransactionType,
  TransactionCategory,
  getTransactionCategory,
  isIncomeTransaction,
  isExpenseTransaction,
  CurrencyOperationType,
  OperationStatus,
  INITIAL_CURRENCY_STATISTICS,
  createDefaultCurrencyMetadata,
} from './types';

// Entities
export {
  CurrencyBalance,
  CurrencyWallet,
  CurrencyTransaction,
  TransactionId,
} from './entities';
export type {
  CurrencyBalanceProps,
  CurrencyBalanceRecord,
  CurrencyBalanceJSON,
  CurrencyWalletProps,
  CurrencyWalletRecord,
  CurrencyWalletJSON,
  CurrencyTransactionProps,
  CurrencyTransactionRecord,
  CurrencyTransactionJSON,
} from './entities';

// Interfaces
export type {
  ICurrencyWallet,
  ICurrencyBalance,
  ICurrencyRepository,
  WalletFilterParams,
} from './interfaces';

// DTOs
export type {
  CreateWalletDto,
  UpdateBalanceDto,
  CurrencyBalanceResponseDto,
  CurrencyWalletResponseDto,
  CurrencyWalletSummaryDto,
  CurrencyStatisticsResponseDto,
  CurrencyOperationResponseDto,
} from './dto';
export {
  CREATE_WALLET_VALIDATION,
  UPDATE_BALANCE_VALIDATION,
} from './dto';

// Validators
export {
  CurrencyAmountValidator,
  CurrencyTypeValidator,
  WalletValidator,
} from './validators';
export type {
  CurrencyAmountValidationResult,
  CurrencyTypeValidationResult,
  WalletValidationResult,
} from './validators';

// Events
export type {
  WalletCreatedEvent,
  WalletCreatedEventData,
  BalanceChangedEvent,
  BalanceChangedEventData,
  CurrencyAddedEvent,
  CurrencyAddedEventData,
  CurrencyRemovedEvent,
  CurrencyRemovedEventData,
} from './events';
export {
  createWalletCreatedEvent,
  createBalanceChangedEvent,
  createCurrencyAddedEvent,
  createCurrencyRemovedEvent,
} from './events';

// Mappers
export { CurrencyMapper } from './mappers';
export type { CurrencyWalletRecord } from './mappers';

// Repositories
export { SupabaseCurrencyRepository } from './repositories';
export { SupabaseCurrencyTransactionRepository } from './repositories';
export type { ICurrencyTransactionRepository, TransactionFilterParams } from './repositories';

// DI
export {
  CURRENCY_TOKENS,
  registerCurrencyDependencies,
  setupCurrencyDomain,
} from './di';
