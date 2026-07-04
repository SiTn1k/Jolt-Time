/**
 * HealthCheck Entity
 *
 * Domain entity representing a health check record.
 * This entity ONLY records health status - it never modifies gameplay.
 *
 * HealthCheck Entity Responsibilities:
 * - Store health check results
 * - Track service health status
 * - Record response times and details
 *
 * HealthCheck Entity is NOT:
 * - A health monitor
 * - A threshold evaluator
 * - An alert generator
 */

import type { IHealthCheck } from '../interfaces/IHealthCheck';
import { HealthCheckId } from '../value-objects/HealthCheckId';
import { HealthStatus } from '../types/HealthStatus';
import { MonitoringMetadata, INITIAL_MONITORING_METADATA } from '../types/MonitoringMetadata';

/**
 * HealthCheck entity properties interface.
 */
export interface HealthCheckProps {
  healthCheckId: HealthCheckId;
  serviceName: string;
  status: HealthStatus;
  checkedAt: Date;
  responseTime: number;
  details?: string;
  metadata?: MonitoringMetadata;
}

/**
 * Database record representation of HealthCheck.
 */
export interface HealthCheckRecord {
  health_check_id: string;
  service_name: string;
  status: string;
  checked_at: string;
  response_time: number;
  details?: string;
  metadata?: MonitoringMetadata;
}

/**
 * JSON serialization representation of HealthCheck.
 */
export interface HealthCheckJSON {
  healthCheckId: string;
  serviceName: string;
  status: HealthStatus;
  checkedAt: string;
  responseTime: number;
  details?: string;
  metadata: MonitoringMetadata;
}

/**
 * HealthCheck entity class.
 * Immutable domain entity representing a health check result.
 */
export class HealthCheck implements IHealthCheck {
  /** Unique health check identifier */
  public readonly healthCheckId: HealthCheckId;

  /** Name of the service checked */
  public readonly serviceName: string;

  /** Health status of the service */
  public readonly status: HealthStatus;

  /** Timestamp when the check was performed */
  public readonly checkedAt: Date;

  /** Response time in milliseconds */
  public readonly responseTime: number;

  /** Optional additional details about the health check */
  public readonly details?: string;

  /** Health check metadata */
  public readonly metadata: MonitoringMetadata;

  /**
   * Creates a new HealthCheck instance.
   * @param props HealthCheck properties
   */
  constructor(props: HealthCheckProps) {
    this.healthCheckId = props.healthCheckId;
    this.serviceName = props.serviceName;
    this.status = props.status;
    this.checkedAt = props.checkedAt;
    this.responseTime = props.responseTime;
    this.details = props.details;
    this.metadata = props.metadata ?? { ...INITIAL_MONITORING_METADATA };
  }

  /**
   * Creates a new HealthCheck for recording.
   * Factory method for new health check creation.
   */
  public static create(params: {
    healthCheckId: HealthCheckId;
    serviceName: string;
    status: HealthStatus;
    responseTime: number;
    details?: string;
    metadata?: MonitoringMetadata;
  }): HealthCheck {
    return new HealthCheck({
      healthCheckId: params.healthCheckId,
      serviceName: params.serviceName,
      status: params.status,
      checkedAt: new Date(),
      responseTime: params.responseTime,
      details: params.details,
      metadata: params.metadata ?? { ...INITIAL_MONITORING_METADATA },
    });
  }

  /**
   * Creates a HealthCheck from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: HealthCheckRecord): HealthCheck {
    return new HealthCheck({
      healthCheckId: HealthCheckId.reconstruct(record.health_check_id),
      serviceName: record.service_name,
      status: record.status as HealthStatus,
      checkedAt: new Date(record.checked_at),
      responseTime: record.response_time,
      details: record.details,
      metadata: record.metadata ?? { ...INITIAL_MONITORING_METADATA },
    });
  }

  /**
   * Creates a copy of HealthCheck with optional modifications.
   */
  public copyWith(params: Partial<{
    serviceName: string;
    status: HealthStatus;
    responseTime: number;
    details?: string;
    metadata: MonitoringMetadata;
  }>): HealthCheck {
    return new HealthCheck({
      healthCheckId: this.healthCheckId,
      serviceName: params.serviceName ?? this.serviceName,
      status: params.status ?? this.status,
      checkedAt: this.checkedAt,
      responseTime: params.responseTime ?? this.responseTime,
      details: params.details ?? this.details,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Serializes the HealthCheck to a plain object.
   */
  public toJSON(): HealthCheckJSON {
    return {
      healthCheckId: this.healthCheckId.value,
      serviceName: this.serviceName,
      status: this.status,
      checkedAt: this.checkedAt.toISOString(),
      responseTime: this.responseTime,
      details: this.details,
      metadata: this.metadata,
    };
  }
}
