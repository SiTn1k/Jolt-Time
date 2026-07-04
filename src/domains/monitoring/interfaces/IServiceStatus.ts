/**
 * IServiceStatus Interface
 *
 * Interface defining the contract for ServiceStatus entities.
 */

import type { ServiceId } from '../value-objects/ServiceId';
import type { ServiceStatusType } from '../types/ServiceStatusType';
import type { MonitoringMetadata } from '../types/MonitoringMetadata';

/**
 * Service status entity interface.
 * Defines the contract for service status domain entities.
 */
export interface IServiceStatus {
  /** Unique service identifier */
  readonly serviceId: ServiceId;

  /** Service name */
  readonly serviceName: string;

  /** Current service status */
  readonly status: ServiceStatusType;

  /** Timestamp of last heartbeat */
  readonly lastHeartbeat: Date;

  /** Service version */
  readonly version?: string;

  /** Service status metadata */
  readonly metadata: MonitoringMetadata;
}
