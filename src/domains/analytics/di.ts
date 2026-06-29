/**
 * Analytics Domain Dependency Injection Registration
 *
 * Registers all analytics domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAnalyticsRepository } from './repositories/SupabaseAnalyticsRepository';
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
export function registerAnalyticsDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(AnalyticsValidator, new AnalyticsValidator());
  container.registerInstance(MetricValidator, new MetricValidator());
  container.registerInstance(SessionValidator, new SessionValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(AnalyticsMapper, new AnalyticsMapper());
  container.registerInstance(SessionMapper, new SessionMapper());
  container.registerInstance(MetricMapper, new MetricMapper());

  // Repository (Singleton for simplicity)
  container.register(SupabaseAnalyticsRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for analytics domain.
 * Creates and configures all analytics domain components.
 */
export function setupAnalyticsDomain(): {
  analyticsRepository: SupabaseAnalyticsRepository;
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

  return {
    analyticsRepository,
    analyticsMapper,
    sessionMapper,
    metricMapper,
    analyticsValidator,
    metricValidator,
    sessionValidator,
  };
}
