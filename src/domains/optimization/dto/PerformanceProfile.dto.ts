/**
 * Performance Profile DTO
 *
 * Data Transfer Object for performance profile requests.
 */

import type { ProfileType } from '../types/ProfileType';
import type { OptimizationMetadata } from '../types/OptimizationMetadata';

/**
 * DTO for creating a new performance profile.
 */
export interface CreatePerformanceProfileDto {
  /** Module name */
  moduleName: string;

  /** Average execution time in milliseconds */
  averageExecutionTime: number;

  /** Peak execution time in milliseconds */
  peakExecutionTime: number;

  /** Memory usage in bytes */
  memoryUsage: number;

  /** CPU usage percentage */
  cpuUsage: number;

  /** Profile type */
  profileType: ProfileType;

  /** Profile metadata */
  metadata?: OptimizationMetadata;
}

/**
 * DTO for updating a performance profile.
 */
export interface UpdatePerformanceProfileDto {
  /** Average execution time in milliseconds */
  averageExecutionTime?: number;

  /** Peak execution time in milliseconds */
  peakExecutionTime?: number;

  /** Memory usage in bytes */
  memoryUsage?: number;

  /** CPU usage percentage */
  cpuUsage?: number;

  /** Profile metadata */
  metadata?: OptimizationMetadata;
}

/**
 * DTO for performance profile response.
 */
export interface PerformanceProfileResponseDto {
  /** Profile ID */
  profileId: string;

  /** Module name */
  moduleName: string;

  /** Average execution time in milliseconds */
  averageExecutionTime: number;

  /** Peak execution time in milliseconds */
  peakExecutionTime: number;

  /** Memory usage in bytes */
  memoryUsage: number;

  /** CPU usage percentage */
  cpuUsage: number;

  /** Profile type */
  profileType: ProfileType;

  /** Profile metadata */
  metadata: OptimizationMetadata;
}
