/**
 * QACheck Entity
 *
 * Domain entity representing a quality assurance check.
 * This entity ONLY stores QA check data - it never modifies gameplay.
 *
 * QACheck Entity Responsibilities:
 * - Store immutable QA check data
 * - Track check status and severity
 * - Record check completion time
 *
 * QACheck Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IQACheck } from '../interfaces/IQACheck';
import { CheckId } from '../value-objects/CheckId';
import { QAStatus } from '../types/QAStatus';
import { CheckSeverity } from '../types/CheckSeverity';
import { QAMetadata, INITIAL_QA_METADATA } from '../types/QAMetadata';

/**
 * QACheck entity class.
 * Immutable domain entity representing a QA check.
 */
export class QACheck implements IQACheck {
  /** Unique QA check identifier */
  public readonly checkId: CheckId;

  /** Title of the QA check */
  public readonly title: string;

  /** Current status of the check */
  public readonly status: QAStatus;

  /** Severity level of the check */
  public readonly severity: CheckSeverity;

  /** Timestamp when the check was completed */
  public readonly completedAt: Date | null;

  /** Additional metadata */
  public readonly metadata: QAMetadata;

  /**
   * Creates a new QACheck instance.
   * @param props QACheck properties
   */
  constructor(props: QACheckProps) {
    this.checkId = props.checkId;
    this.title = props.title;
    this.status = props.status;
    this.severity = props.severity;
    this.completedAt = props.completedAt ?? null;
    this.metadata = props.metadata ?? { ...INITIAL_QA_METADATA };
  }

  /**
   * Creates a new QACheck for storing.
   * Factory method for new check creation.
   */
  public static create(params: {
    checkId?: CheckId;
    title: string;
    status: QAStatus;
    severity: CheckSeverity;
    completedAt?: Date | null;
    metadata?: QAMetadata;
  }): QACheck {
    return new QACheck({
      checkId: params.checkId ?? CheckId.generate(),
      title: params.title,
      status: params.status,
      severity: params.severity,
      completedAt: params.completedAt ?? null,
      metadata: params.metadata ?? { ...INITIAL_QA_METADATA },
    });
  }

  /**
   * Creates a QACheck from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: QACheckRecord): QACheck {
    return new QACheck({
      checkId: CheckId.reconstruct(record.check_id),
      title: record.title,
      status: record.status as QAStatus,
      severity: record.severity as CheckSeverity,
      completedAt: record.completed_at ? new Date(record.completed_at) : null,
      metadata: record.metadata ?? { ...INITIAL_QA_METADATA },
    });
  }

  /**
   * Serializes the QACheck to a plain object.
   */
  public toJSON(): QACheckJSON {
    return {
      checkId: this.checkId.value,
      title: this.title,
      status: this.status,
      severity: this.severity,
      completedAt: this.completedAt?.toISOString() ?? null,
      metadata: this.metadata,
    };
  }
}

/**
 * QACheck properties interface for constructor.
 */
export interface QACheckProps {
  checkId: CheckId;
  title: string;
  status: QAStatus;
  severity: CheckSeverity;
  completedAt: Date | null;
  metadata?: QAMetadata;
}

/**
 * Database record representation of QACheck.
 */
export interface QACheckRecord {
  check_id: string;
  title: string;
  status: string;
  severity: string;
  completed_at: string | null;
  metadata?: QAMetadata;
}

/**
 * JSON serialization representation of QACheck.
 */
export interface QACheckJSON {
  checkId: string;
  title: string;
  status: QAStatus;
  severity: CheckSeverity;
  completedAt: string | null;
  metadata: QAMetadata;
}
