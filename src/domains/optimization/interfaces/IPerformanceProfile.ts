/**
 * PerformanceProfile Interface
 *
 * Interface defining the contract for PerformanceProfile entities.
 */

import type { ProfileId } from '../value-objects/ProfileId';
import type { ProfileType } from '../types/ProfileType';
import type { OptimizationMetadata } from '../types/OptimizationMetadata';

/**
 * PerformanceProfile interface.
 * Defines the contract for performance profile entities.
 */
export interface IPerformanceProfile {
  /** Unique profile identifier */
  readonly profileId: ProfileId;

  /** Module name this profile belongs to */
  readonly moduleName: string;

  /** Average execution time in milliseconds */
  readonly averageExecutionTime: number;

  /** Peak execution time in milliseconds */
  readonly peakExecutionTime: number;

  /** Current memory usage in bytes */
  readonly memoryUsage: number;

  /** Current CPU usage percentage */
  readonly cpuUsage: number;

  /** Profile type */
  readonly profileType: ProfileType;

  /** Profile metadata */
  readonly metadata: OptimizationMetadata;
}
