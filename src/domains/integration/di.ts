/**
 * Integration Domain Dependency Injection Registration
 *
 * Registers all integration domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseIntegrationRepository } from './repositories/SupabaseIntegrationRepository';
import { IntegrationMapper, ProviderMapper, RequestMapper, ResponseMapper } from './mappers';
import { IntegrationValidator, ProviderValidator, RequestValidator, ResponseValidator } from './validators';

/**
 * Integration Domain DI configuration keys.
 */
export const INTEGRATION_TOKENS = {
  INTEGRATION_REPOSITORY: Symbol.for('SupabaseIntegrationRepository'),
  INTEGRATION_MAPPER: Symbol.for('IntegrationMapper'),
  PROVIDER_MAPPER: Symbol.for('ProviderMapper'),
  REQUEST_MAPPER: Symbol.for('RequestMapper'),
  RESPONSE_MAPPER: Symbol.for('ResponseMapper'),
  INTEGRATION_VALIDATOR: Symbol.for('IntegrationValidator'),
  PROVIDER_VALIDATOR: Symbol.for('ProviderValidator'),
  REQUEST_VALIDATOR: Symbol.for('RequestValidator'),
  RESPONSE_VALIDATOR: Symbol.for('ResponseValidator'),
} as const;

/**
 * Register all integration domain dependencies with the container.
 */
export function registerIntegrationDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseIntegrationRepository,
    () => new SupabaseIntegrationRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mappers (Singleton - stateless)
  container.registerInstance(IntegrationMapper, new IntegrationMapper());
  container.registerInstance(ProviderMapper, new ProviderMapper());
  container.registerInstance(RequestMapper, new RequestMapper());
  container.registerInstance(ResponseMapper, new ResponseMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(IntegrationValidator, new IntegrationValidator());
  container.registerInstance(ProviderValidator, new ProviderValidator());
  container.registerInstance(RequestValidator, new RequestValidator());
  container.registerInstance(ResponseValidator, new ResponseValidator());
}

// Import the repository interface for type resolution
import type { IIntegrationRepository } from './interfaces/IIntegrationRepository';

/**
 * Quick setup function for integration domain.
 * Creates and configures all integration domain components.
 */
export function setupIntegrationDomain(): {
  integrationRepository: SupabaseIntegrationRepository;
  integrationMapper: IntegrationMapper;
  providerMapper: ProviderMapper;
  requestMapper: RequestMapper;
  responseMapper: ResponseMapper;
  integrationValidator: IntegrationValidator;
  providerValidator: ProviderValidator;
  requestValidator: RequestValidator;
  responseValidator: ResponseValidator;
} {
  const integrationRepository = new SupabaseIntegrationRepository();
  const integrationMapper = new IntegrationMapper();
  const providerMapper = new ProviderMapper();
  const requestMapper = new RequestMapper();
  const responseMapper = new ResponseMapper();
  const integrationValidator = new IntegrationValidator();
  const providerValidator = new ProviderValidator();
  const requestValidator = new RequestValidator();
  const responseValidator = new ResponseValidator();

  return {
    integrationRepository,
    integrationMapper,
    providerMapper,
    requestMapper,
    responseMapper,
    integrationValidator,
    providerValidator,
    requestValidator,
    responseValidator,
  };
}
