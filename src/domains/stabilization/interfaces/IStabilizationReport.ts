/**
 * Stabilization Report Interface
 *
 * Interface defining the contract for StabilizationReport entities.
 */

import type { ReportId } from '../value-objects/ReportId';
import type { StabilizationMetadata } from '../types/StabilizationMetadata';

/**
 * Stabilization report entity interface.
 * Defines the contract for stabilization report entities.
 */
export interface IStabilizationReport {
  /** Unique report identifier */
  readonly reportId: ReportId;

  /** Timestamp when the report was created */
  readonly createdAt: Date;

  /** List of modules that are healthy */
  readonly healthyModules: string[];

  /** List of modules with warnings */
  readonly warningModules: string[];

  /** List of modules that failed */
  readonly failedModules: string[];

  /** Additional metadata */
  readonly metadata: StabilizationMetadata;
}
