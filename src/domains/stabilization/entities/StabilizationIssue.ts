/**
 * StabilizationIssue Entity
 *
 * Domain entity representing a detected stabilization issue.
 * This entity ONLY stores issues - it never modifies gameplay.
 *
 * StabilizationIssue Entity Responsibilities:
 * - Store issue detection data
 * - Track issue severity and status
 * - Link issues to specific modules
 *
 * StabilizationIssue Entity is NOT:
 * - A gameplay modifier
 * - A reward distributor
 * - A state changer
 */

import type { IStabilizationIssue } from '../interfaces/IStabilizationIssue';
import { IssueId } from '../value-objects/IssueId';
import { IssueSeverity, ISSUE_SEVERITY_CONSTRAINTS } from '../types/IssueSeverity';
import { IssueStatus, ISSUE_STATUS_CONSTRAINTS } from '../types/IssueStatus';
import { StabilizationMetadata, INITIAL_STABILIZATION_METADATA } from '../types/StabilizationMetadata';

/**
 * StabilizationIssue entity class.
 * Immutable domain entity representing a stabilization issue.
 */
export class StabilizationIssue implements IStabilizationIssue {
  /** Unique issue identifier */
  public readonly issueId: IssueId;

  /** Module where the issue was detected */
  public readonly module: string;

  /** Severity level of the issue */
  public readonly severity: IssueSeverity;

  /** Human-readable issue description */
  public readonly description: string;

  /** Current status of the issue */
  public readonly status: IssueStatus;

  /** Timestamp when the issue was created */
  public readonly createdAt: Date;

  /** Additional metadata */
  public readonly metadata: StabilizationMetadata;

  /**
   * Creates a new StabilizationIssue instance.
   * @param props StabilizationIssue properties
   */
  constructor(props: StabilizationIssueProps) {
    this.issueId = props.issueId;
    this.module = props.module;
    this.severity = props.severity;
    this.description = props.description;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.metadata = props.metadata ?? { ...INITIAL_STABILIZATION_METADATA };
  }

  /**
   * Creates a new StabilizationIssue for storing.
   * Factory method for new issue creation.
   */
  public static create(params: {
    issueId?: IssueId;
    module: string;
    severity: IssueSeverity;
    description: string;
    status?: IssueStatus;
    metadata?: StabilizationMetadata;
  }): StabilizationIssue {
    return new StabilizationIssue({
      issueId: params.issueId ?? IssueId.generate(),
      module: params.module,
      severity: params.severity,
      description: params.description,
      status: params.status ?? IssueStatus.DETECTED,
      createdAt: new Date(),
      metadata: params.metadata ?? { ...INITIAL_STABILIZATION_METADATA },
    });
  }

  /**
   * Creates a StabilizationIssue from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: StabilizationIssueRecord): StabilizationIssue {
    return new StabilizationIssue({
      issueId: IssueId.reconstruct(record.issue_id),
      module: record.module,
      severity: record.severity as IssueSeverity,
      description: record.description,
      status: record.status as IssueStatus,
      createdAt: new Date(record.created_at),
      metadata: record.metadata ?? { ...INITIAL_STABILIZATION_METADATA },
    });
  }

  /**
   * Serializes the StabilizationIssue to a plain object.
   */
  public toJSON(): StabilizationIssueJSON {
    return {
      issueId: this.issueId.value,
      module: this.module,
      severity: this.severity,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      metadata: this.metadata,
    };
  }
}

/**
 * StabilizationIssue properties interface for constructor.
 */
export interface StabilizationIssueProps {
  issueId: IssueId;
  module: string;
  severity: IssueSeverity;
  description: string;
  status: IssueStatus;
  createdAt: Date;
  metadata?: StabilizationMetadata;
}

/**
 * Database record representation of StabilizationIssue.
 */
export interface StabilizationIssueRecord {
  issue_id: string;
  module: string;
  severity: string;
  description: string;
  status: string;
  created_at: string;
  metadata?: StabilizationMetadata;
}

/**
 * JSON serialization representation of StabilizationIssue.
 */
export interface StabilizationIssueJSON {
  issueId: string;
  module: string;
  severity: IssueSeverity;
  description: string;
  status: IssueStatus;
  createdAt: string;
  metadata: StabilizationMetadata;
}
