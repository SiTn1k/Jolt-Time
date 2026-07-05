/**
 * Stabilization Issue Interface
 *
 * Interface defining the contract for StabilizationIssue entities.
 */

import type { IssueId } from '../value-objects/IssueId';
import type { IssueSeverity } from '../types/IssueSeverity';
import type { IssueStatus } from '../types/IssueStatus';
import type { StabilizationMetadata } from '../types/StabilizationMetadata';

/**
 * Stabilization issue entity interface.
 * Defines the contract for stabilization issue entities.
 */
export interface IStabilizationIssue {
  /** Unique issue identifier */
  readonly issueId: IssueId;

  /** Module where the issue was detected */
  readonly module: string;

  /** Severity level of the issue */
  readonly severity: IssueSeverity;

  /** Human-readable issue description */
  readonly description: string;

  /** Current status of the issue */
  readonly status: IssueStatus;

  /** Timestamp when the issue was created */
  readonly createdAt: Date;

  /** Additional metadata */
  readonly metadata: StabilizationMetadata;
}
