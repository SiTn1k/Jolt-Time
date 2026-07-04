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
import { 
  MonitoringService, 
  createMonitoringService,
  type IMonitoringService 
} from './services/MonitoringService';
import { 
  HealthCheckEngine, 
  createHealthCheckEngine,
  type HealthCheckEngineConfig 
} from './services/HealthCheckEngine';
import { 
  MetricCollector, 
  createMetricCollector,
  type MetricCollectorConfig 
} from './services/MetricCollector';
import { 
  HeartbeatSystem, 
  createHeartbeatSystem,
  type HeartbeatConfig 
} from './services/HeartbeatSystem';

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
  MONITORING_SERVICE: Symbol.for('MonitoringService'),
  HEALTH_CHECK_ENGINE: Symbol.for('HealthCheckEngine'),
  METRIC_COLLECTOR: Symbol.for('MetricCollector'),
  HEARTBEAT_SYSTEM: Symbol.for('HeartbeatSystem'),
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

  // Services (Singleton)
  container.registerSingleton<IMonitoringService>(MONITORING_TOKENS.MONITORING_SERVICE, (c) => {
    const repository = c.resolve(SupabaseMonitoringRepository);
    return createMonitoringService(repository);
  });

  container.registerSingleton<HealthCheckEngine>(MONITORING_TOKENS.HEALTH_CHECK_ENGINE, (c) => {
    const monitoringService = c.resolve<IMonitoringService>(MONITORING_TOKENS.MONITORING_SERVICE);
    return createHealthCheckEngine(monitoringService);
  });

  container.registerSingleton<MetricCollector>(MONITORING_TOKENS.METRIC_COLLECTOR, (c) => {
    const monitoringService = c.resolve<IMonitoringService>(MONITORING_TOKENS.MONITORING_SERVICE);
    return createMetricCollector(monitoringService);
  });

  container.registerSingleton<HeartbeatSystem>(MONITORING_TOKENS.HEARTBEAT_SYSTEM, (c) => {
    const monitoringService = c.resolve<IMonitoringService>(MONITORING_TOKENS.MONITORING_SERVICE);
    return createHeartbeatSystem(monitoringService);
  });
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
  monitoringService: MonitoringService;
  healthCheckEngine: HealthCheckEngine;
  metricCollector: MetricCollector;
  heartbeatSystem: HeartbeatSystem;
} {
  const healthValidator = new HealthValidator();
  const metricValidator = new MetricValidator();
  const serviceValidator = new ServiceValidator();
  const healthMapper = new HealthMapper();
  const metricMapper = new MetricMapper();
  const serviceMapper = new ServiceMapper();
  const monitoringMapper = new MonitoringMapper();
  const monitoringRepository = new SupabaseMonitoringRepository();
  const monitoringService = createMonitoringService(monitoringRepository);
  const healthCheckEngine = createHealthCheckEngine(monitoringService);
  const metricCollector = createMetricCollector(monitoringService);
  const heartbeatSystem = createHeartbeatSystem(monitoringService);

  return {
    monitoringRepository,
    monitoringMapper,
    healthMapper,
    metricMapper,
    serviceMapper,
    healthValidator,
    metricValidator,
    serviceValidator,
    monitoringService,
    healthCheckEngine,
    metricCollector,
    heartbeatSystem,
  };
}
