/**
 * ServiceStatus Entity
 *
 * Domain entity representing a service status record.
 * This entity ONLY records service status - it never modifies gameplay.
 *
 * ServiceStatus Entity Responsibilities:
 * - Store service status information
 * - Track heartbeat timestamps
 * - Record service versions
 *
 * ServiceStatus Entity is NOT:
 * - A service monitor
 * - A health evaluator
 * - An alert generator
 */

import type { IServiceStatus } from '../interfaces/IServiceStatus';
import { ServiceId } from '../value-objects/ServiceId';
import { ServiceStatusType } from '../types/ServiceStatusType';
import { MonitoringMetadata, INITIAL_MONITORING_METADATA } from '../types/MonitoringMetadata';

/**
 * ServiceStatus entity properties interface.
 */
export interface ServiceStatusProps {
  serviceId: ServiceId;
  serviceName: string;
  status: ServiceStatusType;
  lastHeartbeat: Date;
  version?: string;
  metadata?: MonitoringMetadata;
}

/**
 * Database record representation of ServiceStatus.
 */
export interface ServiceStatusRecord {
  service_id: string;
  service_name: string;
  status: string;
  last_heartbeat: string;
  version?: string;
  metadata?: MonitoringMetadata;
}

/**
 * JSON serialization representation of ServiceStatus.
 */
export interface ServiceStatusJSON {
  serviceId: string;
  serviceName: string;
  status: ServiceStatusType;
  lastHeartbeat: string;
  version?: string;
  metadata: MonitoringMetadata;
}

/**
 * ServiceStatus entity class.
 * Immutable domain entity representing a service status.
 */
export class ServiceStatus implements IServiceStatus {
  /** Unique service identifier */
  public readonly serviceId: ServiceId;

  /** Service name */
  public readonly serviceName: string;

  /** Current service status */
  public readonly status: ServiceStatusType;

  /** Timestamp of last heartbeat */
  public readonly lastHeartbeat: Date;

  /** Service version */
  public readonly version?: string;

  /** Service status metadata */
  public readonly metadata: MonitoringMetadata;

  /**
   * Creates a new ServiceStatus instance.
   * @param props ServiceStatus properties
   */
  constructor(props: ServiceStatusProps) {
    this.serviceId = props.serviceId;
    this.serviceName = props.serviceName;
    this.status = props.status;
    this.lastHeartbeat = props.lastHeartbeat;
    this.version = props.version;
    this.metadata = props.metadata ?? { ...INITIAL_MONITORING_METADATA };
  }

  /**
   * Creates a new ServiceStatus for recording.
   * Factory method for new service status creation.
   */
  public static create(params: {
    serviceId: ServiceId;
    serviceName: string;
    status: ServiceStatusType;
    version?: string;
    metadata?: MonitoringMetadata;
  }): ServiceStatus {
    return new ServiceStatus({
      serviceId: params.serviceId,
      serviceName: params.serviceName,
      status: params.status,
      lastHeartbeat: new Date(),
      version: params.version,
      metadata: params.metadata ?? { ...INITIAL_MONITORING_METADATA },
    });
  }

  /**
   * Creates a ServiceStatus from a database record.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: ServiceStatusRecord): ServiceStatus {
    return new ServiceStatus({
      serviceId: ServiceId.reconstruct(record.service_id),
      serviceName: record.service_name,
      status: record.status as ServiceStatusType,
      lastHeartbeat: new Date(record.last_heartbeat),
      version: record.version,
      metadata: record.metadata ?? { ...INITIAL_MONITORING_METADATA },
    });
  }

  /**
   * Creates a copy of ServiceStatus with optional modifications.
   */
  public copyWith(params: Partial<{
    serviceName: string;
    status: ServiceStatusType;
    lastHeartbeat: Date;
    version: string;
    metadata: MonitoringMetadata;
  }>): ServiceStatus {
    return new ServiceStatus({
      serviceId: this.serviceId,
      serviceName: params.serviceName ?? this.serviceName,
      status: params.status ?? this.status,
      lastHeartbeat: params.lastHeartbeat ?? this.lastHeartbeat,
      version: params.version ?? this.version,
      metadata: params.metadata ?? this.metadata,
    });
  }

  /**
   * Updates the heartbeat timestamp.
   */
  public updateHeartbeat(): ServiceStatus {
    return this.copyWith({ lastHeartbeat: new Date() });
  }

  /**
   * Serializes the ServiceStatus to a plain object.
   */
  public toJSON(): ServiceStatusJSON {
    return {
      serviceId: this.serviceId.value,
      serviceName: this.serviceName,
      status: this.status,
      lastHeartbeat: this.lastHeartbeat.toISOString(),
      version: this.version,
      metadata: this.metadata,
    };
  }
}
