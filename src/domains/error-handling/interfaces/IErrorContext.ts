/**
 * Error Context Interface
 *
 * Interface defining the contract for ErrorContext entities.
 */

import type { ContextId } from '../value-objects/ContextId';

/**
 * ErrorContext interface.
 * Defines the contract for error context entities.
 */
export interface IErrorContext {
  /** Unique context identifier */
  readonly contextId: ContextId;

  /** Service name */
  readonly service: string;

  /** Operation name */
  readonly operation: string;

  /** Associated request ID */
  readonly requestId?: string;

  /** Associated actor/user ID */
  readonly actorId?: string;

  /** Context metadata */
  readonly metadata: Record<string, unknown>;

  /** Timestamp when context was created */
  readonly createdAt: Date;
}
