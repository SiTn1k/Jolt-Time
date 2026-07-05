/**
 * System Error Interface
 *
 * Interface defining the contract for SystemError entities.
 */

import type { ErrorId } from '../value-objects/ErrorId';
import type { ErrorSeverity } from '../types/ErrorSeverity';
import type { ErrorStatus } from '../types/ErrorStatus';
import type { ErrorCategoryType } from '../types/ErrorCategoryType';
import type { ErrorMetadata } from '../types/ErrorMetadata';

/**
 * SystemError interface.
 * Defines the contract for system error entities.
 */
export interface ISystemError {
  /** Unique error identifier */
  readonly errorId: ErrorId;

  /** Error code identifier */
  readonly errorCode: string;

  /** Error category */
  readonly category: ErrorCategoryType;

  /** Error severity level */
  readonly severity: ErrorSeverity;

  /** Error message */
  readonly message: string;

  /** Stack trace if available */
  readonly stackTrace?: string;

  /** Timestamp when error was created */
  readonly createdAt: Date;

  /** Error metadata */
  readonly metadata: ErrorMetadata;

  /** Error status */
  readonly status: ErrorStatus;

  /** Timestamp when error was resolved */
  readonly resolvedAt?: Date;

  /** Associated context ID */
  readonly contextId?: string;
}
