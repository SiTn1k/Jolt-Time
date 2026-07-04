/**
 * Audit Domain Dependency Injection Registration
 *
 * Registers all audit domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAuditRepository } from './repositories/SupabaseAuditRepository';
import { AuditService } from './services/AuditService';
import { AuditEventSubscriber } from './subscribers/AuditEventSubscriber';
import { AuditMapper } from './mappers/AuditMapper';
import { CategoryMapper } from './mappers/CategoryMapper';
import { ActorMapper } from './mappers/ActorMapper';
import { AuditValidator, CategoryValidator, ActorValidator } from './validators';

/**
 * Audit Domain DI configuration keys.
 */
export const AUDIT_TOKENS = {
  AUDIT_REPOSITORY: Symbol.for('IAuditRepository'),
  AUDIT_SERVICE: Symbol.for('AuditService'),
  AUDIT_SUBSCRIBER: Symbol.for('AuditEventSubscriber'),
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

  // Service (Singleton - stateless)
  container.registerFactory(
    AuditService,
    () => new AuditService(container.resolve(SupabaseAuditRepository)),
    { lifetime: Lifetime.Singleton }
  );

  // Subscriber (Factory - new instance for each event bus)
  container.registerFactory(
    AuditEventSubscriber,
    () => new AuditEventSubscriber(container.resolve(SupabaseAuditRepository)),
    { lifetime: Lifetime.Transient }
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
  auditService: AuditService;
  auditSubscriber: AuditEventSubscriber;
  auditMapper: AuditMapper;
  categoryMapper: CategoryMapper;
  actorMapper: ActorMapper;
  auditValidator: AuditValidator;
  categoryValidator: CategoryValidator;
  actorValidator: ActorValidator;
} {
  const auditRepository = new SupabaseAuditRepository();
  const auditService = new AuditService(auditRepository);
  const auditSubscriber = new AuditEventSubscriber(auditRepository);
  const auditMapper = new AuditMapper();
  const categoryMapper = new CategoryMapper();
  const actorMapper = new ActorMapper();
  const auditValidator = new AuditValidator();
  const categoryValidator = new CategoryValidator();
  const actorValidator = new ActorValidator();

  return {
    auditRepository,
    auditService,
    auditSubscriber,
    auditMapper,
    categoryMapper,
    actorMapper,
    auditValidator,
    categoryValidator,
    actorValidator,
  };
}
