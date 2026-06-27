/**
 * Currency Types Index
 *
 * Exports all currency domain types.
 */

export type { CurrencyMetadata } from './CurrencyMetadata';
export { createDefaultCurrencyMetadata } from './CurrencyMetadata';

export type { CurrencyStatistics } from './CurrencyStatistics';
export { INITIAL_CURRENCY_STATISTICS } from './CurrencyStatistics';

export {
  CurrencyTransactionType,
  TransactionCategory,
  getTransactionCategory,
  isIncomeTransaction,
  isExpenseTransaction,
} from './CurrencyTransactionType';

export {
  CurrencyOperationType,
  OperationStatus,
} from './CurrencyOperationType';

export type { OperationContext, OperationResult } from './CurrencyOperationType';
