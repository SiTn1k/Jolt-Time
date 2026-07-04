/**
 * IntegrationProvider Entity
 *
 * Domain entity representing an external service integration provider.
 * A provider is the gateway/connector to an external service.
 *
 * IntegrationProvider Entity Responsibilities:
 * - Store provider identity (ID, name, type)
 * - Track provider status and configuration
 * - Store version information
 * - Store provider metadata
 *
 * IntegrationProvider is NOT:
 * - A client for external services
 * - A webhook dispatcher
 * - An HTTP client
 * - A retry mechanism
 * - A circuit breaker
 * - Any gameplay logic
 *
 * Integration Foundation ONLY stores providers, requests, and responses.
 * All external communication logic belongs to P-187.2.
 */

import type { IIntegrationProvider } from '../interfaces/IIntegrationProvider';
import { ProviderId } from '../value-objects/ProviderId';
import type { IntegrationType } from '../types/IntegrationType';
import type { IntegrationStatus } from '../types/IntegrationStatus';
import type { ProviderConfiguration } from '../types/ProviderConfiguration';
import type { IntegrationProviderMetadata } from '../types/IntegrationMetadata';

/**
 * IntegrationProvider entity props for constructor.
 */
export interface IntegrationProviderProps {
  /** Unique internal identifier */
  providerId: ProviderId;

  /** Provider display name */
  providerName: string;

  /** Type of integration */
  providerType: IntegrationType;

  /** Current provider status */
  status: IntegrationStatus;

  /** Provider version */
  version: string;

  /** Provider configuration */
  configuration: ProviderConfiguration;

  /** Provider metadata */
  metadata: IntegrationProviderMetadata;
}

/**
 * Database record representation of IntegrationProvider.
 */
export interface IntegrationProviderRecord {
  provider_id: string;
  provider_name: string;
  provider_type: string;
  status: string;
  version: string;
  configuration: ProviderConfiguration;
  metadata: IntegrationProviderMetadata;
  created_at: string;
  updated_at: string;
}

/**
 * JSON serialization representation of IntegrationProvider.
 */
export interface IntegrationProviderJSON {
  providerId: string;
  providerName: string;
  providerType: IntegrationType;
  status: IntegrationStatus;
  version: string;
  configuration: ProviderConfiguration;
  metadata: IntegrationProviderMetadata;
  createdAt: string;
  updatedAt: string;
}

/**
 * IntegrationProvider entity class.
 * Immutable domain entity representing an external service integration provider.
 */
export class IntegrationProvider implements IIntegrationProvider {
  /** Unique internal identifier */
  public readonly providerId: ProviderId;

  /** Provider display name */
  public readonly providerName: string;

  /** Type of integration */
  public readonly providerType: IntegrationType;

  /** Current provider status */
  public readonly status: IntegrationStatus;

  /** Provider version */
  public readonly version: string;

  /** Provider configuration */
  public readonly configuration: ProviderConfiguration;

  /** Provider metadata */
  public readonly metadata: IntegrationProviderMetadata;

  /** Timestamp when provider was created */
  public readonly createdAt: Date;

  /** Timestamp when provider was last updated */
  public readonly updatedAt: Date;

  /**
   * Creates a new IntegrationProvider instance.
   */
  constructor(props: IntegrationProviderProps & { createdAt?: Date; updatedAt?: Date }) {
    this.providerId = props.providerId;
    this.providerName = props.providerName;
    this.providerType = props.providerType;
    this.status = props.status;
    this.version = props.version;
    this.configuration = props.configuration;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  /**
   * Creates a new IntegrationProvider entity.
   * Factory method for new provider registration.
   */
  public static create(params: {
    providerId?: ProviderId;
    providerName: string;
    providerType: IntegrationType;
    status?: IntegrationStatus;
    version?: string;
    configuration?: ProviderConfiguration;
    metadata?: IntegrationProviderMetadata;
  }): IntegrationProvider {
    const now = new Date();

    return new IntegrationProvider({
      providerId: params.providerId ?? ProviderId.generate(),
      providerName: params.providerName,
      providerType: params.providerType,
      status: params.status ?? 'pending',
      version: params.version ?? '1.0.0',
      configuration: params.configuration ?? {},
      metadata: params.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Reconstructs an IntegrationProvider from stored data.
   * Factory method for reconstructing from persistence.
   */
  public static fromDatabase(record: IntegrationProviderRecord & { created_at?: string; updated_at?: string }): IntegrationProvider {
    return new IntegrationProvider({
      providerId: ProviderId.reconstruct(record.provider_id),
      providerName: record.provider_name,
      providerType: record.provider_type as IntegrationType,
      status: record.status as IntegrationStatus,
      version: record.version,
      configuration: record.configuration,
      metadata: record.metadata,
      createdAt: record.created_at ? new Date(record.created_at) : new Date(),
      updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
    });
  }

  /**
   * Checks if this provider is active.
   */
  public isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Checks if this provider can handle requests.
   */
  public canHandleRequests(): boolean {
    return this.status === 'active';
  }

  /**
   * Checks if this provider has an error status.
   */
  public hasError(): boolean {
    return this.status === 'error';
  }

  /**
   * Creates a copy with updated fields.
   */
  public copyWith(params: Partial<Omit<IntegrationProviderProps, 'providerId' | 'createdAt'>>): IntegrationProvider {
    return new IntegrationProvider({
      providerId: this.providerId,
      providerName: params.providerName ?? this.providerName,
      providerType: params.providerType ?? this.providerType,
      status: params.status ?? this.status,
      version: params.version ?? this.version,
      configuration: params.configuration ?? this.configuration,
      metadata: params.metadata ?? this.metadata,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  /**
   * Serializes the IntegrationProvider to a plain object.
   */
  public toJSON(): IntegrationProviderJSON {
    return {
      providerId: this.providerId.value,
      providerName: this.providerName,
      providerType: this.providerType,
      status: this.status,
      version: this.version,
      configuration: this.configuration,
      metadata: this.metadata,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Converts to database record format.
   */
  public toRecord(): IntegrationProviderRecord {
    return {
      provider_id: this.providerId.value,
      provider_name: this.providerName,
      provider_type: this.providerType,
      status: this.status,
      version: this.version,
      configuration: this.configuration,
      metadata: this.metadata,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }
}
