/**
 * SystemError Entity
 *
 * Domain entity representing a system error in the error handling foundation.
 * This entity ONLY stores errors - it never modifies gameplay.
 *
 * SystemError Entity Responsibilities:
 * - Store error data
 * - Track error severity and status
 * - Provide immutable error record
 *
 * SystemError Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 * - A retry mechanism
 * - A recovery engine
 */

import type { ISystemError } from '../interfaces/ISystemError';
import { ErrorId } from '../value-objects/ErrorId';
import { ErrorSeverity } from '../types/ErrorSeverity';
import { ErrorStatus } from '../types/ErrorStatus';
import { ErrorCategoryType } from '../types/ErrorCategoryType';
import { ErrorMetadata, INITIAL_ERROR_METADATA } from '../types/ErrorMetadata';

/**
 * SystemError properties interface for constructor.
 */
export interface SystemErrorProps {
  errorId: ErrorId;
  errorCode: string;
  category: ErrorCategoryType;
  severity: ErrorSeverity;
  message: string;
  stackTrace?: string;
  createdAt: Date;
  metadata?: ErrorMetadata;
  status?: ErrorStatus;
  resolvedAt?: Date;
  contextId?: string;
}

/**
 * Database record representation of SystemError.
 */
export interface SystemErrorRecord {
  error_id: string;
  error_code: string;
  category: string;
  severity: string;
  message: string;
  stack_trace?: string;
  created_at: string;
  metadata?: ErrorMetadata;
  status: string;
  resolved_at?: string;
  context_id?: string;
}

/**
 * JSON serialization representation of SystemError.
 */
export interface SystemErrorJSON {
  errorId: string;
  errorCode: string;
  category: ErrorCategoryType;
  severity: ErrorSeverity;
  message: string;
  stackTrace?: string;
  createdAt: string;
  metadata: ErrorMetadata;
  status: ErrorStatus;
  resolvedAt?: string;
  contextId?: string;
}

/**
 * SystemError entity class.
 * Immutable domain entity representing a system error.
 */
export class SystemError implements ISystemError {
  /** Unique error identifier */
  public readonly errorId: ErrorId;

  /** Error code identifier */
  public readonly errorCode: string;

  /** Error category */
  public readonly category: ErrorCategoryType;

  /** Error severity level */
  public readonly severity: ErrorSeverity;

  /** Error message */
  public readonly message: string;

  /** Stack trace if available */
  public readonly stackTrace?: string;

  /** Timestamp when error was created */
  public readonly createdAt: Date;

  /** Error metadata */
  public readonly metadata: ErrorMetadata;

  /** Error status */
  public readonly status: ErrorStatus;

  /** Timestamp when error was resolved */
  public readonly resolvedAt?: Date;

  /** Associated context ID */
  public readonly contextId?: string;

  /**
   * Creates a new SystemError instance.
   * @param props SystemError properties
   */
  constructor(props: SystemErrorProps) {
    this.errorId = props.errorId;
    this.errorCode = props.errorCode;
    this.category = props.category;
    this.severity = props.severity;
    this.message = props.message;
    this.stackTrace = props.stackTrace;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata ?? { ...INITIAL_ERROR_METADATA };
    this.status = props.status ?? ErrorStatus.New;
    this.resolvedAt = props.resolvedAt;
    this.contextId = props.contextId;
  }

  /**
   * Creates a new SystemError for recording.
   * Factory method for new error creation.
   */
  public static create(params: {
    errorId: ErrorId;
    errorCode: string;
    category: ErrorCategoryType;
    severity: ErrorSeverity;
    message: string;
    stackTrace?: string;
    metadata?: ErrorMetadata;
    contextId?: string;
  }): SystemError {
    return new SystemError({
      errorId: params.errorId,
      errorCode: params.errorCode,
      category: params.category,
      severity: params.severity,
      message: params.message,
      stackTrace: params.stackTrace,
      createdAt: new Date(),
      metadata: params.metadata ?? { ...INITIAL_ERROR_METADATA },
      status: ErrorStatus.New,
      contextId: params.contextId,
    });
  }

  /**
   * Creates a SystemError from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: SystemErrorRecord): SystemError {
    return new SystemError({
      errorId: ErrorId.reconstruct(record.error_id),
      errorCode: record.error_code,
      category: record.category as ErrorCategoryType,
      severity: record.severity as ErrorSeverity,
      message: record.message,
      stackTrace: record.stack_trace,
      createdAt: new Date(record.created_at),
      metadata: record.metadata ?? { ...INITIAL_ERROR_METADATA },
      status: record.status as ErrorStatus,
      resolvedAt: record.resolved_at ? new Date(record.resolved_at) : undefined,
      contextId: record.context_id,
    });
  }

  /**
   * Creates a copy of the SystemError with optional modifications.
   * @param modifications Optional property modifications
   * @returns A new SystemError instance with the modifications
   */
  public copyWith(modifications: Partial<SystemErrorProps>): SystemError {
    return new SystemError({
      errorId: modifications.errorId ?? this.errorId,
      errorCode: modifications.errorCode ?? this.errorCode,
      category: modifications.category ?? this.category,
      severity: modifications.severity ?? this.severity,
      message: modifications.message ?? this.message,
      stackTrace: modifications.stackTrace ?? this.stackTrace,
      createdAt: modifications.createdAt ?? this.createdAt,
      metadata: modifications.metadata ?? this.metadata,
      status: modifications.status ?? this.status,
      resolvedAt: modifications.resolvedAt ?? this.resolvedAt,
      contextId: modifications.contextId ?? this.contextId,
    });
  }

  /**
   * Serializes the SystemError to a plain object.
   */
  public toJSON(): SystemErrorJSON {
    return {
      errorId: this.errorId.value,
      errorCode: this.errorCode,
      category: this.category,
      severity: this.severity,
      message: this.message,
      stackTrace: this.stackTrace,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
      status: this.status,
      resolvedAt: this.resolvedAt?.toISOString(),
      contextId: this.contextId,
    };
  }
}
