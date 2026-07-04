/**
 * Audit Domain Dependency Injection Registration
 *
 * Registers all audit domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAuditRepository } from './repositories/SupabaseAuditRepository';
import { AuditMapper } from './mappers/AuditMapper';
import { CategoryMapper } from './mappers/CategoryMapper';
import { ActorMapper } from './mappers/ActorMapper';
import { AuditValidator, CategoryValidator, ActorValidator } from './validators';

/**
 * Audit Domain DI configuration keys.
 */
export const AUDIT_TOKENS = {
  AUDIT_REPOSITORY: Symbol.for('SupabaseAuditRepository'),
  AUDIT_MAPPER: Symbol.for('AuditMapper'),
  CATEGORY_MAPPER: Symbol.for('CategoryMapper'),
  ACTOR_MAPPER: Symbol.for('ActorMapper'),
  AUDIT_VALIDATOR: Symbol.for('AuditValidator'),
  CATEGORY_VALIDATOR: Symbol.for('CategoryValidator'),
  ACTOR_VALIDATOR: Symbol.for('ActorValidator'),
} as const;

/**
 * Register all audit domain dependencies with the container.
 */
export function registerAuditDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseAuditRepository,
    () => new SupabaseAuditRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mappers (Singleton - stateless)
  container.registerInstance(AuditMapper, new AuditMapper());
  container.registerInstance(CategoryMapper, new CategoryMapper());
  container.registerInstance(ActorMapper, new ActorMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(AuditValidator, new AuditValidator());
  container.registerInstance(CategoryValidator, new CategoryValidator());
  container.registerInstance(ActorValidator, new ActorValidator());
}

/**
 * Quick setup function for audit domain.
 * Creates and configures all audit domain components.
 */
export function setupAuditDomain(): {
  auditRepository: SupabaseAuditRepository;
  auditMapper: AuditMapper;
  categoryMapper: CategoryMapper;
  actorMapper: ActorMapper;
  auditValidator: AuditValidator;
  categoryValidator: CategoryValidator;
  actorValidator: ActorValidator;
} {
  const auditRepository = new SupabaseAuditRepository();
  const auditMapper = new AuditMapper();
  const categoryMapper = new CategoryMapper();
  const actorMapper = new ActorMapper();
  const auditValidator = new AuditValidator();
  const categoryValidator = new CategoryValidator();
  const actorValidator = new ActorValidator();

  return {
    auditRepository,
    auditMapper,
    categoryMapper,
    actorMapper,
    auditValidator,
    categoryValidator,
    actorValidator,
  };
}
