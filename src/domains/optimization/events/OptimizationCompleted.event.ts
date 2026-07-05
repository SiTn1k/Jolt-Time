/**
 * Optimization Completed Event
 *
 * Domain event emitted when an optimization analysis completes.
 */

import type { OptimizationLevel } from '../types/OptimizationLevel';
import type { OptimizationStatus } from '../types/OptimizationStatus';

/**
 * Event data for optimization completion.
 */
export interface OptimizationCompletedEventData {
  /** Optimization ID */
  optimizationId: string;

  /** Module name optimized */
  moduleName: string;

  /** Final optimization status */
  status: OptimizationStatus;

  /** Final optimization level */
  level: OptimizationLevel;

  /** Number of profiles analyzed */
  profilesAnalyzed: number;

  /** Number of snapshots created */
  snapshotsCreated: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for optimization completion.
 */
export interface OptimizationCompletedEvent {
  /** Event type identifier */
  readonly eventType: 'OptimizationCompleted';

  /** Event data */
  readonly data: OptimizationCompletedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an OptimizationCompletedEvent.
 */
export function createOptimizationCompletedEvent(params: {
  optimizationId: string;
  moduleName: string;
  status: OptimizationStatus;
  level: OptimizationLevel;
  profilesAnalyzed: number;
  snapshotsCreated: number;
}): OptimizationCompletedEvent {
  return {
    eventType: 'OptimizationCompleted',
    version: 1,
    data: {
      optimizationId: params.optimizationId,
      moduleName: params.moduleName,
      status: params.status,
      level: params.level,
      profilesAnalyzed: params.profilesAnalyzed,
      snapshotsCreated: params.snapshotsCreated,
      occurredAt: new Date(),
    },
  };
}
