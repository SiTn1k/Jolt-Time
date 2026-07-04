/**
 * IntegrationResponse Interface
 *
 * Interface defining the contract for IntegrationResponse entity.
 * All IntegrationResponse implementations must adhere to this interface.
 */

import type { ResponseId } from '../value-objects/ResponseId';
import type { RequestId } from '../value-objects/RequestId';
import type { RequestStatus } from '../types/RequestStatus';
import type { IntegrationResponseMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationResponse entity interface.
 * Represents an external service integration response.
 */
export interface IIntegrationResponse {
  /** Unique internal identifier */
  readonly responseId: ResponseId;

  /** Request ID this response is for */
  readonly requestId: RequestId;

  /** Response status */
  readonly status: RequestStatus;

  /** HTTP status code or similar response code */
  readonly responseCode: number;

  /** Response payload (JSON-serializable) */
  readonly payload: Record<string, unknown>;

  /** Timestamp when response was received */
  readonly receivedAt: Date;

  /** Response metadata */
  readonly metadata: IntegrationResponseMetadata;
}
