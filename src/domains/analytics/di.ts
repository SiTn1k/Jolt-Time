/**
 * Analytics Domain Dependency Injection Registration
 *
 * Registers all analytics domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAnalyticsRepository } from './repositories/SupabaseAnalyticsRepository';
import { AnalyticsService, type AnalyticsServiceConfig } from './services/AnalyticsService';
import { AnalyticsEventSubscriber } from './subscribers/AnalyticsEventSubscriber';
import { AnalyticsMapper } from './mappers/AnalyticsMapper';
import { SessionMapper } from './mappers/SessionMapper';
import { MetricMapper } from './mappers/MetricMapper';
import { AnalyticsValidator } from './validators/AnalyticsValidator';
import { MetricValidator } from './validators/MetricValidator';
import { SessionValidator } from './validators/SessionValidator';

/**
 * Analytics Domain DI configuration keys.
 */
export const ANALYTICS_TOKENS = {
  ANALYTICS_REPOSITORY: Symbol.for('SupabaseAnalyticsRepository'),
  ANALYTICS_SERVICE: Symbol.for('AnalyticsService'),
  ANALYTICS_SUBSCRIBER: Symbol.for('AnalyticsEventSubscriber'),
  ANALYTICS_MAPPER: Symbol.for('AnalyticsMapper'),
  SESSION_MAPPER: Symbol.for('SessionMapper'),
  METRIC_MAPPER: Symbol.for('MetricMapper'),
  ANALYTICS_VALIDATOR: Symbol.for('AnalyticsValidator'),
  METRIC_VALIDATOR: Symbol.for('MetricValidator'),
  SESSION_VALIDATOR: Symbol.for('SessionValidator'),
} as const;

/**
 * Register all analytics domain dependencies with the container.
 */
export function registerAnalyticsDependencies(
  container: Container,
  config?: AnalyticsServiceConfig
): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(AnalyticsValidator, new AnalyticsValidator());
  container.registerInstance(MetricValidator, new MetricValidator());
  container.registerInstance(SessionValidator, new SessionValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(AnalyticsMapper, new AnalyticsMapper());
  container.registerInstance(SessionMapper, new SessionMapper());
  container.registerInstance(MetricMapper, new MetricMapper());

  // Repository (Singleton)
  container.register(SupabaseAnalyticsRepository, { lifetime: Lifetime.Singleton });

  // Service (Singleton) - using factory since DI container doesn't auto-inject
  container.registerFactory(AnalyticsService, () => {
    const repository = container.resolve(SupabaseAnalyticsRepository);
    return new AnalyticsService(repository, config);
  }, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for analytics domain.
 * Creates and configures all analytics domain components.
 */
export function setupAnalyticsDomain(config?: AnalyticsServiceConfig): {
  analyticsRepository: SupabaseAnalyticsRepository;
  analyticsService: AnalyticsService;
  analyticsSubscriber: AnalyticsEventSubscriber | null;
  analyticsMapper: AnalyticsMapper;
  sessionMapper: SessionMapper;
  metricMapper: MetricMapper;
  analyticsValidator: AnalyticsValidator;
  metricValidator: MetricValidator;
  sessionValidator: SessionValidator;
} {
  const analyticsRepository = new SupabaseAnalyticsRepository();
  const analyticsMapper = new AnalyticsMapper();
  const sessionMapper = new SessionMapper();
  const metricMapper = new MetricMapper();
  const analyticsValidator = new AnalyticsValidator();
  const metricValidator = new MetricValidator();
  const sessionValidator = new SessionValidator();
  const analyticsService = new AnalyticsService(analyticsRepository, config);

  // Subscriber requires event bus which may not be available in simple setup
  let analyticsSubscriber: AnalyticsEventSubscriber | null = null;

  return {
    analyticsRepository,
    analyticsService,
    analyticsSubscriber,
    analyticsMapper,
    sessionMapper,
    metricMapper,
    analyticsValidator,
    metricValidator,
    sessionValidator,
  };
}

/**
 * Creates AnalyticsService with repository.
 */
export function createAnalyticsService(
  repository: SupabaseAnalyticsRepository,
  config?: AnalyticsServiceConfig
): AnalyticsService {
  return new AnalyticsService(repository, config);
}

/**
 * Creates AnalyticsEventSubscriber.
 * Requires event bus and analytics service.
 */
export function createAnalyticsSubscriber(
  eventBus: unknown,
  analyticsService: AnalyticsService
): AnalyticsEventSubscriber {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new AnalyticsEventSubscriber(eventBus as any, analyticsService);
}
