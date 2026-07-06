/**
 * QACheck Interface
 *
 * Interface defining the contract for QA check entities.
 */

import type { CheckId } from '../value-objects/CheckId';
import type { QAStatus } from '../types/QAStatus';
import type { CheckSeverity } from '../types/CheckSeverity';
import type { QAMetadata } from '../types/QAMetadata';

/**
 * QA check interface.
 * Defines the contract for QA check entities.
 */
export interface IQACheck {
  /** Unique QA check identifier */
  readonly checkId: CheckId;

  /** Title of the QA check */
  readonly title: string;

  /** Current status of the check */
  readonly status: QAStatus;

  /** Severity level of the check */
  readonly severity: CheckSeverity;

  /** Timestamp when the check was completed */
  readonly completedAt: Date | null;

  /** Additional metadata */
  readonly metadata: QAMetadata;
}
