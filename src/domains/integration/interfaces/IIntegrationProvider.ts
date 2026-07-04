/**
 * IntegrationProvider Interface
 *
 * Interface defining the contract for IntegrationProvider entity.
 * All IntegrationProvider implementations must adhere to this interface.
 */

import type { ProviderId } from '../value-objects/ProviderId';
import type { IntegrationType } from '../types/IntegrationType';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { ProviderConfiguration } from '../types/ProviderConfiguration';
import type { IntegrationProviderMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationProvider entity interface.
 * Represents an external service integration provider.
 */
export interface IIntegrationProvider {
  /** Unique internal identifier */
  readonly providerId: ProviderId;

  /** Provider display name */
  readonly providerName: string;

  /** Type of integration */
  readonly providerType: IntegrationType;

  /** Current provider status */
  readonly status: IntegrationStatus;

  /** Provider version */
  readonly version: string;

  /** Provider configuration */
  readonly configuration: ProviderConfiguration;

  /** Provider metadata */
  readonly metadata: IntegrationProviderMetadata;

  /** Timestamp when provider was created */
  readonly createdAt: Date;

  /** Timestamp when provider was last updated */
  readonly updatedAt: Date;
}
