/**
 * API Gateway Domain Dependency Injection Registration
 *
 * Registers all API Gateway domain services with the DI container.
 */

import type { Container } from '../../core/di/container';
import { Lifetime } from '../../core/di/container';
import { SupabaseApiGatewayRepository } from './repositories/SupabaseApiGatewayRepository';
import { RouteMapper } from './mappers/RouteMapper';
import { RequestMapper } from './mappers/RequestMapper';
import { ResponseMapper } from './mappers/ResponseMapper';
import { RouteValidator, RequestValidator, ResponseValidator } from './validators';

/**
 * API Gateway Domain DI configuration tokens.
 */
export const API_GATEWAY_TOKENS = {
  // Repository
  API_GATEWAY_REPOSITORY: Symbol.for('IApiGatewayRepository'),

  // Mappers
  ROUTE_MAPPER: Symbol.for('RouteMapper'),
  REQUEST_MAPPER: Symbol.for('RequestMapper'),
  RESPONSE_MAPPER: Symbol.for('ResponseMapper'),

  // Validators
  ROUTE_VALIDATOR: Symbol.for('RouteValidator'),
  REQUEST_VALIDATOR: Symbol.for('RequestValidator'),
  RESPONSE_VALIDATOR: Symbol.for('ResponseValidator'),
} as const;

/**
 * Register all API Gateway domain dependencies with the container.
 */
export function registerApiGatewayDependencies(container: Container): void {
  // Validators (Singleton - stateless)
  container.registerInstance(RouteValidator, new RouteValidator());
  container.registerInstance(RequestValidator, new RequestValidator());
  container.registerInstance(ResponseValidator, new ResponseValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(RouteMapper, new RouteMapper());
  container.registerInstance(RequestMapper, new RequestMapper());
  container.registerInstance(ResponseMapper, new ResponseMapper());

  // Repository (Singleton)
  container.registerFactory(
    SupabaseApiGatewayRepository,
    () => new SupabaseApiGatewayRepository(),
    { lifetime: Lifetime.Singleton }
  );
}

/**
 * Quick setup function for API Gateway domain.
 * Creates and configures all API Gateway domain components.
 */
export function setupApiGatewayDomain(): {
  apiGatewayRepository: SupabaseApiGatewayRepository;
  routeMapper: RouteMapper;
  requestMapper: RequestMapper;
  responseMapper: ResponseMapper;
  routeValidator: RouteValidator;
  requestValidator: RequestValidator;
  responseValidator: ResponseValidator;
} {
  const apiGatewayRepository = new SupabaseApiGatewayRepository();
  const routeMapper = new RouteMapper();
  const requestMapper = new RequestMapper();
  const responseMapper = new ResponseMapper();
  const routeValidator = new RouteValidator();
  const requestValidator = new RequestValidator();
  const responseValidator = new ResponseValidator();

  return {
    apiGatewayRepository,
    routeMapper,
    requestMapper,
    responseMapper,
    routeValidator,
    requestValidator,
    responseValidator,
  };
}
