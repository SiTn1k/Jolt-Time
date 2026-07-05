/**
 * Error Handling Interfaces
 *
 * Exports all interfaces for the error-handling domain.
 */

export type { ISystemError } from './ISystemError';
export type { IErrorCategory } from './IErrorCategory';
export type { IErrorContext } from './IErrorContext';
export type {
  IErrorRepository,
  SystemErrorFilterParams,
  ErrorCategoryFilterParams,
  ErrorContextFilterParams,
} from './IErrorRepository';
