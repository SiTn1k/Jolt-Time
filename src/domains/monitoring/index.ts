/**
 * Monitoring Domain Module
 *
 * Production-ready Monitoring Domain for Jolt Time.
 * This module encapsulates all monitoring-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, services, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/monitoring/
 * ├── entities/        # Domain entities (HealthCheck, SystemMetric, ServiceStatus)
 * ├── repositories/    # Data access layer interfaces and implementations
 * ├── dto/            # Data Transfer Objects
 * ├── mappers/        # Entity-DTO mappers
 * ├── validators/      # Input validation
 * ├── events/         # Domain events
 * ├── types/          # Type definitions
 * ├── interfaces/     # Abstract interfaces
 * ├── value-objects/  # Immutable value objects
 * ├── services/       # MonitoringService, HealthCheckEngine, MetricCollector, HeartbeatSystem
 * ├── di.ts          # Dependency injection setup
 * └── index.ts        # Module exports
 * ```
 *
 * ## Key Principle
 *
 * **Monitoring NEVER modifies gameplay**
 * - Monitoring ONLY stores health checks, metrics, and service status
 * - Monitoring does NOT modify Currency, Inventory, Museum, Academy,
 *   Quest, Achievement, Guild, Rewards, or Notifications
 * - Monitoring is a pure observability layer
 *
 * ## Event Types Supported
 *
 * - Health Check Events (HealthChecked)
 * - Metric Recording Events (MetricRecorded)
 * - Service Status Events (ServiceOnline, ServiceOffline, ServiceHealthy, ServiceWarning, ServiceCritical)
 * - Heartbeat Events (HeartbeatReceived)
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   HealthCheck,
 *   SystemMetric,
 *   ServiceStatus,
 *   IMonitoringRepository,
 *   HealthStatus,
 *   MonitoringService,
 *   HealthCheckEngine,
 *   MetricCollector,
 *   HeartbeatSystem
 * } from './domains/monitoring';
 *
 * // Domain types and interfaces are exported
 * export * from './types';
 * export * from './interfaces';
 *
 * // Concrete implementations are exported by each folder
 * export * from './entities';
 * export * from './repositories';
 * export * from './dto';
 * export * from './mappers';
 * export * from './validators';
 * export * from './events';
 * export * from './value-objects';
 * export * from './services';
 *
 * // DI setup
 * export { registerMonitoringDependencies, MONITORING_TOKENS, setupMonitoringDomain } from './di';
 * ```
 */

/**
 * Types
 */
export * from './types';

/**
 * Interfaces
 */
export * from './interfaces';

/**
 * Entities
 */
export * from './entities';

/**
 * Repositories
 */
export * from './repositories';

/**
 * DTOs
 */
export * from './dto';

/**
 * Mappers
 */
export * from './mappers';

/**
 * Validators
 */
export * from './validators';

/**
 * Events
 */
export * from './events';

/**
 * Value Objects
 */
export * from './value-objects';

/**
 * Services
 */
export * from './services';

/**
 * Dependency Injection
 */
export { registerMonitoringDependencies, MONITORING_TOKENS, setupMonitoringDomain } from './di';
