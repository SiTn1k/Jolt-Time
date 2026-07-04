/**
 * Security Domain Dependency Injection Registration
 *
 * Registers all security domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseSecurityRepository } from './repositories/SupabaseSecurityRepository';
import { SecurityMapper } from './mappers/SecurityMapper';
import { IncidentMapper } from './mappers/IncidentMapper';
import { PolicyMapper } from './mappers/PolicyMapper';
import { SessionMapper } from './mappers/SessionMapper';
import { IncidentValidator, PolicyValidator, SessionValidator } from './validators';

/**
 * Security Domain DI configuration keys.
 */
export const SECURITY_TOKENS = {
  SECURITY_REPOSITORY: Symbol.for('ISecurityRepository'),
  SECURITY_MAPPER: Symbol.for('SecurityMapper'),
  INCIDENT_MAPPER: Symbol.for('IncidentMapper'),
  POLICY_MAPPER: Symbol.for('PolicyMapper'),
  SESSION_MAPPER: Symbol.for('SessionMapper'),
  INCIDENT_VALIDATOR: Symbol.for('IncidentValidator'),
  POLICY_VALIDATOR: Symbol.for('PolicyValidator'),
  SESSION_VALIDATOR: Symbol.for('SessionValidator'),
} as const;

/**
 * Register all security domain dependencies with the container.
 */
export function registerSecurityDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseSecurityRepository,
    () => new SupabaseSecurityRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mappers (Singleton - stateless)
  container.registerInstance(SecurityMapper, new SecurityMapper());
  container.registerInstance(IncidentMapper, new IncidentMapper());
  container.registerInstance(PolicyMapper, new PolicyMapper());
  container.registerInstance(SessionMapper, new SessionMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(IncidentValidator, new IncidentValidator());
  container.registerInstance(PolicyValidator, new PolicyValidator());
  container.registerInstance(SessionValidator, new SessionValidator());
}

/**
 * Quick setup function for security domain.
 * Creates and configures all security domain components.
 */
export function setupSecurityDomain(): {
  securityRepository: SupabaseSecurityRepository;
  securityMapper: SecurityMapper;
  incidentMapper: IncidentMapper;
  policyMapper: PolicyMapper;
  sessionMapper: SessionMapper;
  incidentValidator: IncidentValidator;
  policyValidator: PolicyValidator;
  sessionValidator: SessionValidator;
} {
  const securityRepository = new SupabaseSecurityRepository();
  const securityMapper = new SecurityMapper();
  const incidentMapper = new IncidentMapper();
  const policyMapper = new PolicyMapper();
  const sessionMapper = new SessionMapper();
  const incidentValidator = new IncidentValidator();
  const policyValidator = new PolicyValidator();
  const sessionValidator = new SessionValidator();

  return {
    securityRepository,
    securityMapper,
    incidentMapper,
    policyMapper,
    sessionMapper,
    incidentValidator,
    policyValidator,
    sessionValidator,
  };
}
