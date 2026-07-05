/**
 * Optimization Domain Module
 *
 * Production-ready Optimization Domain for Jolt Time.
 * This module encapsulates all optimization-related functionality including
 * entities, repositories, DTOs, mappers, validators, events, types, interfaces,
 * value objects, and dependency injection.
 *
 * ## Module Structure
 *
 * ```
 * src/domains/optimization/
 * ├── entities/        # Domain entities (PerformanceProfile, OptimizationRule, PerformanceSnapshot)
 * ├── repositories/    # Data access layer interfaces and implementations
 * ├── dto/             # Data Transfer Objects
 * ├── mappers/         # Entity-DTO mappers
 * ├── validators/      # Input validation
 * ├── events/          # Domain events
 * ├── types/           # Type definitions
 * ├── interfaces/      # Abstract interfaces
 * ├── value-objects/   # Immutable value objects
 * ├── di.ts            # Dependency injection setup
 * └── index.ts         # Module exports
 * ```
 *
 * ## Key Principle
 *
 * **Optimization NEVER modifies gameplay**
 * - Optimization ONLY stores performance profiles, rules, and snapshots
 * - Optimization does NOT modify Currency, Inventory, Museum, Academy,
 *   Quest, Achievement, Guild, Rewards, or Notifications
 * - Optimization is a pure performance analysis layer
 * - Optimization does NOT implement any optimization logic (Profiler, Memory Optimizer,
 *   Database Optimizer, Query Optimizer, Bundle Optimizer, Image Optimizer,
 *   Lazy Loading, Benchmark Engine) - these belong to P-193.2
 *
 * ## Types Supported
 *
 * - OptimizationLevel: Low, Medium, High, Critical
 * - OptimizationStatus: Pending, InProgress, Completed, Failed, Cancelled
 * - ProfileType: Module, Function, Api, Database, Cache, Memory, Cpu
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   PerformanceProfile,
 *   OptimizationRule,
 *   PerformanceSnapshot,
 *   IOptimizationRepository,
 *   OptimizationLevel,
 *   ProfileId,
 *   RuleId,
 *   SnapshotId
 * } from './domains/optimization';
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
 *
 * // DI setup
 * export { registerOptimizationDependencies, OPTIMIZATION_TOKENS, setupOptimizationDomain } from './di';
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
 * Dependency Injection
 */
export { registerOptimizationDependencies, OPTIMIZATION_TOKENS, setupOptimizationDomain, createOptimizationRepository } from './di';
