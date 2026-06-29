/**
 * Admin Domain Dependency Injection Registration
 *
 * Registers all admin domain services with the DI container.
 */

import { Container, Lifetime } from '../../core/di';
import { SupabaseAdminRepository } from './repositories/SupabaseAdminRepository';
import { AdminMapper } from './mappers/AdminMapper';
import { RoleMapper } from './mappers/RoleMapper';
import { PermissionMapper } from './mappers/PermissionMapper';
import { AdminValidator, RoleValidator, PermissionValidator } from './validators';

/**
 * Admin Domain DI configuration keys.
 */
export const ADMIN_TOKENS = {
  ADMIN_REPOSITORY: Symbol.for('SupabaseAdminRepository'),
  ADMIN_MAPPER: Symbol.for('AdminMapper'),
  ROLE_MAPPER: Symbol.for('RoleMapper'),
  PERMISSION_MAPPER: Symbol.for('PermissionMapper'),
  ADMIN_VALIDATOR: Symbol.for('AdminValidator'),
  ROLE_VALIDATOR: Symbol.for('RoleValidator'),
  PERMISSION_VALIDATOR: Symbol.for('PermissionValidator'),
} as const;

/**
 * Register all admin domain dependencies with the container.
 */
export function registerAdminDependencies(container: Container): void {
  // Repository (Scoped - one instance per request)
  container.registerFactory(
    SupabaseAdminRepository,
    () => new SupabaseAdminRepository(),
    { lifetime: Lifetime.Scoped }
  );

  // Mappers (Singleton - stateless)
  container.registerInstance(AdminMapper, new AdminMapper());
  container.registerInstance(RoleMapper, new RoleMapper());
  container.registerInstance(PermissionMapper, new PermissionMapper());

  // Validators (Singleton - stateless)
  container.registerInstance(AdminValidator, new AdminValidator());
  container.registerInstance(RoleValidator, new RoleValidator());
  container.registerInstance(PermissionValidator, new PermissionValidator());
}

/**
 * Quick setup function for admin domain.
 * Creates and configures all admin domain components.
 */
export function setupAdminDomain(): {
  adminRepository: SupabaseAdminRepository;
  adminMapper: AdminMapper;
  roleMapper: RoleMapper;
  permissionMapper: PermissionMapper;
  adminValidator: AdminValidator;
  roleValidator: RoleValidator;
  permissionValidator: PermissionValidator;
} {
  const adminRepository = new SupabaseAdminRepository();
  const adminMapper = new AdminMapper();
  const roleMapper = new RoleMapper();
  const permissionMapper = new PermissionMapper();
  const adminValidator = new AdminValidator();
  const roleValidator = new RoleValidator();
  const permissionValidator = new PermissionValidator();

  return {
    adminRepository,
    adminMapper,
    roleMapper,
    permissionMapper,
    adminValidator,
    roleValidator,
    permissionValidator,
  };
}