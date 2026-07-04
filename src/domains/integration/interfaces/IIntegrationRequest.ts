/**
 * IntegrationRequest Interface
 *
 * Interface defining the contract for IntegrationRequest entity.
 * All IntegrationRequest implementations must adhere to this interface.
 */

import type { RequestId } from '../value-objects/RequestId';
import type { ProviderId } from '../value-objects/ProviderId';
import type { IntegrationRequestMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationRequest entity interface.
 * Represents an external service integration request.
 */
export interface IIntegrationRequest {
  /** Unique internal identifier */
  readonly requestId: RequestId;

  /** Provider ID this request is for */
  readonly providerId: ProviderId;

  /** Type of request */
  readonly requestType: string;

  /** Request payload (JSON-serializable) */
  readonly payload: Record<string, unknown>;

  /** Timestamp when request was created */
  readonly createdAt: Date;

  /** Request metadata */
  readonly metadata: IntegrationRequestMetadata;
}
