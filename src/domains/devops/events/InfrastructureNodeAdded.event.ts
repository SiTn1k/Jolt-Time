/**
 * Infrastructure Node Added Event
 *
 * Domain event emitted when a new infrastructure node is added.
 */

import type { NodeId } from '../value-objects/NodeId';
import type { InfrastructureType } from '../types/InfrastructureType';

/**
 * Event data for infrastructure node addition.
 */
export interface InfrastructureNodeAddedEventData {
  /** Node ID */
  nodeId: string;

  /** Node name */
  nodeName: string;

  /** Node type */
  nodeType: InfrastructureType;

  /** Region */
  region: string;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for infrastructure node addition.
 */
export interface InfrastructureNodeAddedEvent {
  /** Event type identifier */
  readonly eventType: 'InfrastructureNodeAdded';

  /** Event data */
  readonly data: InfrastructureNodeAddedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an InfrastructureNodeAddedEvent.
 */
export function createInfrastructureNodeAddedEvent(params: {
  nodeId: NodeId;
  nodeName: string;
  nodeType: InfrastructureType;
  region: string;
}): InfrastructureNodeAddedEvent {
  return {
    eventType: 'InfrastructureNodeAdded',
    version: 1,
    data: {
      nodeId: params.nodeId.value,
      nodeName: params.nodeName,
      nodeType: params.nodeType,
      region: params.region,
      occurredAt: new Date(),
    },
  };
}