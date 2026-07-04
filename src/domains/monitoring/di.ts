/**
 * Monitoring Domain Dependency Injection Registration
 *
 * Registers all monitoring domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseMonitoringRepository } from './repositories/SupabaseMonitoringRepository';
import { MonitoringMapper } from './mappers/MonitoringMapper';
import { HealthMapper } from './mappers/HealthMapper';
import { MetricMapper } from './mappers/MetricMapper';
import { ServiceMapper } from './mappers/ServiceMapper';
import { HealthValidator } from './validators/HealthValidator';
import { MetricValidator } from './validators/MetricValidator';
import { ServiceValidator } from './validators/ServiceValidator';

/**
 * Monitoring Domain DI configuration keys.
 */
export const MONITORING_TOKENS = {
  MONITORING_REPOSITORY: Symbol.for('SupabaseMonitoringRepository'),
  MONITORING_MAPPER: Symbol.for('MonitoringMapper'),
  HEALTH_MAPPER: Symbol.for('HealthMapper'),
  METRIC_MAPPER: Symbol.for('MetricMapper'),
  SERVICE_MAPPER: Symbol.for('ServiceMapper'),
  HEALTH_VALIDATOR: Symbol.for('HealthValidator'),
  METRIC_VALIDATOR: Symbol.for('MetricValidator'),
  SERVICE_VALIDATOR: Symbol.for('ServiceValidator'),
} as const;

/**
 * Register all monitoring domain dependencies with the container.
 */
export function registerMonitoringDependencies(container: Container): void {
  // Validators (Singleton - stateless, register first as they're used by others)
  container.registerInstance(HealthValidator, new HealthValidator());
  container.registerInstance(MetricValidator, new MetricValidator());
  container.registerInstance(ServiceValidator, new ServiceValidator());

  // Mappers (Singleton - stateless)
  container.registerInstance(HealthMapper, new HealthMapper());
  container.registerInstance(MetricMapper, new MetricMapper());
  container.registerInstance(ServiceMapper, new ServiceMapper());
  container.registerInstance(MonitoringMapper, new MonitoringMapper());

  // Repository (Singleton)
  container.register(SupabaseMonitoringRepository, { lifetime: Lifetime.Singleton });
}

/**
 * Quick setup function for monitoring domain.
 * Creates and configures all monitoring domain components.
 */
export function setupMonitoringDomain(): {
  monitoringRepository: SupabaseMonitoringRepository;
  monitoringMapper: MonitoringMapper;
  healthMapper: HealthMapper;
  metricMapper: MetricMapper;
  serviceMapper: ServiceMapper;
  healthValidator: HealthValidator;
  metricValidator: MetricValidator;
  serviceValidator: ServiceValidator;
} {
  const healthValidator = new HealthValidator();
  const metricValidator = new MetricValidator();
  const serviceValidator = new ServiceValidator();
  const healthMapper = new HealthMapper();
  const metricMapper = new MetricMapper();
  const serviceMapper = new ServiceMapper();
  const monitoringMapper = new MonitoringMapper();
  const monitoringRepository = new SupabaseMonitoringRepository();

  return {
    monitoringRepository,
    monitoringMapper,
    healthMapper,
    metricMapper,
    serviceMapper,
    healthValidator,
    metricValidator,
    serviceValidator,
  };
}
