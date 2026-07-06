/**
 * IQAReport Interface
 *
 * Interface defining the contract for QA report entities.
 */

import type { ReportId } from '../value-objects/ReportId';
import type { QAMetadata } from '../types/QAMetadata';

/**
 * QA report interface.
 * Defines the contract for QA report entities.
 */
export interface IQAReport {
  /** Unique QA report identifier */
  readonly reportId: ReportId;

  /** Timestamp when the report was created */
  readonly createdAt: Date;

  /** Number of passed checks */
  readonly passedChecks: number;

  /** Number of failed checks */
  readonly failedChecks: number;

  /** Number of warnings */
  readonly warnings: number;

  /** Additional metadata */
  readonly metadata: QAMetadata;
}
