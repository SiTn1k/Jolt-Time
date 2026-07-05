/**
 * Optimization Started Event
 *
 * Domain event emitted when an optimization analysis starts.
 */

import type { OptimizationLevel } from '../types/OptimizationLevel';

/**
 * Event data for optimization start.
 */
export interface OptimizationStartedEventData {
  /** Optimization ID */
  optimizationId: string;

  /** Module name being optimized */
  moduleName: string;

  /** Optimization level */
  level: OptimizationLevel;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for optimization start.
 */
export interface OptimizationStartedEvent {
  /** Event type identifier */
  readonly eventType: 'OptimizationStarted';

  /** Event data */
  readonly data: OptimizationStartedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an OptimizationStartedEvent.
 */
export function createOptimizationStartedEvent(params: {
  optimizationId: string;
  moduleName: string;
  level: OptimizationLevel;
}): OptimizationStartedEvent {
  return {
    eventType: 'OptimizationStarted',
    version: 1,
    data: {
      optimizationId: params.optimizationId,
      moduleName: params.moduleName,
      level: params.level,
      occurredAt: new Date(),
    },
  };
}
