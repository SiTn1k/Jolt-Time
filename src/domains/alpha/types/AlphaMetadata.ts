/**
 * AlphaMetadata Type
 *
 * Defines metadata structures for alpha domain entities.
 */

import type { ReleaseStage } from './ReleaseStage';
import type { ChecklistStatus } from './ChecklistStatus';
import type { MilestoneStatus } from './MilestoneStatus';

/**
 * Metadata for a checklist item.
 */
export interface ChecklistMetadata {
  /** Category of the checklist item */
  category: string;
  /** Priority level (1-5, 5 being highest) */
  priority: number;
  /** Associated milestone ID if applicable */
  milestoneId?: string;
  /** Notes or additional information */
  notes?: string;
  /** Last verified timestamp */
  verifiedAt?: string;
}

/**
 * Metadata for a milestone.
 */
export interface MilestoneMetadata {
  /** Category of the milestone */
  category: string;
  /** Description of the milestone goals */
  goals: string[];
  /** Associated team or owner */
  team?: string;
  /** Completion criteria */
  criteria: string[];
  /** Last status update timestamp */
  updatedAt?: string;
}

/**
 * Metadata for a snapshot.
 */
export interface SnapshotMetadata {
  /** Build identifier */
  buildId?: string;
  /** Git commit hash */
  commitHash?: string;
  /** Branch name */
  branch?: string;
  /** Environment */
  environment: string;
  /** Any notable changes in this snapshot */
  changes?: string[];
  /** Test coverage percentage if available */
  testCoverage?: number;
  /** Performance metrics summary */
  performanceMetrics?: Record<string, number>;
}

/**
 * Creates default checklist metadata.
 */
export function createDefaultChecklistMetadata(category: string): ChecklistMetadata {
  return {
    category,
    priority: 3,
    notes: '',
  };
}

/**
 * Creates default milestone metadata.
 */
export function createDefaultMilestoneMetadata(category: string, goals: string[]): MilestoneMetadata {
  return {
    category,
    goals,
    criteria: [],
  };
}

/**
 * Creates default snapshot metadata.
 */
export function createDefaultSnapshotMetadata(environment: string): SnapshotMetadata {
  return {
    environment,
  };
}
