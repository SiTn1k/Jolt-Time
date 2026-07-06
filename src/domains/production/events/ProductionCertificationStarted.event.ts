/**
 * ProductionCertificationStarted Event
 *
 * Domain event emitted when a production certification process starts.
 */

/**
 * Event data for production certification start.
 */
export interface ProductionCertificationStartedEventData {
  /** Certificate ID */
  certificateId: string;
  /** Version being certified */
  version: string;
  /** Who initiated the certification */
  initiatedBy: string;
  /** Certification criteria version */
  criteriaVersion?: string;
  /** Start timestamp */
  occurredAt: Date;
}

/**
 * Domain event for production certification start.
 */
export interface ProductionCertificationStartedEvent {
  /** Event type identifier */
  readonly eventType: 'ProductionCertificationStarted';
  /** Event data */
  readonly data: ProductionCertificationStartedEventData;
  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates a ProductionCertificationStartedEvent.
 */
export function createProductionCertificationStartedEvent(params: {
  certificateId: string;
  version: string;
  initiatedBy: string;
  criteriaVersion?: string;
}): ProductionCertificationStartedEvent {
  return {
    eventType: 'ProductionCertificationStarted',
    version: 1,
    data: {
      certificateId: params.certificateId,
      version: params.version,
      initiatedBy: params.initiatedBy,
      criteriaVersion: params.criteriaVersion,
      occurredAt: new Date(),
    },
  };
}
