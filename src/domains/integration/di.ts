/**
 * Integration Domain Dependency Injection Registration
 *
 * Registers all integration domain services with the DI container.
 */

import { SupabaseIntegrationRepository } from './repositories/SupabaseIntegrationRepository';
import { IntegrationMapper, ProviderMapper, RequestMapper, ResponseMapper } from './mappers';
import { IntegrationValidator, ProviderValidator, RequestValidator, ResponseValidator } from './validators';
import {
  IntegrationService,
  HttpGatewayFactory,
  RetryEngineFactory,
  CircuitBreakerRegistry,
  RateLimiterRegistry,
  ProviderRegistry,
  FailureHandler,
  getProviderRegistry,
  getCircuitBreakerRegistry,
  getRateLimiterRegistry,
  getFailureHandler,
} from './services';

/**
 * Integration Domain DI configuration keys.
 */
export const INTEGRATION_TOKENS = {
  // Repository
  INTEGRATION_REPOSITORY: Symbol.for('SupabaseIntegrationRepository'),
  
  // Mappers
  INTEGRATION_MAPPER: Symbol.for('IntegrationMapper'),
  PROVIDER_MAPPER: Symbol.for('ProviderMapper'),
  REQUEST_MAPPER: Symbol.for('RequestMapper'),
  RESPONSE_MAPPER: Symbol.for('ResponseMapper'),
  
  // Validators
  INTEGRATION_VALIDATOR: Symbol.for('IntegrationValidator'),
  PROVIDER_VALIDATOR: Symbol.for('ProviderValidator'),
  REQUEST_VALIDATOR: Symbol.for('RequestValidator'),
  RESPONSE_VALIDATOR: Symbol.for('ResponseValidator'),
  
  // Services
  INTEGRATION_SERVICE: Symbol.for('IntegrationService'),
  HTTP_GATEWAY: Symbol.for('IHttpGateway'),
  RETRY_ENGINE: Symbol.for('RetryEngine'),
  CIRCUIT_BREAKER_REGISTRY: Symbol.for('CircuitBreakerRegistry'),
  RATE_LIMITER_REGISTRY: Symbol.for('RateLimiterRegistry'),
  PROVIDER_REGISTRY: Symbol.for('ProviderRegistry'),
  FAILURE_HANDLER: Symbol.for('FailureHandler'),
} as const;

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
  integrationService: IntegrationService;
  circuitBreakerRegistry: CircuitBreakerRegistry;
  rateLimiterRegistry: RateLimiterRegistry;
  providerRegistry: ProviderRegistry;
  failureHandler: FailureHandler;
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
  const integrationService = new IntegrationService(integrationRepository);
  const circuitBreakerRegistry = getCircuitBreakerRegistry();
  const rateLimiterRegistry = getRateLimiterRegistry();
  const providerRegistry = getProviderRegistry();
  const failureHandler = getFailureHandler();

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
    integrationService,
    circuitBreakerRegistry,
    rateLimiterRegistry,
    providerRegistry,
    failureHandler,
  };
}
