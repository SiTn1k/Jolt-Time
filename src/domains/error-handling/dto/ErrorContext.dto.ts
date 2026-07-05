/**
 * Error Context DTO
 *
 * Data Transfer Object for error context data.
 */

/**
 * DTO for creating a new error context.
 */
export interface CreateErrorContextDto {
  /** Context ID */
  contextId: string;

  /** Service name */
  service: string;

  /** Operation name */
  operation: string;

  /** Request ID */
  requestId?: string;

  /** Actor/user ID */
  actorId?: string;

  /** Context metadata */
  metadata?: Record<string, unknown>;
}

/**
 * DTO for error context response.
 */
export interface ErrorContextResponseDto {
  /** Context ID */
  contextId: string;

  /** Service name */
  service: string;

  /** Operation name */
  operation: string;

  /** Request ID */
  requestId?: string;

  /** Actor/user ID */
  actorId?: string;

  /** Context metadata */
  metadata: Record<string, unknown>;

  /** Creation timestamp */
  createdAt: string;
}
