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
import { ApiGatewayService } from './services/ApiGatewayService';
import { RoutingEngine } from './services/RoutingEngine';
import { MiddlewarePipeline } from './services/MiddlewarePipeline';
import { RequestValidatorService } from './services/RequestValidatorService';
import { ResponseBuilder } from './services/ResponseBuilder';
import { FailureHandler } from './services/FailureHandler';

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

  // Services
  API_GATEWAY_SERVICE: Symbol.for('ApiGatewayService'),
  ROUTING_ENGINE: Symbol.for('RoutingEngine'),
  MIDDLEWARE_PIPELINE: Symbol.for('MiddlewarePipeline'),
  REQUEST_VALIDATOR_SERVICE: Symbol.for('RequestValidatorService'),
  RESPONSE_BUILDER: Symbol.for('ResponseBuilder'),
  FAILURE_HANDLER: Symbol.for('FailureHandler'),
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

  // Services
  container.registerFactory(
    RoutingEngine,
    () => new RoutingEngine(),
    { lifetime: Lifetime.Singleton }
  );

  container.registerFactory(
    MiddlewarePipeline,
    () => new MiddlewarePipeline(),
    { lifetime: Lifetime.Singleton }
  );

  container.registerFactory(
    RequestValidatorService,
    () => new RequestValidatorService(),
    { lifetime: Lifetime.Singleton }
  );

  container.registerFactory(
    ResponseBuilder,
    () => new ResponseBuilder(),
    { lifetime: Lifetime.Singleton }
  );

  container.registerFactory(
    FailureHandler,
    () => new FailureHandler(),
    { lifetime: Lifetime.Singleton }
  );

  // API Gateway Service (depends on repository)
  container.registerFactory(
    ApiGatewayService,
    () => {
      const repository = container.resolve(SupabaseApiGatewayRepository);
      return new ApiGatewayService(repository);
    },
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
  routingEngine: RoutingEngine;
  middlewarePipeline: MiddlewarePipeline;
  requestValidatorService: RequestValidatorService;
  responseBuilder: ResponseBuilder;
  failureHandler: FailureHandler;
  apiGatewayService: ApiGatewayService;
} {
  const apiGatewayRepository = new SupabaseApiGatewayRepository();
  const routeMapper = new RouteMapper();
  const requestMapper = new RequestMapper();
  const responseMapper = new ResponseMapper();
  const routeValidator = new RouteValidator();
  const requestValidator = new RequestValidator();
  const responseValidator = new ResponseValidator();
  const routingEngine = new RoutingEngine();
  const middlewarePipeline = new MiddlewarePipeline();
  const requestValidatorService = new RequestValidatorService();
  const responseBuilder = new ResponseBuilder();
  const failureHandler = new FailureHandler();
  const apiGatewayService = new ApiGatewayService(apiGatewayRepository);

  return {
    apiGatewayRepository,
    routeMapper,
    requestMapper,
    responseMapper,
    routeValidator,
    requestValidator,
    responseValidator,
    routingEngine,
    middlewarePipeline,
    requestValidatorService,
    responseBuilder,
    failureHandler,
    apiGatewayService,
  };
}
