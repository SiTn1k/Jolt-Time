/**
 * PerformanceProfile Entity
 *
 * Domain entity representing a performance profile for a module or function.
 * This entity ONLY stores performance data - it never modifies gameplay.
 *
 * PerformanceProfile Entity Responsibilities:
 * - Store performance measurements
 * - Track execution metrics
 * - Provide immutable performance record
 *
 * PerformanceProfile Entity is NOT:
 * - A performance calculator
 * - A threshold monitor
 * - An alert generator
 */

import type { IPerformanceProfile } from '../interfaces/IPerformanceProfile';
import { ProfileId } from '../value-objects/ProfileId';
import { ProfileType } from '../types/ProfileType';
import { OptimizationMetadata, INITIAL_OPTIMIZATION_METADATA } from '../types/OptimizationMetadata';

/**
 * PerformanceProfile entity class.
 * Immutable domain entity representing a performance profile.
 */
export class PerformanceProfile implements IPerformanceProfile {
  /** Unique profile identifier */
  public readonly profileId: ProfileId;

  /** Module name this profile belongs to */
  public readonly moduleName: string;

  /** Average execution time in milliseconds */
  public readonly averageExecutionTime: number;

  /** Peak execution time in milliseconds */
  public readonly peakExecutionTime: number;

  /** Current memory usage in bytes */
  public readonly memoryUsage: number;

  /** Current CPU usage percentage */
  public readonly cpuUsage: number;

  /** Profile type */
  public readonly profileType: ProfileType;

  /** Profile metadata */
  public readonly metadata: OptimizationMetadata;

  /**
   * Creates a new PerformanceProfile instance.
   * @param props PerformanceProfile properties
   */
  constructor(props: PerformanceProfileProps) {
    this.profileId = props.profileId;
    this.moduleName = props.moduleName;
    this.averageExecutionTime = props.averageExecutionTime;
    this.peakExecutionTime = props.peakExecutionTime;
    this.memoryUsage = props.memoryUsage;
    this.cpuUsage = props.cpuUsage;
    this.profileType = props.profileType;
    this.metadata = props.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA };
  }

  /**
   * Creates a new PerformanceProfile for recording.
   * Factory method for new profile creation.
   */
  public static create(params: {
    profileId: ProfileId;
    moduleName: string;
    averageExecutionTime: number;
    peakExecutionTime: number;
    memoryUsage: number;
    cpuUsage: number;
    profileType: ProfileType;
    metadata?: OptimizationMetadata;
  }): PerformanceProfile {
    return new PerformanceProfile({
      profileId: params.profileId,
      moduleName: params.moduleName,
      averageExecutionTime: params.averageExecutionTime,
      peakExecutionTime: params.peakExecutionTime,
      memoryUsage: params.memoryUsage,
      cpuUsage: params.cpuUsage,
      profileType: params.profileType,
      metadata: params.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA },
    });
  }

  /**
   * Creates a PerformanceProfile from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: PerformanceProfileRecord): PerformanceProfile {
    return new PerformanceProfile({
      profileId: ProfileId.reconstruct(record.profile_id),
      moduleName: record.module_name,
      averageExecutionTime: record.average_execution_time,
      peakExecutionTime: record.peak_execution_time,
      memoryUsage: record.memory_usage,
      cpuUsage: record.cpu_usage,
      profileType: record.profile_type as ProfileType,
      metadata: record.metadata ?? { ...INITIAL_OPTIMIZATION_METADATA },
    });
  }

  /**
   * Serializes the PerformanceProfile to a plain object.
   */
  public toJSON(): PerformanceProfileJSON {
    return {
      profileId: this.profileId.value,
      moduleName: this.moduleName,
      averageExecutionTime: this.averageExecutionTime,
      peakExecutionTime: this.peakExecutionTime,
      memoryUsage: this.memoryUsage,
      cpuUsage: this.cpuUsage,
      profileType: this.profileType,
      metadata: this.metadata,
    };
  }
}

/**
 * PerformanceProfile properties interface for constructor.
 */
export interface PerformanceProfileProps {
  profileId: ProfileId;
  moduleName: string;
  averageExecutionTime: number;
  peakExecutionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  profileType: ProfileType;
  metadata?: OptimizationMetadata;
}

/**
 * Database record representation of PerformanceProfile.
 */
export interface PerformanceProfileRecord {
  profile_id: string;
  module_name: string;
  average_execution_time: number;
  peak_execution_time: number;
  memory_usage: number;
  cpu_usage: number;
  profile_type: string;
  metadata?: OptimizationMetadata;
}

/**
 * JSON serialization representation of PerformanceProfile.
 */
export interface PerformanceProfileJSON {
  profileId: string;
  moduleName: string;
  averageExecutionTime: number;
  peakExecutionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  profileType: ProfileType;
  metadata: OptimizationMetadata;
}
