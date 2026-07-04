/**
 * IntegrationResponseReceived Event
 *
 * Domain event emitted when an integration response is received.
 */

import type { ResponseId } from '../value-objects/ResponseId';
import type { RequestId } from '../value-objects/RequestId';
import type { RequestStatus } from '../types/RequestStatus';

/**
 * Event data for response receipt.
 */
export interface IntegrationResponseReceivedEventData {
  /** Response ID */
  responseId: string;

  /** Request ID */
  requestId: string;

  /** Response status */
  status: RequestStatus;

  /** Response code */
  responseCode: number;

  /** Timestamp */
  occurredAt: Date;
}

/**
 * Domain event for response receipt.
 */
export interface IntegrationResponseReceivedEvent {
  /** Event type identifier */
  readonly eventType: 'IntegrationResponseReceived';

  /** Event data */
  readonly data: IntegrationResponseReceivedEventData;

  /** Event version for schema evolution */
  readonly version: 1;
}

/**
 * Creates an IntegrationResponseReceivedEvent.
 */
export function createIntegrationResponseReceivedEvent(params: {
  responseId: ResponseId;
  requestId: RequestId;
  status: RequestStatus;
  responseCode: number;
}): IntegrationResponseReceivedEvent {
  return {
    eventType: 'IntegrationResponseReceived',
    version: 1,
    data: {
      responseId: params.responseId.value,
      requestId: params.requestId.value,
      status: params.status,
      responseCode: params.responseCode,
      occurredAt: new Date(),
    },
  };
}
