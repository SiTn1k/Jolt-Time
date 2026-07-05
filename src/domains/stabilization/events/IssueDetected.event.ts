/**
 * Issue Detected Event
 *
 * Domain event emitted when a stabilization issue is detected.
 */

import type { IssueId } from '../value-objects/IssueId';
import type { IssueSeverity } from '../types/IssueSeverity';
import type { IssueStatus } from '../types/IssueStatus';

/**
 * Event data for issue detection.
 */
export interface IssueDetectedEventData {
  /** Issue ID */
  issueId: string;

  /** Module where the issue was detected */
  module: string;

  /** Severity level */
  severity: IssueSeverity;

  /** Issue description */
  description: string;

  /** Initial status */
  status: IssueStatus;

  /** Timestamp when detected */
  detectedAt: Date;
}

/**
 * Domain event for issue detection.
 */
export interface IssueDetectedEvent {
  /** Event type identifier */
  readonly eventType: 'IssueDetected';

  /** Event data */
  readonly data: IssueDetectedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an IssueDetectedEvent.
 */
export function createIssueDetectedEvent(params: {
  issueId: IssueId;
  module: string;
  severity: IssueSeverity;
  description: string;
  status: IssueStatus;
}): IssueDetectedEvent {
  return {
    eventType: 'IssueDetected',
    version: 1,
    data: {
      issueId: params.issueId.value,
      module: params.module,
      severity: params.severity,
      description: params.description,
      status: params.status,
      detectedAt: new Date(),
    },
  };
}
