/**
 * Error Handling Types
 *
 * Exports all types for the error-handling domain.
 */

export { ErrorSeverity, ERROR_SEVERITY_CONSTRAINTS, ERROR_SEVERITY_RANK } from './ErrorSeverity';
export { ErrorStatus, ERROR_STATUS_CONSTRAINTS } from './ErrorStatus';
export { ErrorCategoryType, ERROR_CATEGORY_TYPE_CONSTRAINTS } from './ErrorCategoryType';
export type { ErrorMetadata } from './ErrorMetadata';
export { INITIAL_ERROR_METADATA, ERROR_METADATA_CONSTRAINTS } from './ErrorMetadata';
export type { ErrorStatistics, ErrorTrendPoint, ErrorFrequency } from './ErrorStatistics';
export { createEmptyErrorStatistics } from './ErrorStatistics';
